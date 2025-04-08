import { TestWebSocket, startServer } from "../../common/util/test/webSocketTestUtils";
import { describe, test, expect } from '@jest/globals';
import { GameSlots, WsResponse, WsRequest, WsActions } from "../../common/types/types";
import createTestPlayers from "../../common/util/test/createTestPlayers";
import { manager } from "../../common/util/createWebSocketServer";

const port = 8080;
const url = `ws://localhost:${port}`;

describe('View open games - Integration tests', () => {
    let server;
    let client1: TestWebSocket;
    let client2: TestWebSocket
    let testSaveName1: string;
    let testSaveName2: string;

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

    const viewOpenGamesRequest: WsRequest = {
        data: { 
            action: 'viewOpenGames' as WsActions,
            message: 'This is the Client test message',
        }
    }

    beforeAll(async () => {
        server = await startServer(8080);
        client1 = new TestWebSocket(url);
        client2 = new TestWebSocket(url);
        await Promise.all([client1.waitUntil('open'), client2.waitUntil('open')]);

        
        const newGameResponse: string = await new Promise ((resolve) => {
            client1.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client1.send(JSON.stringify(newGameMessage));
        })

        testSaveName1 = JSON.parse(newGameResponse).data.gameState.saveName;
        console.log(`Created test game 1 ${testSaveName1}`);
    })

    afterAll(async () => {
        server.close();
        client1.close();
        client2.close();
        await Promise.all([client1.waitUntil('close'), client2.waitUntil('close')]);
    })

    test('Should return an empty array when there are no open games', async () => {
        
        const viewOpenGamesResponse: string = await new Promise ((resolve) => {
            client2.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client2.send(JSON.stringify(viewOpenGamesRequest));
        })

        const response = JSON.parse(viewOpenGamesResponse) as WsResponse;
        expect(response.data.status).toBe('success');
        expect(response.data.gameSlots.length).toBe(0);

    })

    test('Should return a list of open games when they exist', async () => {
        
        manager.openGame(testSaveName1, [3,4]);

        const viewOpenGamesResponse: string = await new Promise ((resolve) => {
            client2.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client2.send(JSON.stringify(viewOpenGamesRequest));
        })

        const response = JSON.parse(viewOpenGamesResponse) as WsResponse;
        expect(response.data.status).toBe('success');
        expect(response.data.gameSlots.length).toBe(1);
        expect(response.data.gameSlots[0].saveName).toBe(testSaveName1);
        expect(response.data.gameSlots[0].playerSlots).toEqual([3,4]);
    })

    test('Should return multiple open games when multiple exist', async () => {

        const newGameResponse: string = await new Promise ((resolve) => {
            client2.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client2.send(JSON.stringify(newGameMessage));
        })

        testSaveName2 = JSON.parse(newGameResponse).data.gameState.saveName;
        console.log(`Created test Game 2 ${testSaveName2}`);
       
        manager.openGame(testSaveName2, [4]);

        const viewOpenGamesResponse: string = await new Promise ((resolve) => {
            client2.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client2.send(JSON.stringify(viewOpenGamesRequest));
        })

        const response = JSON.parse(viewOpenGamesResponse) as WsResponse;
        expect(response.data.status).toBe('success');
        expect(response.data.gameSlots.length).toBe(2);
        expect(response.data.gameSlots[1].saveName).toBe(testSaveName2);
        expect(response.data.gameSlots[1].playerSlots).toEqual([4]);
    })

    
})