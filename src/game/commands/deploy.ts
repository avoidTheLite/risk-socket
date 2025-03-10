import { Game, Country, Phase } from "../../common/types/types";
import { deployError } from "../../common/types/errors";
import saveGame from "../saveGame";


export default async function deploy(game: Game, countryID: number, armies: number): Promise<Game> {
    if (game.phase === 'play' && game.turnTracker.phase !== 'deploy') {
        throw new deployError({ message: 'Not in deploy phase of your turn'});
    }
    if (game.players[game.activePlayerIndex].armies < armies) {
        throw new deployError({ message: `Not enough armies. Player only has ${game.players[game.activePlayerIndex].armies}`});
    } 
    if (game.countries[countryID].ownerID !== game.activePlayerIndex) {
        throw new deployError({ message: `Country does not belong to player ${game.activePlayerIndex}: ${game.players[game.activePlayerIndex].name}. It belongs to player ${game.countries[countryID].ownerID}: ${game.players[game.countries[countryID].ownerID].name}`});
    }
    game.countries[countryID].armies += armies;
    game.players[game.activePlayerIndex].armies -= armies;
    if (game.players[game.activePlayerIndex].armies === 0 && game.phase === "play") {
        game.turnTracker.phase = "combat";
    }
    const savedGame = await saveGame(game);
    return game
    

}