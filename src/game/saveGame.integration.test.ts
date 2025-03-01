import saveGame from "./saveGame";
import { Game } from "../common/types/types";
import { describe, test, expect } from '@jest/globals';
import createTestGame from "../common/util/test/createTestGame";


describe('Save game - Integration Tests', () => {

    test('should successfully save a game', async () => {
        let game: Game = createTestGame(4);
        let savedGame = await saveGame(game);
        expect(savedGame).toBeTruthy();
    })

})  