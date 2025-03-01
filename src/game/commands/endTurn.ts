import { Game, Player, Turn } from "../../common/types/types";
import saveGame from "../saveGame";
import nextTurn from "../../game/services/nextTurn";

function endOfDeployPhase(players: Player[]) {
    let totalPlayerArmies: number = 0;
    for (let i = 0; i < players.length; i++) {
        totalPlayerArmies += players[i].armies;
    }
    if (totalPlayerArmies === 0) {
        return 'deploy'
    } else {
        return 'play'
    }
}

export default async function endTurn(game: Game) {
    game.turn += 1;
    if (game.phase === 'deploy') {
        game.phase = endOfDeployPhase(game.players);
        if (game.phase === 'play') {
            game.turn = 1;
        }
    }
    game.activePlayerIndex = (game.activePlayerIndex + 1) % game.players.length;
    const turn: Turn = nextTurn(game.phase, game.activePlayerIndex, game.countries, game.continents);
    game.players[game.activePlayerIndex].armies += turn.armiesEarned;
    game = await saveGame(game);
    return game
}