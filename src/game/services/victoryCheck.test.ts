import victoryCheck from "./victoryCheck";
import { Game } from "../../common/types/types";
import createTestGame from "../../common/util/test/createTestGame";
import { describe, test, expect } from '@jest/globals';

describe('Victory Check', () => {

    test('should return true if game is won', () => {
        let game: Game = createTestGame(4);
        for (let i = 0; i < game.countries.length - 1; i++) {
            game.countries[i].ownerID = 0;
            game.countries[i].armies = 1;
        }
        game.countries[game.countries.length - 1].ownerID = 1;
        game.countries[game.countries.length - 1].armies = 0;

        expect(victoryCheck(game)).toBe(true)
    })

    test('should return false if game is not won', () => {
        let game: Game = createTestGame(4);
        for (let i = 0; i < game.countries.length - 1; i++) {
            game.countries[i].ownerID = 0;
            game.countries[i].armies = 1;
        }
        game.countries[game.countries.length - 1].ownerID = 1;
        game.countries[game.countries.length - 1].armies = 1;

        expect(victoryCheck(game)).toBe(false)
    })

    test('should return true even if neutral armies remain', () => {
        let game: Game = createTestGame(2);
        for (let i = 0; i < game.countries.length - 2; i++) {
            game.countries[i].ownerID = 0;
            game.countries[i].armies = 1;
        }
        game.countries[game.countries.length - 2].ownerID = 99;
        game.countries[game.countries.length - 2].armies = 1;
        game.countries[game.countries.length - 1].ownerID = 1;
        game.countries[game.countries.length - 1].armies = 0;
        expect(victoryCheck(game)).toBe(true)
    })
})
