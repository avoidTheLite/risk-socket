import endTurn from "./endTurn";
import { describe , test, expect } from '@jest/globals';
import createTestPlayers from "../../common/util/test/createTestPlayers";
import createTestGame from "../../common/util/test/createTestGame";
import { Game } from "../../common/types/types";

describe('endTurn', () => {
    // given that game phase = 'deploy' and all players have no more armies to deploy
    // when endTurn is called
    // then the game phase should change to 'play' and turn should be set to 1
    test('should end deploy phase and start play phase with turn = 1', async () => {
        let game: Game = createTestGame(4);
        // armies have not been distributed
        game = await endTurn(game);
        expect(game.phase).toBe('play');
        expect(game.turn).toBe(1);

    })

    // given that game phase = 'deploy' and at least one player has armies to deploy
    // when endTurn is called
    // then the game phase should not change
    test('should not end deploy phase when players have armies remaining', async () => {
        let game: Game = createTestGame(4);

        game.players[game.activePlayerIndex].armies = 2;
        game.players[game.activePlayerIndex + 1].armies = 2;
        game.players[game.activePlayerIndex + 2].armies = 2;
        game = await endTurn(game);
        expect(game.phase).toBe('deploy');
        expect(game.turn).toBe(2);
        expect(game.activePlayerIndex).toBe(1);
    })

    //given that game phase == 'play' and turn = 1
    // when endTurn is called
    // then turn should be set to 2
    // and actvePlayerIndex should be set to 1
    test(' should stay in play phase and increase turn', async () => {
        let game: Game = createTestGame(4);
        game.phase = 'play';
        game = await endTurn(game);
        expect(game.phase).toBe('play');
        expect(game.turn).toBe(2);
        expect(game.activePlayerIndex).toBe(1);
    })
    //given that game phase == 'play' and turn = 4 = number of players
    // when endTurn is called
    // then turn should be set to 5
    // and actvePlayerIndex should be set to 0

    test('When last player ends turn, game should stay in play phase and go back to first player', async () => {
        let game: Game = createTestGame(4);
        game.phase = 'play';
        game.activePlayerIndex = 3;
        game.turn = 4;
        game = await endTurn(game);
        expect(game.phase).toBe('play');
        expect(game.turn).toBe(5);
        expect(game.activePlayerIndex).toBe(0);
    })
})