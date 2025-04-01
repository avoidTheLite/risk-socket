import { WebSocket } from "ws";
import { startServer, TestWebSocket } from "./test/webSocketTestUtils";
import { describe, test, expect, beforeAll, afterAll, it } from '@jest/globals';
import { updateConnectionList, removeConnection, assignPlayersToClients, removePlayersFromClients, checkAndAssignGameHost } from "./manageSocketConnections";
import { promises } from "dns";

const port = 8080;
const url = `ws://localhost:${port}`;

describe('Update connection list - unit tests', () => {

    let server;
    const gameToConnections = new Map<string, Set<WebSocket>>();
    const socketToGame = new Map<WebSocket, string>();
    const gameHosts = new Map<string, WebSocket>();
    const playersToClient = new Map<string, Map<number, WebSocket>>();
    const clientToPlayers = new Map<WebSocket, {saveName: string, playerIDs: number[]}>();

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
        updateConnectionList(gameToConnections, socketToGame, client, testSaveName);

        expect(gameToConnections.get(testSaveName).size).toBe(1);
        client.close();
        await client.waitUntil('close');
    })

    it('removes a client from the connection list', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        await client.waitUntil('open');
        const testSaveName = 'updateConnectionsList - test Save name 1';
        updateConnectionList(gameToConnections, socketToGame, client, testSaveName);
        expect(gameToConnections.get(testSaveName).size).toBe(2);
        expect(socketToGame.get(client)).toBe(testSaveName);
        removeConnection(gameToConnections, socketToGame, client);
        expect(gameToConnections.get(testSaveName).size).toBe(1);
        expect(socketToGame.get(client)).toBeUndefined();
        client.close();
        await client.waitUntil('close');
    })

    it('switches a client to a new game when a different game is joined', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        await client.waitUntil('open');
        const testSaveName2 = 'updateConnectionsList - test Save name 2';
        const testSaveName3 = 'updateConnectionsList - test Save name 3';
        updateConnectionList(gameToConnections, socketToGame, client, testSaveName2);
        expect(gameToConnections.get(testSaveName2).size).toBe(1);
        updateConnectionList(gameToConnections, socketToGame, client, testSaveName3);
        expect(gameToConnections.get(testSaveName3).size).toBe(1);
        expect(socketToGame.get(client)).toBe(testSaveName3);
        client.close();
        await client.waitUntil('close');
    })

    it('assigns designated players to a ws client', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        await client.waitUntil('open');
        const testSaveName = 'updateConnectionsList - test Save name 4';
        const playerIDs = [0, 1, 2, 3, 4];
        assignPlayersToClients(playersToClient, clientToPlayers, client, testSaveName, playerIDs);
        expect(playersToClient.get(testSaveName).size).toBe(5);
        expect(clientToPlayers.get(client).playerIDs).toEqual(playerIDs);
        client.close();
        await client.waitUntil('close');
    })

    it('removes players from a ws client', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        await client.waitUntil('open');
        const testSaveName = 'updateConnectionsList - test Save name 5';
        const playerIDs = [0, 1, 2, 3, 4];
        assignPlayersToClients(playersToClient, clientToPlayers, client, testSaveName, playerIDs);
        expect(playersToClient.get(testSaveName).size).toBe(5);
        expect(clientToPlayers.get(client).playerIDs).toEqual(playerIDs);
        removePlayersFromClients(playersToClient, clientToPlayers, client, testSaveName, playerIDs);
        expect(playersToClient.get(testSaveName).size).toBe(0);
        expect(clientToPlayers.get(client).playerIDs.length).toBe(0);
        client.close();
        await client.waitUntil('close');
    })

    it('assigns a game host and does not reassign', async () => {
        const client: TestWebSocket = new TestWebSocket(url);
        const client2: TestWebSocket = new TestWebSocket(url);
        await Promise.all([client.waitUntil('open'), client2.waitUntil('open')]);

        const testSaveName = 'updateConnectionsList - test Save name 6';
        const playerIDs = [0, 1, 2, 3, 4];
        checkAndAssignGameHost(gameHosts, client, testSaveName);
        expect(gameHosts.get(testSaveName)).toBe(client);
        checkAndAssignGameHost(gameHosts, client2, testSaveName);
        expect(gameHosts.get(testSaveName)).toBe(client);
        client.close();
        client2.close()
    })
})
