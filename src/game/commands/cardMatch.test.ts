import cardMatch from "./cardMatch";
import { Game,Card } from "../../common/types/types";
import { cardMatchError } from "../../common/types/errors";
import { matchValue } from "../../common/util/test/defaultCardSeed";
import { describe, test, expect, beforeEach } from '@jest/globals';
import createTestGame from "../../common/util/test/createTestGame";


describe('Card Match - Unit Tests', () => {

    test('should throw an error if < 3 cards are selected', async () => {
        let game: Game = createTestGame(4);
        game.players[game.activePlayerIndex].cards = [
            game.cardsAvailable[0],
            game.cardsAvailable[1],
        ];
        const cards = game.players[game.activePlayerIndex].cards;
        await expect(cardMatch(game, cards)).rejects.toThrow(cardMatchError);
    })

    test('should throw an error if cards are not owned by player', async () => {
        let game: Game = createTestGame(4);
        game.players[game.activePlayerIndex].cards = [
            game.cardsAvailable[0],
            game.cardsAvailable[1],
        ];
        const cards = [
            game.cardsAvailable[0],
            game.cardsAvailable[1],
            game.cardsAvailable[2]
        ];

        await expect(cardMatch(game, cards)).rejects.toThrow(cardMatchError);
    })

    test('should throw an error if cards do not match', async () => {
        let game: Game = createTestGame(4);
        game.players[game.activePlayerIndex].cards = [
            game.cardsAvailable[0],
            game.cardsAvailable[1],
            game.cardsAvailable[3],
        ];
        const cards = game.players[game.activePlayerIndex].cards;
        await expect(cardMatch(game, cards)).rejects.toThrow(cardMatchError);
    })

    test('should match 3 cards of the same symbol', async () => {
        let game: Game = createTestGame(4);
        game.players[game.activePlayerIndex].cards = [
            game.cardsAvailable[0],
            game.cardsAvailable[3],
            game.cardsAvailable[6],
        ];
        const cards = [...game.players[game.activePlayerIndex].cards];
        await cardMatch(game, cards);
        expect(game.turnTracker.armiesEarned).toBe(matchValue[1]);
        expect(game.matches).toBe(1);
    })

    test('should match 1 card of each symbol', async () => {
        let game: Game = createTestGame(4);
        game.players[game.activePlayerIndex].cards = [
            game.cardsAvailable[0],
            game.cardsAvailable[1],
            game.cardsAvailable[2],
        ];
        const cards = [...game.players[game.activePlayerIndex].cards];
        await cardMatch(game, cards);
        expect(game.turnTracker.armiesEarned).toBe(matchValue[1]);
        expect(game.matches).toBe(1);
    })

    test('should match if player has a wild card', async () => {
        let game: Game = createTestGame(4);
        game.players[game.activePlayerIndex].cards = [
            game.cardsAvailable[0],
            game.cardsAvailable[1],
            game.cardsAvailable[42],
        ];
        const cards = [...game.players[game.activePlayerIndex].cards];
        await cardMatch(game, cards);
        expect(game.turnTracker.armiesEarned).toBe(matchValue[1]);
        expect(game.matches).toBe(1);
    })

})