import { startServer, TestWebSocket } from "./webSocketTestUtils";
import createTestPlayers from "./createTestPlayers";
import { describe, test, expect, beforeAll, afterAll} from '@jest/globals';
import { Game, WsRequest, WsActions } from "../../types/types";

const port = 8081;
const url = `ws://localhost:${port}`;

describe('Websocket end to end flow tests', () => {
    let server;
    let game: Game;
    let client: TestWebSocket;

    beforeAll(async () => {
        server = await startServer(port);
        client = new TestWebSocket(url);
        await client.waitUntil('open');
    });

    afterAll(async () => {
        server.close();
        client.close();
        await client.waitUntil('close');
    });

    test('Creates a new game', async () => {
        // const client: TestWebSocket = new TestWebSocket(url);
        // await client.waitUntil('open');
        const testMessage = {
            data: { 
                action: 'newGame', 
                message: 'This is the Client test message',
                players: createTestPlayers(2),
                globeID: 'defaultGlobeID',
                gameOptions: {
                    randomAssignment:false,
                }
            }
        }

        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;

        expect(JSON.parse(responseMessage).data.status).toEqual('success');

    });

    test('Deploy troops - Player 0', async () => {
        const testMessage = {
            data: {
                action: 'deploy',
                playerID: 0,
                deployment: {
                    targetCountry: 0,
                    armies: 19,
                },
                saveName: game.saveName
            }
        }

        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.countries[0].armies).toEqual(testMessage.data.deployment.armies+1);
        expect(game.players[0].armies).toEqual(0);

    });

    test('end turn - Player 0', async () => {
        const testMessage = {
            data: {
                action: 'endTurn',
                playerID: 0,
                saveName: game.saveName
            }
        }
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.activePlayerIndex).toEqual(1);
    });

    test('Deploy troops - Player 1', async () => {
        const testMessage = {
            data: {
                action: 'deploy',
                playerID: 1,
                deployment: {
                    targetCountry: 1,
                    armies: 19,
                },
                saveName: game.saveName
            }
        }

        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.countries[1].armies).toEqual(testMessage.data.deployment.armies+1);
        expect(game.players[1].armies).toEqual(0);

    });

    test('end turn - Player 1', async () => {
        const testMessage = {
            data: {
                action: 'endTurn',
                playerID: 1,
                saveName: game.saveName
            }
        }
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.activePlayerIndex).toEqual(0);
        expect(game.phase).toEqual('play');
        expect(game.turn).toEqual(1);
    });

    test('Deploy troops - Player 0', async () => {
        const testMessage = {
            data: {
                action: 'deploy',
                playerID: 0,
                deployment: {
                    targetCountry: 0,
                    armies: game.players[0].armies,
                },
                saveName: game.saveName
            }
        }
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.players[0].armies).toEqual(0);
        expect(game.turnTracker.phase).toEqual('combat');
    })

    test('Attack - Player 0', async () => {
        const testMessage: WsRequest = {
            data: {
                action: 'attack' as WsActions,
                message: 'This is the Client test message',
                playerID: 0,
                engagement: {
                    attackingCountry: 0,
                    defendingCountry: 1,
                    attackingTroopCount: 3,
                },
                saveName: game.saveName
            }
        }
        const armiesBeforeAttack: number = game.countries[0].armies + game.countries[1].armies;
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.countries[0].armies + game.countries[1].armies).toEqual(armiesBeforeAttack - 2);
        expect(JSON.parse(responseMessage).data.engagement.attackersLost +
            JSON.parse(responseMessage).data.engagement.defendersLost).toEqual(2);
    });

    test('end turn - Player 0', async () => {
        const testMessage = {
            data: {
                action: 'endTurn',
                playerID: 0,
                saveName: game.saveName
            }
        }
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.activePlayerIndex).toEqual(1);
        expect(game.turn).toEqual(2);
    });

    test('Deploy troops - Player 1', async () => {
        const testMessage = {
            data: {
                action: 'deploy',
                playerID: 1,
                deployment: {
                    targetCountry: 1,
                    armies: game.players[1].armies,
                },
                saveName: game.saveName
            }
        }
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.players[1].armies).toEqual(0);
        expect(game.turnTracker.phase).toEqual('combat');
    });

    test('Attack - Player 1', async () => {
        const testMessage: WsRequest = {
            data: {
                action: 'attack' as WsActions,
                message: 'This is the Client test message',
                playerID: 1,
                engagement: {
                    attackingCountry: 1,
                    defendingCountry: 0,
                    attackingTroopCount: 3,
                },
                saveName: game.saveName
            }
        }
        const armiesBeforeAttack: number = game.countries[0].armies + game.countries[1].armies;
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.countries[0].armies + game.countries[1].armies).toEqual(armiesBeforeAttack - 2);
        expect(JSON.parse(responseMessage).data.engagement.attackersLost +
            JSON.parse(responseMessage).data.engagement.defendersLost).toEqual(2);
    });

    test('end turn - Player 1', async () => {
        const testMessage = {
            data: {
                action: 'endTurn',
                playerID: 1,
                saveName: game.saveName
            }
        }
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.activePlayerIndex).toEqual(0);
        expect(game.phase).toEqual('play');
        expect(game.turn).toEqual(3);
    });

    test('Deploy troops - Player 0', async () => {
        const testMessage = {
            data: {
                action: 'deploy',
                playerID: 0,
                deployment: {
                    targetCountry: 0,
                    armies: game.players[0].armies,
                },
                saveName: game.saveName
            }
        }
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.players[0].armies).toEqual(0);
        expect(game.turnTracker.phase).toEqual('combat');
    });

    test('Attack and conquer - Player 0', async () => {
        const testMessage: WsRequest = {
            data: {
                action: 'attack' as WsActions,
                message: 'This is the Client test message',
                playerID: 0,
                engagement: {
                    attackingCountry: 0,
                    defendingCountry: 5,
                    attackingTroopCount: 3,
                },
                saveName: game.saveName
            }
        }
        let responseMessage: string
        while (game.countries[5].armies > 0) {
            responseMessage = await new Promise ((resolve) => {
                client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
                client.send(JSON.stringify(testMessage));
            })
            game = JSON.parse(responseMessage).data.gameState;
        }
        const conquerMessage: WsRequest = {
            data: {
                action: 'conquer' as WsActions,
                message: 'This is the Client test message',
                playerID: 0,
                engagement: {
                    attackingCountry: 0,
                    defendingCountry: 5,
                    attackingTroopCount: 5,
                    conquered: true
                },
                saveName: game.saveName
            }
        }
        responseMessage = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(conquerMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.countries[5].armies).toEqual(5);
        expect(game.countries[5].ownerID).toEqual(0);

    });

    test('Move - Player 1: Alaska to Kamchatka', async () => {
        const testMessage: WsRequest = {
            data: {
                action: 'move' as WsActions,
                message: 'This is the Client test message',
                playerID: 0,
                movement: {
                    targetCountry: 5,
                    sourceCountry: 0,
                    armies: 2,
                },
                saveName: game.saveName
            }
        }
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.countries[5].armies).toEqual(7);
    })

    test('end turn - Player 0', async () => {
        const testMessage = {
            data: {
                action: 'endTurn',
                playerID: 0,
                saveName: game.saveName
            }
        }
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })
        game = JSON.parse(responseMessage).data.gameState;
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        expect(game.activePlayerIndex).toEqual(1);
        expect(game.players[0].cards.length).toEqual(1);
    });

})