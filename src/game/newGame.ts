import { Game, Player, Globe } from '../common/types/types';
import ShortUniqueId = require('short-unique-id');
import { playerCountError } from '../common/types/errors';
import saveGame from './saveGame';
import loadGlobe from './loadGlobe';
import assignCountries from './services/assignCountries';
import assignArmies from './services/assignArmies';

let uid = new ShortUniqueId({ length: 10 });

async function newGame(players: Player[], globeID: string) {
    try {
        console.log(`loading game with globe ID ${globeID}`)
        let globe: Globe = await loadGlobe(globeID);
        if (players.length > globe.playerMax) {
            throw new playerCountError({
                message:`Globe supports up to ${globe.playerMax} players, but ${players.length} players were provided`
            })
        }
        let game: Game = {
            saveName: '',
            id: uid.rnd(),
            players: players,
            countries: globe.countries,
            continents: globe.continents,
            globeID: globe.id,
            turn: 0,
            phase: 'deploy',
            activePlayerIndex: 0,    
        }
        game.saveName = game.id + ' - autosave turn ' + game.turn;
        game.countries = await assignCountries(players, globe.countries)
        game.players = await assignArmies(players, globe.countries)
        game = await saveGame(game) 
        console.log(`New game created: ${game.id} with save name: ${game.saveName}`)
        return game
    
    } catch (error) {
        throw error
    }

    
}

export default newGame