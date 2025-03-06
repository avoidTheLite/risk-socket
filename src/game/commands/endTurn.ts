import { Game, Player, TurnTracker } from "../../common/types/types";
import saveGame from "../saveGame";
import nextTurn from "../../game/services/nextTurn";
import { saveGameError, turnError } from "../../common/types/errors";

function endOfDeployPhase(players: Player[]) {
    let totalPlayerArmies: number = 0;
    for (let i = 0; i < players.length; i++) {
        totalPlayerArmies += players[i].armies;
    }
    if (totalPlayerArmies === 0) {
        return 'play'
    } else {
        return 'deploy'
    }
}

export default async function endTurn(game: Game) {
    try{
        game.turn += 1;
        if (game.phase === 'deploy') {
            game.phase = endOfDeployPhase(game.players);
            if (game.phase === 'play') {
                game.turn = 1;
            }
        }
        game.activePlayerIndex = (game.turn - 1) % game.players.length;
        game.turnTracker = nextTurn(game.phase, game.activePlayerIndex, game.countries, game.continents);
        game.players[game.activePlayerIndex].armies += game.turnTracker.armiesEarned;
    } catch (error) {
        throw new turnError({ message: `Failed to end turn ${error}` })
    }
    try {
        game = await saveGame(game);
    } catch (error) {
        throw new saveGameError({ message: `Failed to save game ${error}` })
    }
    return game
}