import createMockSocket from "./test/createMockSocket";
import GameConnectionManager from "./GameConnectionManager";
import { WebSocket } from "ws";

let manager: GameConnectionManager;
let ws: WebSocket;
describe('GameConnectionManager - Unit tests', () => {

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
        expect(manager.getConnections(testSaveName)).toHaveLength(0);
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
        manager.openGame(testSaveName, reassignedPlayerIDs);
        manager.assignPlayersToClient(ws, testSaveName, playerIDs);
        manager.reassignPlayers(ws2, testSaveName, reassignedPlayerIDs);
        expect(manager.getPlayers(ws)).not.toEqual(expect.arrayContaining(reassignedPlayerIDs));
        expect(manager.getPlayers(ws2)).toEqual(expect.arrayContaining(reassignedPlayerIDs));
    })
})

describe('GameConnectionManager - Disconnect unit tests', () => {

    let testSaveName;
    let ws;
    let ws2;
    let hostPlayerIDs;
    let ws2PlayerIDs;
    beforeAll(() => {
    })
    
    beforeEach(() => {
        ws = createMockSocket();
        manager = new GameConnectionManager();
        testSaveName = 'updateConnectionsList - test Save name 1';
        ws2 = createMockSocket();
        hostPlayerIDs = [0, 1, 2];
        ws2PlayerIDs = [3, 4];
        manager.updateConnection(ws, testSaveName);
        manager.assignGameHostIfNone(ws, testSaveName);
        manager.updateConnection(ws2, testSaveName);
        manager.assignPlayersToClient(ws, testSaveName, hostPlayerIDs);
        manager.assignPlayersToClient(ws2, testSaveName, ws2PlayerIDs);
    })
    test('reassigns players when client disconnects', () => {
        
        manager.handleDisconnect(ws2);
        expect(manager.getPlayers(ws2)).toHaveLength(0);
        expect(manager.getPlayers(ws)).toEqual(expect.arrayContaining(hostPlayerIDs))
        expect(manager.getPlayers(ws)).toEqual(expect.arrayContaining(ws2PlayerIDs))
    })

    test('promotes new host when host client disconnects', () => {

        manager.handleDisconnect(ws);
        expect(manager.getHost(testSaveName)).toBe(ws2);

    })

    test('reassigns players to new host when the host client disconnects', () => {


        manager.handleDisconnect(ws);
        expect(manager.getPlayers(ws)).toHaveLength(0);
    })

    test('removes game from open games when all clients disconnect', () => {
        const slotsToOpen = [2];
        manager.openGame(testSaveName, slotsToOpen);
        manager.handleDisconnect(ws2);
        manager.handleDisconnect(ws);
        const openSaveGames = manager.getOpenGames().map((game) => game.saveName);
        expect(openSaveGames).not.toContain(testSaveName);
    })

})

describe('GameConnectionManager - Open Game unit tests', () => {

    beforeAll(() => {
        ws = createMockSocket();
    })

    beforeEach(() => {
        manager = new GameConnectionManager();
    })

    test('Successfully opens an existing game', () => {
        const testSaveName = 'updateConnectionsList - test Save name 1';
        manager.assignGameHostIfNone(ws, testSaveName);
        const hostPlayerIDs = [0, 1, 2, 3, 4];
        const playersToOpen = [3, 4];
        manager.openGame(testSaveName, playersToOpen);
        const expectedOpenGame = {
            saveName: testSaveName,
            playerIDs: playersToOpen
        }
        expect(manager.getOpenGames()).toContainEqual(expectedOpenGame);
    })
})