import { Game, GameRecord } from "../common/types/types";
const mockedFirst = jest.fn() as jest.MockedFunction<() => Promise<GameRecord | undefined>>;
const mockedInsert = jest.fn() as jest.MockedFunction<(record: GameRecord) => Promise<number[]>>;
const mockedUpdate = jest.fn() as jest.MockedFunction<(record: Partial<GameRecord>) => Promise<number>>;
const mockDB = jest.fn(() => ({
    where: (() => ({
        update: mockedUpdate,
        first: mockedFirst,
    })),
    insert: mockedInsert,
}));

jest.mock("../db/db", () => ({
    __esModule: true,
    default: mockDB
}));

jest.mock("./loadGame", () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => Promise.resolve({
        saveName: "testSave",
        id: 1,
        name: "Test Game",
        players: [],
        countries: [],
        continents: [],
        globeID: "globe123",
        turn: 1,
        phase: "setup"
    }))
}));

import saveGame from "./saveGame";
import loadGame from "./loadGame";
import db from "../db/db";
import { describe, test, expect, jest } from "@jest/globals"
import createTestGame from "../common/util/test/createTestGame";
import { dbInsertError } from "../common/types/errors";



describe('Save game - Unit Tests', () => {
    
    beforeEach(() => {
        mockDB.mockClear();
        mockedInsert.mockClear();
        mockedUpdate.mockClear();
        mockedFirst.mockClear();
    })
    test('should call db.insert with correct data when save does not exist', async () => {
        let game: Game = createTestGame(4);
        mockedFirst.mockResolvedValueOnce(undefined);
        mockedInsert.mockResolvedValueOnce([1]);
        await saveGame(game);

        expect(mockDB).toHaveBeenCalledWith('gameState');
        expect(mockedInsert).toHaveBeenCalledWith(expect.objectContaining({
            saveName: game.saveName,
            id: game.id,
            name: game.name,
            players: JSON.stringify(game.players),
            countries: JSON.stringify(game.countries),
            continents: JSON.stringify(game.continents),
            globeID: game.globeID,
            turn: game.turn,
            phase: game.phase
        }));
    })

    test('should call load game with game.saveName', async () => {
        let game: Game = createTestGame(4);
        mockedFirst.mockResolvedValueOnce(undefined);
        mockedInsert.mockResolvedValueOnce([1]);
        await saveGame(game);
        
        expect(loadGame).toHaveBeenCalledWith(game.saveName);
    })
    
    test('should throw error if insert fails', async () => {
        let game: Game = createTestGame(4);
        mockedFirst.mockResolvedValueOnce(undefined);
        await expect(saveGame(game)).rejects.toThrow(dbInsertError)
    })
})