jest.mock('../loadGame', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => Promise.resolve({
        saveName: "testSave",
        id: "testGameID",
        name: "Test Game",
        players: [
            { id: 1, name: "Player 1", color: "red" },
            { id: 2, name: "Player 2", color: "blue" },
            { id: 3, name: "Player 3", color: "black" },
            { id: 4, name: "Player 4", color: "orange" },
            { id: 5, name: "Player 5", color: "green" }
        ],
        countries: [],
        continents: [],
        globeID: "globe123",
        turn: 1,
        phase: "deploy"
    }))
}))

import viewOpenGames from "./viewOpenGames";
import { manager, stateManager } from "../../common/util/createWebSocketServer";
import { describe, test, expect } from '@jest/globals';
import { WsResponse, GameSlots, GameMetaData, SaveGameRecord } from "../../common/types/types";



describe('View open games - unit tests', () => {

    beforeAll(() => {
        
    })

    afterAll(() => {
        jest.restoreAllMocks();
    })

    test('should return an empty array when there are no open games', async () => {
        
        jest.spyOn(manager, 'getOpenGames').mockReturnValueOnce([]);
        const response: WsResponse = await viewOpenGames();

        expect(response.data.action).toBe('viewOpenGames');
        expect(response.data.status).toBe('success');
        expect(response.data.message).toMatch(/0 open games/);

    })

    test('should return a list of open games when they exist', async () => {

        const mockGameSlots: GameSlots[] = [
            { saveName: 'testSaveName1', playerSlots: [3, 4] },
            { saveName: 'testSaveName2', playerSlots: [2, 3] },
        ]

        const mockGameSlotsRecord: GameMetaData[] = [{ 
            saveName: mockGameSlots[0].saveName,
            playerSlots: mockGameSlots[0].playerSlots,
            openSlots: mockGameSlots[0].playerSlots.length,
            id: "testGameID",
            playerCount: 5,
            globeID: "globe123",
            turn: 1,
            phase: "deploy",
            name: "Test Game" 
        },
        {
            saveName: mockGameSlots[1].saveName,
            playerSlots: mockGameSlots[1].playerSlots,
            openSlots: mockGameSlots[1].playerSlots.length,
            id: "testGameID",
            playerCount: 5,
            globeID: "globe123",
            turn: 1,
            phase: "deploy",
            name: "Test Game" 
        },
        ]

        const mockSavedGameRecords: SaveGameRecord[] = [{
            saveName: mockGameSlots[0].saveName,
            id: "testGameID",
            name: "Test Game",
            players: JSON.stringify([
                { id: 1, name: "Player 1", color: "red", armies: 1 },
                { id: 2, name: "Player 2", color: "blue", armies: 1 },
                { id: 3, name: "Player 3", color: "black", armies: 1 },
                { id: 4, name: "Player 4", color: "orange", armies: 1 },
                { id: 5, name: "Player 5", color: "green", armies: 1 }
            ]),
            globeID: "globe123",
            turn: 1,
            phase: "deploy",
            created_at: '',
            updated_at: '',
        },{
            saveName: mockGameSlots[1].saveName,
            id: "testGameID",
            name: "Test Game",
            players: JSON.stringify([
                { id: 1, name: "Player 1", color: "red", armies: 1 },
                { id: 2, name: "Player 2", color: "blue", armies: 1 },
                { id: 3, name: "Player 3", color: "black", armies: 1 },
                { id: 4, name: "Player 4", color: "orange", armies: 1 },
                { id: 5, name: "Player 5", color: "green", armies: 1 }
            ]),
            globeID: "globe123",
            turn: 1,
            phase: "deploy",
            created_at: '',
            updated_at: '',
        }]

        jest.spyOn(manager, 'getOpenGames').mockReturnValueOnce(mockGameSlots);
        jest.spyOn(stateManager, 'getSavedGames').mockResolvedValueOnce(mockSavedGameRecords);
        const response: WsResponse = await viewOpenGames();

        expect(response.data.action).toBe('viewOpenGames');
        expect(response.data.status).toBe('success');
        expect(response.data.message).toMatch(/2 open games/);
        expect(response.data.gameSlots).toEqual(mockGameSlotsRecord);

    })
})