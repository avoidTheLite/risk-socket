import { describe, test, expect } from '@jest/globals';
import { GameAlreadyHostedError } from '../common/types/errors';
import { Game, WsRequest, WsResponse, WsActions } from '../common/types/types';
import { WebSocket } from 'ws';
import createMockSocket from '../common/util/test/createMockSocket';
import createWebSocketServer from '../common/util/createWebSocketServer';
import { startServer, TestWebSocket } from "../common/util/test/webSocketTestUtils";
import createTestPlayers from '../common/util/test/createTestPlayers';

const port = 8080;
const url = `ws://localhost:${port}`;

describe('Load and connectto an existing game', () => {
    let server;
    let client1: TestWebSocket;
    let client2: TestWebSocket;
    let testGame: Game;

    beforeAll(async () => {
        server = await startServer(port);
        client1 = new TestWebSocket(url);
        await client1.waitUntil('open');

        const newGameMessage: WsRequest = {
            data: { 
                action: 'newGame' as WsActions, 
                message: 'This is the Client test message',
                players: createTestPlayers(4),
                globeID: 'defaultGlobeID',
                gameOptions: {
                    randomAssignment:false,
                }
            }
        }

        const responseMessage: string = await new Promise ((resolve) => {
            client1.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client1.send(JSON.stringify(newGameMessage));
        })
        testGame = JSON.parse(responseMessage).data.gameState;
        


    });

    afterAll(async () => {
        server.close();
        client1.close();
        client2.close();
        await Promise.all([client1.waitUntil('close'), client2.waitUntil('close')]);

    })

    test('Throws an error if the game is already hosted', async () => {
        client2 = new TestWebSocket(url);
        await client2.waitUntil('open');

        const loadGameMessage: WsRequest = {
            data: { 
                action: 'loadGame' as WsActions, 
                message: 'This is the Client test message',
                saveName: testGame.saveName,
            }
        }

        const responseMessage: string = await new Promise ((resolve) => {
            client2.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client2.send(JSON.stringify(loadGameMessage));
        })
        
        const response = JSON.parse(responseMessage) as WsResponse;
        expect(response.data.status).toBe('failure');
        expect(response.data.message).toBe(`There was an error procesing your request Error: Unable to load game. Game with save name ${testGame.saveName} is already hosted`);
        
        client2.close();
        await client2.waitUntil('close');
    })

    test('Load saved game', async () => {
        client1.close();
        await client1.waitUntil('close');

        client2 = new TestWebSocket(url);
        await client2.waitUntil('open');

        const loadGameMessage: WsRequest = {
            data: { 
                action: 'loadGame' as WsActions, 
                message: 'This is the Client test message',
                saveName: testGame.saveName,
            }
        }

        const responseMessage: string = await new Promise ((resolve) => {
            client2.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client2.send(JSON.stringify(loadGameMessage));
        })
        const response = JSON.parse(responseMessage);

        expect(response.data.status).toBe('success');
        expect(response.data.gameState).toEqual(testGame);
        client2.close();
        await client2.waitUntil('close');
    })
})