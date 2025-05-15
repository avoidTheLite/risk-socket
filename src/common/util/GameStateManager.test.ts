import { describe, test, expect } from '@jest/globals';
import GameStateManager from './GameStateManager';
import { WsResponse, GameMetaData, Game, SaveGameRecord } from '../types/types';

const stateManager: GameStateManager = new GameStateManager();

describe ('View saved games - from SQLite db', () => {
    test('should return a list of saved games', async () => {
        const savedGames: SaveGameRecord[] = await stateManager.getSavedGames();
        const testSaveName: string = 'defaultGameID - autosave turn 0'
        const testSaveNameExists: boolean = savedGames.find((savedGame: SaveGameRecord) => savedGame.saveName === testSaveName) !== undefined
    
        expect(testSaveNameExists).toBeTruthy();
    })
})