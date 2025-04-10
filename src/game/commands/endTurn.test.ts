import endTurn from "./endTurn";
import { describe , test, expect } from '@jest/globals';
import createTestPlayers from "../../common/util/test/createTestPlayers";
import createTestGame from "../../common/util/test/createTestGame";
import { Game } from "../../common/types/types";

describe('endTurn', () => {

    test('should end deploy phase and start play phase with turn = 1', async () => {
        let game: Game = createTestGame(4);
        // armies have not been distributed
        const response = await endTurn(game);
        expect(response.data.gameState.phase).toBe('play');
        expect(response.data.gameState.turn).toBe(1);

    })

    test('should not end deploy phase when players have armies remaining', async () => {
        let game: Game = createTestGame(4);

        game.players[game.activePlayerIndex].armies = 2;
        game.players[game.activePlayerIndex + 1].armies = 2;
        game.players[game.activePlayerIndex + 2].armies = 2;
        const response = await endTurn(game);
        expect(response.data.gameState.phase).toBe('deploy');
        expect(response.data.gameState.turn).toBe(2);
        expect(response.data.gameState.activePlayerIndex).toBe(1);
    })

    test('should stay in play phase and increase turn', async () => {
        let game: Game = createTestGame(4);
        game.phase = 'play';
        const response = await endTurn(game);
        expect(response.data.gameState.phase).toBe('play');
        expect(response.data.gameState.turn).toBe(2);
        expect(response.data.gameState.activePlayerIndex).toBe(1);
    })

    test('When last player ends turn, game should stay in play phase and go back to first player', async () => {
        let game: Game = createTestGame(4);
        game.phase = 'play';
        game.activePlayerIndex = 3;
        game.turn = 4;
        const response = await endTurn(game);
        expect(response.data.gameState.phase).toBe('play');
        expect(response.data.gameState.turn).toBe(5);
        expect(response.data.gameState.activePlayerIndex).toBe(0);
    })

    test('Card is drawn and added to player and removed from cardsAvailable', async () => {
        let game: Game = createTestGame(4);
        game.phase = 'play';
        game.activePlayerIndex = 0;
        game.turn = 1;
        game.turnTracker.earnedCard = true;
        const response = await endTurn(game);
        expect(response.data.gameState.players[0].cards.length).toBe(1);
        expect(response.data.gameState.cardsAvailable.length).toBe(43);
    })

    test('No card is drawn if turnTracker.cardEarned is false', async () => {
        let game: Game = createTestGame(4);
        game.players[0].cards = [];
        game.phase = 'play';
        game.activePlayerIndex = 0;
        game.turn = 1;
        game.turnTracker.earnedCard = false;
        const response = await endTurn(game);
        expect(response.data.gameState.players[0].cards.length).toBe(0);
        expect(response.data.gameState.cardsAvailable.length).toBe(44);
    })
})