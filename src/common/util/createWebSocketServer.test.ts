import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import { startServer, TestWebSocket } from './test/webSocketTestUtils';
import createTestPlayers from './test/createTestPlayers';

const port = 8080;
const url = `ws://localhost:${port}`;

describe('WebSocket Server', () => {
    let server;

    beforeAll(async () => {
        server = await startServer(port);
    });

    afterAll(() => {
        server.close();
    })

    it('Returns a response to client successfully during ECHO', async () => {
        const client = new TestWebSocket(url);
        await client.waitUntil('open');

        const testMessage = {
            data: { 
                action: 'echo', 
                message: 'This is the Client test message'
            }
        }
        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })

        expect(JSON.parse(responseMessage).data.message).toEqual(testMessage.data.message);
        expect(JSON.parse(responseMessage).data.status).toEqual('success');
        client.close();
        await client.waitUntil('close');
    })
    
    it('Returns an INVALID MESSAGE FORMAT error to client if message does not contain data object', async () => {
        const client = new TestWebSocket(url);
        await client.waitUntil('open');

        const testMessage = 'This is the client test message';
        const expectedResponse = { error: 'Invalid message format' };

        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })

        expect(JSON.parse(responseMessage).data.status).toEqual('failure');
        expect(JSON.parse(responseMessage).data.action).toEqual('invalidAction');
        client.close();
        await client.waitUntil('close');
    })

    it('Returns an UNABLE TO PARSE JSON error when invalid JSON is sent', async () => {
        const client = new TestWebSocket(url);
        await client.waitUntil('open');
        const testMessage = "{data: 'This is not valid JSON message'}";
        const expectedResponse = { error: 'Unable to parse message' };

        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(testMessage);
        })

        expect(JSON.parse(responseMessage)).toEqual(expectedResponse)
        client.close();
        await client.waitUntil('close');
    })

    it('Returns a failure when an error occurs during processing', async () => {
        const client = new TestWebSocket(url);
        await client.waitUntil('open');
        const testMessage = {
            data: { 
                action: 'newGame', 
                message: 'This is the Client test message',
                players: createTestPlayers(2),
                globe: 'invalidGlobeID'
            }
        }

        const responseMessage: string = await new Promise ((resolve) => {
            client.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client.send(JSON.stringify(testMessage));
        })

        expect(JSON.parse(responseMessage).data.status).toEqual('failure');
        expect(JSON.parse(responseMessage).data.message).toContain('There was an error procesing your request');
        client.close();
        await client.waitUntil('close');
    })

    it('Returns a response to both connected clients', async () => {
        const client1 = new TestWebSocket(url);
        const client2 = new TestWebSocket(url);
        await Promise.all([client1.waitUntil('open'), client2.waitUntil('open')]);

        const testMessage1 = {
            data: { 
                action: 'newGame', 
                message: 'This is the Client test message',
                players: createTestPlayers(2),
                globeID: 'defaultGlobeID',
                saveName: 'testSaveName',
                gameOptions: {
                    randomAssignment:false,
                }
            }
        }
        const responseMessage: string = await new Promise ((resolve) => {
            client1.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            client1.send(JSON.stringify(testMessage1));
        })

        const testMessage2 = {
            data: {
                action: 'deploy',
                playerID: 0,
                deployment: {
                    targetCountry: 0,
                    armies: 19,
                },
                saveName: 'testSaveName',
            }
        }

        const [responseMessage1, responseMessage2] = await Promise.all([
            new Promise<string> ((resolve) => {
                client1.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
            }),
            new Promise<string> ((resolve)  => {
                client2.addEventListener('message', ({data}) => resolve(data.toString('utf-8')), {once: true});
                client2.send(JSON.stringify(testMessage2));
            })
        ]);

        expect(JSON.parse(responseMessage1).data.status).toEqual('success');
        expect(JSON.parse(responseMessage1).data.action).toEqual('deploy');
        console.log(JSON.parse(responseMessage1))
        console.log(JSON.parse(responseMessage2))
        expect(JSON.parse(responseMessage2).data.status).toEqual('success');
        expect(JSON.parse(responseMessage2).data.action).toEqual('deploy');
        client1.close();
        client2.close();
        await Promise.all([client1.waitUntil('close'), client2.waitUntil('close')]);
    })
});