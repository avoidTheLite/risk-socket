import { WebSocket } from "ws";
import { startServer, TestWebSocket } from "./test/webSocketTestUtils";
import { describe, test, expect, beforeAll, afterAll, it } from '@jest/globals';
import { updateConnectionList, removeConnection } from "./updateConnectionList";

const port = 8080;
const url = `ws://localhost:${port}`;

describe('Update connection list - unit tests', () => {

    let server;
    const gameConnections = new Map<string, Set<WebSocket>>();
    const socketToGame = new Map<WebSocket, string>();
    beforeAll(async () => {
        server = await startServer(port);
        
    })
    afterAll(() => {
        server.close();
    })

    it('adds a client to the connection list', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        await client.waitUntil('open');
        const testSaveName = 'updateConnectionsList - test Save name 1';
        updateConnectionList(gameConnections, socketToGame, client, testSaveName);

        expect(gameConnections.get(testSaveName).size).toBe(1);
        client.close();
        await client.waitUntil('close');
    })

    it('removes a client from the connection list', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        await client.waitUntil('open');
        const testSaveName = 'updateConnectionsList - test Save name 1';
        updateConnectionList(gameConnections, socketToGame, client, testSaveName);
        expect(gameConnections.get(testSaveName).size).toBe(2);
        expect(socketToGame.get(client)).toBe(testSaveName);
        removeConnection(gameConnections, socketToGame, client);
        expect(gameConnections.get(testSaveName).size).toBe(1);
        expect(socketToGame.get(client)).toBeUndefined();
        client.close();
        await client.waitUntil('close');
    })

    it('switches a client to a new game when a different game is joined', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        await client.waitUntil('open');
        const testSaveName2 = 'updateConnectionsList - test Save name 2';
        const testSaveName3 = 'updateConnectionsList - test Save name 3';
        updateConnectionList(gameConnections, socketToGame, client, testSaveName2);
        expect(gameConnections.get(testSaveName2).size).toBe(1);
        updateConnectionList(gameConnections, socketToGame, client, testSaveName3);
        expect(gameConnections.get(testSaveName3).size).toBe(1);
        expect(socketToGame.get(client)).toBe(testSaveName3);
        client.close();
        await client.waitUntil('close');
    })
})