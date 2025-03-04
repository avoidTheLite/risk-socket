import { Game, Country } from "../../common/types/types";
import { deployError } from "../../common/types/errors";
import saveGame from "../saveGame";

export default async function deploy(game: Game, countryID: number, armies: number): Promise<Game> {
    if (game.phase !== 'deploy') {
        throw new deployError({ message: 'Not in deploy phase'});
    }
    if (game.players[game.activePlayerIndex].armies < armies) {
        throw new deployError({ message: `Not enough armies. Player only has ${game.players[game.activePlayerIndex].armies}`});
    } 
    if (game.countries[countryID].ownerID !== game.activePlayerIndex) {
        throw new deployError({ message: `Country does not belong to player ${game.activePlayerIndex}: ${game.players[game.activePlayerIndex].name}. It belongs to player ${game.countries[countryID].ownerID}: ${game.players[game.countries[countryID].ownerID].name}`});
    }
    game.countries[countryID].armies += armies;
    game.players[game.activePlayerIndex].armies -= armies;
    const savedGame = await saveGame(game);
    return game
    

}