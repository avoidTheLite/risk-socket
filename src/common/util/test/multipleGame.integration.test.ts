
import createTestPlayers from "./createTestPlayers";
import newGame from "../../../game/newGame";
import { beforeAll, afterAll, describe, test, expect } from '@jest/globals';
import { Game, WsActions, WsRequest } from "../../types/types";
import { startServer, TestWebSocket } from "./webSocketTestUtils";

const port = 8081;
const url = `ws://localhost:${port}`;

describe('Multiple game tests', () => {
    let games: Game[] = [];

    let server;
    let client: TestWebSocket
    beforeAll(async () => {
        server = await startServer(port);
        client = new TestWebSocket(url);
        await client.waitUntil('open');
        games[0] = await newGame(createTestPlayers(2), 'defaultGlobeID');
        games[1] = await newGame(createTestPlayers(4), 'defaultGlobeID');
    })

    afterAll(async () => {
        server.close();
        client.close();
        await client.waitUntil('close');
    });


    test('should allow game 2 to function correctly after game 1 starts', async () => {
        let game: Game;
        let testMessage: WsRequest = {
            data: {
                action: 'deploy' as WsActions,
                message: 'This is the Client test message',
                playerID: 0,
                deployment: {
                    targetCountry: 0,
                    armies: 19,
                },
                saveName: games[0].saveName
            }
        }
        let responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        testMessage = {
            data: {
                action: 'endTurn' as WsActions,
                message: 'This is the Client test message',
                playerID: 0,
                saveName: game.saveName
            }
        }
        responseMessage = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(game.activePlayerIndex).toEqual(1);
        expect(game.players[game.activePlayerIndex-1].armies).toEqual(0);

        let testMessage2: WsRequest = {
            data: {
                action: 'deploy' as WsActions,
                message: 'This is the Client test message',
                playerID: 0,
                deployment: {
                    targetCountry: 0,
                    armies: 19,
                },
                saveName: games[1].saveName
            }
        }
        const responseMessage2: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage2));
        })
        game = JSON.parse(responseMessage2).data.gameState;
        expect(game.activePlayerIndex).toEqual(0);
        expect(game.players[game.activePlayerIndex].armies).toEqual(0);
    })
})