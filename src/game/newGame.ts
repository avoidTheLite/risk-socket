import { GameRecord, Game, Player, Globe, Country, Continent} from '../common/types/types';
import ShortUniqueId = require('short-unique-id');
import { playerCountError } from '../common/types/errors';
import db from '../db/db';
import loadGame from './loadGame';
import loadGlobe from './loadGlobe';

let uid = new ShortUniqueId({ length: 10 });

async function newGame(players: Player[], globeID: string) {
    try {
        console.log(`loading game with globe ID ${globeID}`)
        let globe: Globe = await loadGlobe(globeID);
        let gameRecord: GameRecord = {
            saveName: '',
            id: uid.rnd(),
            players: JSON.stringify(players),
            countries: JSON.stringify(globe.countries),
            continents: JSON.stringify(globe.continents),
            globeID: globe.id,
            turn: 0,
            phase: 'deploy',    
        }
        gameRecord.saveName = gameRecord.id + ' - autosave turn ' + gameRecord.turn;
        if (players.length <= globe.playerMax) {
            console.log(`New game created: ${gameRecord.id} with save name: ${gameRecord.saveName}`)
            await db('gameState').insert(gameRecord);
            }
        else {
            throw new playerCountError({
                message:`Globe supports up to ${globe.playerMax} players, but ${players.length} players were provided`
            })
        }
        const game = await loadGame(gameRecord.saveName);
        return game
    } catch (error) {
        throw error
    }

    
}

export default newGame