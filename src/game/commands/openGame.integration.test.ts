import openGame from "./openGame";
import { Game, WsResponse, WsRequest, WsActions } from "../../common/types/types";
import { describe, test, expect } from '@jest/globals';
import createTestGame from "../../common/util/test/createTestGame";
import createTestPlayers from "../../common/util/test/createTestPlayers";
import { manager } from "../../common/util/createWebSocketServer";
import { openGameError } from "../../common/types/errors";
import { TestWebSocket, startServer } from "../../common/util/test/webSocketTestUtils";
import { Server } from "ws";
import { resolveModuleName } from "typescript";
import { response } from "express";

const port = 8080;
const url = `ws://localhost:${port}`;

describe('Open Game - Unit Tests', () => {
    let server;
    let client: TestWebSocket;
    let testGame: Game;

    beforeAll(async () => {
        server = await startServer(8080);
    });

    beforeEach(async () => {
        client = new TestWebSocket(url);
        await client.waitUntil('open');

        const newGameMessage = {
                    data: { 
                        action: 'newGame', 
                        message: 'This is the Client test message',
                        players: createTestPlayers(4),
                        globeID: 'defaultGlobeID',
                        gameOptions: {
                            randomAssignment:false,
                        }
                    }
                }
        
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(newGameMessage));
        })
        testGame = JSON.parse(responseMessage).data.gameState;
    })

    afterEach(async () => {
        client.close();
        await client.waitUntil('close');
      });

    afterAll(async () => {
        server.close();
        client.close();
        await client.waitUntil('close')
    })

    test('should successfully open a game', async () => {
        const slotsToOpen: number[] = [2, 3];
        const request: WsRequest = {
            data: {
                action: 'openGame' as WsActions,
                message: 'Test client message',
                playerSlots: slotsToOpen,
                saveName: testGame.saveName
            }
        }

        const responseMessage: string = await new Promise ((resolve) => { 
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(request));
        })

        const expectedResponseMessage: string = `Successfully opened Player Slots: ${request.data.playerSlots.join(', ')} `
        const data = JSON.parse(responseMessage).data;
        expect(data.message).toEqual(expectedResponseMessage);
        expect(data.status).toBe('success');
    })
    test('should return message addendum if opening SOME players that dont exist', async () => {
        const slotsToOpen: number[] = [3, 4];
        const request: WsRequest = {
            data: {
                action: 'openGame' as WsActions,
                message: 'Test client message',
                playerSlots: slotsToOpen,
                saveName: testGame.saveName
            }
        }

        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(request));
        })
        const response = JSON.parse(responseMessage)
        expect(manager.getOpenGameSlots(testGame.saveName)).toEqual(slotsToOpen);
        expect(response.data.status).toBe('success');
        expect(response.data.message).toContain('However, these invalid Player IDs: 4 were ignored.');
    })

    test('should return an error if NO opening players exist', async () => {
        const slotsToOpen: number[] = [4, 5];
        const request: WsRequest = {
            data: {
                action: 'openGame' as WsActions,
                message: 'Test client message',
                playerSlots: slotsToOpen,
                saveName: testGame.saveName
            }
        }
        
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(request));
        })
        const response = JSON.parse(responseMessage);
        expect(response.data.status).toBe('failure');
        expect(response.data.message).toContain(`No Valid player IDs submitted. Unable to open player IDs ${request.data.playerSlots.join(', ')}`)
        

    })
})