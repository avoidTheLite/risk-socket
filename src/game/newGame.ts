import { Game, Player, Globe, Country, Continent} from '../common/types/types';
import ShortUniqueId = require('short-unique-id');
import { playerCountError } from '../common/types/errors';

let uid = new ShortUniqueId({ length: 10 });

async function newGame(players: Player[], globe: Globe) {
    try {
        let game: Game = {
            saveName: '',
            id: uid.rnd(),
            players: players,
            countries: globe.countries,
            continents: globe.continents,
            globeID: globe.id,
            turn: 0,
            phase: 'deploy',    
        }
        game.saveName = game.id + ' - autosave turn ' + game.turn;
        if (game.players.length <= globe.playerMax) {
            console.log(`New game created: ${game.id} with save name: ${game.saveName}`)
            }
        else {
            throw new playerCountError({
                message:`Globe supports up to ${globe.playerMax} players, but ${players.length} players were provided`
            })
        }
        return game
    } catch (error) {
        throw error
    }

    
}

export default newGame