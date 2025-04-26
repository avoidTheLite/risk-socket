import endTurn from "./endTurn";
import { describe , test, expect } from '@jest/globals';
import createTestPlayers from "../../common/util/test/createTestPlayers";
import createTestGame from "../../common/util/test/createTestGame";
import { Game } from "../../common/types/types";
import assignCountries from "../services/assignCountries";

describe('endTurn', () => {


    test('should call nextTurnManager and end turn', async () => {
        
        let game: Game = createTestGame(4);
        game.countries = assignCountries(game.players, game.countries);
        const response = await endTurn(game);
        expect(response.data.gameState.phase).toBe('play');
        expect(response.data.gameState.turn).toBe(1);

    })

})