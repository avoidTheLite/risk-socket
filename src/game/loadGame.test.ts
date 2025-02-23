import loadGame from "./loadGame";
import { describe, expect, test } from '@jest/globals';
import { gameNotFoundError } from "../common/types/errors";

describe ('Load Game', () => {

    test('should load a known saved game', async () => {
        let game = await loadGame('defaultGameID - autosave turn 0');
        expect(game.id).toBe('defaultGameID');
    })

    test('should throw an error if game does not exist', async () => {
        await expect(loadGame('This save should not exist')).rejects.toThrow(gameNotFoundError);

    })
})