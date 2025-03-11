import { Game, Deployment } from "../../common/types/types";
import { deployError } from "../../common/types/errors";
import saveGame from "../saveGame";


export default async function deploy(game: Game, deployment: Deployment): Promise<Game> {
    if (game.phase === 'play' && game.turnTracker.phase !== 'deploy') {
        throw new deployError({ message: 'Not in deploy phase of your turn'});
    }
    if (game.players[game.activePlayerIndex].armies < deployment.armies) {
        throw new deployError({ message: `Not enough armies. Player only has ${game.players[game.activePlayerIndex].armies}`});
    } 
    if (game.countries[deployment.targetCountry].ownerID !== game.activePlayerIndex) {
        throw new deployError({ message: `Country does not belong to player ${game.activePlayerIndex}: ${game.players[game.activePlayerIndex].name}. It belongs to player ${game.countries[deployment.targetCountry].ownerID}: ${game.players[game.countries[deployment.targetCountry].ownerID].name}`});
    }
    game.countries[deployment.targetCountry].armies += deployment.armies;
    game.players[game.activePlayerIndex].armies -= deployment.armies;
    if (game.players[game.activePlayerIndex].armies === 0 && game.phase === "play") {
        game.turnTracker.phase = "combat";
    }
    const savedGame = await saveGame(game);
    return game
    

}