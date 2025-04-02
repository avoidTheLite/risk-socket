import { WebSocket } from "ws";
import { startServer, TestWebSocket } from "./test/webSocketTestUtils";
import { describe, test, expect, beforeAll, afterAll, it } from '@jest/globals';
import GameConnectionManager from "./GameConnectionManager";
import { promises } from "dns";

const port = 8080;
const url = `ws://localhost:${port}`;

describe('Update connection list - unit tests', () => {

    let server;
    const manager = new GameConnectionManager();


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
        manager.updateConnection(client, testSaveName);
        expect(manager.getConnections(testSaveName).length).toBe(1);
        client.close();
        await client.waitUntil('close');
    })

    it('removes a client from the connection list', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        await client.waitUntil('open');
        const testSaveName = 'updateConnectionsList - test Save name 1';
        manager.updateConnection(client, testSaveName);
        expect(manager.getConnections(testSaveName).length).toBe(2);
        expect(manager.getGame(client)).toBe(testSaveName);
        manager.removeConnection(client);
        expect(manager.getConnections(testSaveName).length).toBe(1);
        expect(manager.getGame(client)).toBeUndefined();
        client.close();
        await client.waitUntil('close');
    })

    it('switches a client to a new game when a different game is joined', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        await client.waitUntil('open');
        const testSaveName2 = 'updateConnectionsList - test Save name 2';
        const testSaveName3 = 'updateConnectionsList - test Save name 3';
        manager.updateConnection(client, testSaveName2);
        expect(manager.getConnections(testSaveName2).length).toBe(1);
        manager.updateConnection(client, testSaveName3);
        expect(manager.getConnections(testSaveName3).length).toBe(1);
        expect(manager.getGame(client)).toBe(testSaveName3);
        client.close();
        await client.waitUntil('close');
    })

    it('assigns designated players to a ws client', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        await client.waitUntil('open');
        const testSaveName = 'updateConnectionsList - test Save name 4';
        const playerIDs = [0, 1, 2, 3, 4];
        manager.assignPlayersToClient(client, testSaveName, playerIDs);
        expect(manager.getPlayers(client)).toEqual(playerIDs);
        client.close();
        await client.waitUntil('close');
    })

    it('removes players from a ws client', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        await client.waitUntil('open');
        const testSaveName = 'updateConnectionsList - test Save name 5';
        const playerIDs = [0, 1, 2, 3, 4];
        manager.assignPlayersToClient(client, testSaveName, playerIDs);
        expect(manager.getPlayers(client)).toEqual(playerIDs);
        manager.removePlayersFromClient(client, testSaveName, playerIDs);
        expect(manager.getPlayers(client).length).toBe(0);
        client.close();
        await client.waitUntil('close');
    })

    it('assigns a game host and does not reassign', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        const client2: TestWebSocket = new TestWebSocket(url);
        await Promise.all([client.waitUntil('open'), client2.waitUntil('open')]);

        const testSaveName = 'updateConnectionsList - test Save name 6';
        const playerIDs = [0, 1, 2, 3, 4];
        manager.assignGameHostIfNone(client, testSaveName);
        expect(manager.getHost(testSaveName)).toBe(client);
        manager.assignGameHostIfNone(client2, testSaveName);
        expect(manager.getHost(testSaveName)).toBe(client);
        client.close();
        client2.close()
        await Promise.all([client.waitUntil('close'), client2.waitUntil('close')]);
    })
})
