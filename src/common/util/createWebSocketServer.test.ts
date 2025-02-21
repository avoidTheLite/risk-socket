import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import { startServer, TestWebSocket } from './test/webSocketTestUtils';

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

        expect(JSON.parse(responseMessage)).toEqual(testMessage);
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

        expect(JSON.parse(responseMessage)).toEqual(expectedResponse)
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
});