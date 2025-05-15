import { describe, test, expect } from '@jest/globals';
import viewSavedGames from "./viewSavedGames";
import { stateManager } from '../common/util/createWebSocketServer';
import { gameNotFoundError } from "../common/types/errors";
import { WsResponse, GameMetaData, Game } from '../common/types/types';

describe ('View saved games - from SQLite db', () => {
    test('should return a list of saved games', async () => {
        const response: WsResponse = await viewSavedGames();
        const testSaveName: string = 'defaultGameID - autosave turn 0'
        const testSaveNameExists: boolean = response.data.savedGames.find((savedGame: GameMetaData) => savedGame.saveName === testSaveName) !== undefined
        
        expect(response.data.action).toBe('viewSavedGames');
        expect(response.data.status).toBe('success');
        expect(testSaveNameExists).toBeTruthy();
    })


    test('should return an empty array no games are found', async () => {
        jest.spyOn(stateManager, 'getSavedGames').mockResolvedValueOnce([])
        const response: WsResponse = await viewSavedGames();
        expect(response.data.savedGames).toEqual([])
    })
})

