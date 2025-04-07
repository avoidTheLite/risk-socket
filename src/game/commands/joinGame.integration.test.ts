import { startServer, TestWebSocket } from "../../common/util/test/webSocketTestUtils";
import createTestPlayers from "../../common/util/test/createTestPlayers";
import { describe, test, expect } from '@jest/globals';
import { Game, WsRequest, WsActions, WsResponse } from "../../common/types/types";
import { manager } from "../../common/util/createWebSocketServer";

const port = 8080;
const url = `ws://localhost:${port}`;

describe('Join game integration tests', () => {
    let server;
    let game: Game;
    let client1: TestWebSocket;
    let client2: TestWebSocket;
    let testSaveName: string;

    beforeAll(async () => {
        server = await startServer(port);
        client1 = new TestWebSocket(url);
        client2 = new TestWebSocket(url);
        await Promise.all([client1.waitUntil('open'), client2.waitUntil('open')]);

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
        
        const newGameResponse: string = await new Promise ((resolve) => {
            client1.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client1.send(JSON.stringify(newGameMessage));
        })

        testSaveName = JSON.parse(newGameResponse).data.gameState.saveName;
    })

    afterAll(async () => {
        server.close();
        client1.close();
        client2.close();
        await Promise.all([client1.waitUntil('close'), client2.waitUntil('close')]);
    })

    test('Returns a failure status when joining a game with incorrect players', async () => {

        const joinGameMessage: WsRequest = {
            data: { 
                action: 'joinGame' as WsActions, 
                message: 'This is the Client test message',
                playerSlots: [3, 4],
                saveName: testSaveName,
            }
        }
        expect(manager.getConnections(testSaveName)).toHaveLength(1);

        const joinGameResponse: string = await new Promise ((resolve) => {
            client2.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client2.send(JSON.stringify(joinGameMessage));
        })

        const response: WsResponse = JSON.parse(joinGameResponse)
        expect(response.data.status).toBe('failure');
    })

    test('Returns a success status when joining a game with correct players', async () => {

        const joinGameMessage: WsRequest = {
            data: { 
                action: 'joinGame' as WsActions, 
                message: 'This is the Client test message',
                playerSlots: [3, 4],
                saveName: testSaveName,
            }
        }

        manager.openGame(testSaveName, [3, 4]);

        const joinGameResponse: string = await new Promise ((resolve) => {
            client2.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client2.send(JSON.stringify(joinGameMessage));
        })

        const response: WsResponse = JSON.parse(joinGameResponse)
        expect(response.data.message).toBe(`Successfully joined Player Slots: ${joinGameMessage.data.playerSlots.join(', ')}`);
        expect(response.data.status).toBe('success');
        (expect(manager.getConnections(testSaveName))).toHaveLength(2);
    })

})