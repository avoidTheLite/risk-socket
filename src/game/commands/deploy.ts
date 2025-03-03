import { Game, Country } from "../../common/types/types";
import { deployError } from "../../common/types/errors";
import saveGame from "../saveGame";

export default async function deploy(game: Game, countryID: number, armies: number): Promise<Game> {
    if (game.phase !== 'deploy') {
        throw new deployError({ message: 'Not in deploy phase'});
    }
    if (game.players[game.activePlayerIndex].armies < armies) {
        throw new deployError({ message: `Not enough armies. Player only has ${game.players[game.activePlayerIndex].armies}`});
    } else {
    game.countries[countryID].armies += armies;
    game.players[game.activePlayerIndex].armies -= armies;
    const savedGame = await saveGame(game);
    return game
    }

}