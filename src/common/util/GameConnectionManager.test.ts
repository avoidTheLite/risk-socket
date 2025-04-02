import createMockSocket from "./test/createMockSocket";
import GameConnectionManager from "./GameConnectionManager";
import { WebSocket } from "ws";

describe('GameConnectionManager - Unit tests', () => {
    let manager: GameConnectionManager;
    let ws: WebSocket;

    beforeAll(() => {
        ws = createMockSocket();
    })

    beforeEach(() => {
        manager = new GameConnectionManager();
    })

    test('adds a client to the connection list', () => {
        const testSaveName = 'updateConnectionsList - test Save name 1';
        manager.updateConnection(ws, testSaveName);
        expect(manager.getConnections(testSaveName)).toContain(ws);
    })

    test('switches a client to a new game when a different game is joined', () => {
        const testSaveName2 = 'updateConnectionsList - test Save name 2';
        const testSaveName3 = 'updateConnectionsList - test Save name 3';
        manager.updateConnection(ws, testSaveName2);
        expect(manager.getConnections(testSaveName2)).toContain(ws);
        manager.updateConnection(ws, testSaveName3);
        expect(manager.getConnections(testSaveName3)).toContain(ws);
        expect(manager.getConnections(testSaveName2)).not.toContain(ws);
    })

    test('removes a client from the connection list', () => {
        const testSaveName = 'updateConnectionsList - test Save name 1';
        manager.updateConnection(ws, testSaveName);
        expect(manager.getConnections(testSaveName)).toContain(ws);
        manager.removeConnection(ws);
        expect(manager.getConnections(testSaveName)).not.toContain(ws);
        expect(manager.getConnections(testSaveName).length).toBe(0);
    })

    test('assigns a game host if there is no game host yet', () => {
        const testSaveName = 'updateConnectionsList - test Save name 1';
        manager.assignGameHostIfNone(ws, testSaveName);
        expect(manager.getHost(testSaveName)).toBe(ws);
    })

    test('does not reassign a game host when one is present', () => {
        const testSaveName = 'updateConnectionsList - test Save name 1';
        const ws2 = createMockSocket();
        manager.assignGameHostIfNone(ws, testSaveName);
        manager.assignGameHostIfNone(ws2, testSaveName);
        expect(manager.getHost(testSaveName)).toBe(ws);
    })

    test('successfully promotes a new game host', () => {
        const testSaveName = 'updateConnectionsList - test Save name 1';
        const ws2 = createMockSocket();
        manager.assignGameHostIfNone(ws, testSaveName);
        manager.promoteNewHost(ws2, testSaveName);
        expect(manager.getHost(testSaveName)).toBe(ws2);
    })

    test('assigns designated players to a ws client', () => {
        const testSaveName = 'updateConnectionsList - test Save name 1';
        const playerIDs = [0, 1, 2, 3, 4];
        manager.assignPlayersToClient(ws, testSaveName, playerIDs);
        expect(manager.getPlayers(ws)).toEqual(playerIDs);
    })

    test('adds new players to a client with an existing set of players', () => {
        const testSaveName = 'updateConnectionsList - test Save name 1';
        const playerIDs = [0, 1, 2];
        const newPlayerIDs = [3, 4];
        manager.assignPlayersToClient(ws, testSaveName, playerIDs);
        expect(manager.getPlayers(ws)).toEqual(playerIDs);
        manager.assignPlayersToClient(ws, testSaveName, newPlayerIDs);
        expect(manager.getPlayers(ws)).toEqual([...playerIDs, ...newPlayerIDs]);
    })

    test('removes specified players from a client', () => {
        const testSaveName = 'updateConnectionsList - test Save name 1';
        const playerIDs = [0, 1, 2, 3, 4];
        const removedPlayerIDs = [2, 3]
        manager.assignPlayersToClient(ws, testSaveName, playerIDs);
        expect(manager.getPlayers(ws)).toEqual(playerIDs);
        manager.removePlayersFromClient(ws, testSaveName, removedPlayerIDs);
        expect(manager.getPlayers(ws)).not.toEqual(expect.arrayContaining(removedPlayerIDs));
    })

    test('successfully reassigns players from one client to another', () => {
        const testSaveName = 'updateConnectionsList - test Save name 1';
        const ws2 = createMockSocket();
        const playerIDs = [0, 1, 2, 3, 4];
        const reassignedPlayerIDs = [2, 3];
        manager.assignPlayersToClient(ws, testSaveName, playerIDs);
        manager.reassignPlayers(ws2, testSaveName, reassignedPlayerIDs);
        expect(manager.getPlayers(ws)).not.toEqual(expect.arrayContaining(reassignedPlayerIDs));
        expect(manager.getPlayers(ws2)).toEqual(expect.arrayContaining(reassignedPlayerIDs));
    })

    test('Successfully disconnects a client from the game', () => {
        const testSaveName = 'updateConnectionsList - test Save name 1';
        const ws2 = createMockSocket();
        const hostPlayerIDs = [0, 1, 2];
        const ws2PlayerIDs = [3, 4];
        manager.updateConnection(ws, testSaveName);
        manager.assignGameHostIfNone(ws, testSaveName);
        manager.updateConnection(ws2, testSaveName);
        manager.assignPlayersToClient(ws, testSaveName, hostPlayerIDs);
        manager.assignPlayersToClient(ws2, testSaveName, ws2PlayerIDs);
        expect(manager.getPlayers(ws)).toEqual(hostPlayerIDs);
        expect(manager.getPlayers(ws2)).toEqual(ws2PlayerIDs);
        manager.handleDisconnect(ws2);
        expect(manager.getPlayers(ws2).length).toEqual(0);
        expect(manager.getPlayers(ws)).toEqual(expect.arrayContaining(hostPlayerIDs))
        expect(manager.getPlayers(ws)).toEqual(expect.arrayContaining(ws2PlayerIDs))
    })

    test('Successfully promotes new host when host client disconnects', () => {
        const testSaveName = 'updateConnectionsList - test Save name 1';
        const ws2 = createMockSocket();
        const hostPlayerIDs = [0, 1, 2];
        const ws2PlayerIDs = [3, 4];
        manager.updateConnection(ws, testSaveName);
        manager.assignGameHostIfNone(ws, testSaveName);
        manager.updateConnection(ws2, testSaveName);
        manager.assignPlayersToClient(ws, testSaveName, hostPlayerIDs);
        manager.assignPlayersToClient(ws2, testSaveName, ws2PlayerIDs);
        expect(manager.getPlayers(ws)).toEqual(hostPlayerIDs);
        expect(manager.getPlayers(ws2)).toEqual(ws2PlayerIDs);
        manager.handleDisconnect(ws);
        expect(manager.getPlayers(ws).length).toEqual(0);
        expect(manager.getHost(testSaveName)).toBe(ws2);

    })

})