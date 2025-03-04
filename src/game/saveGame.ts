import { saveGameError, dbInsertError} from '../common/types/errors';
import { Game, GameRecord } from '../common/types/types';
import db from '../db/db';
import loadGame from './loadGame';

export default async function saveGame(game: Game) {
    let savedGame: Game

    let gameRecord: GameRecord = {
        saveName: game.saveName,
        id: game.id,
        name: game.name,
        players: JSON.stringify(game.players),
        countries: JSON.stringify(game.countries),
        continents: JSON.stringify(game.continents),
        globeID: game.globeID,
        turn: game.turn,
        phase: game.phase,
        activePlayerIndex: game.activePlayerIndex,
    }
    try{
        const saveExists = await db('gameState').where('saveName', '=', game.saveName).first();
        console.log(`saveExists: ${saveExists}`)
        if (saveExists) {
            const result: number = await db('gameState').where({saveName: game.saveName}).update(gameRecord);
            if (!result) {
                throw new dbInsertError({
                    message: 'Failed to update game in database',
                })
            }
            savedGame = await loadGame(game.saveName);
        } else {
            const result: number[] = await db('gameState').insert(gameRecord);
            if (!result || result.length === 0) {
                throw new dbInsertError({
                    message: 'Failed to insert game into database',
                })
            }
            savedGame = await loadGame(game.saveName);
        }
       
    }  
    catch (error) {
        throw new saveGameError({
            message: 'Failed to save game',
        })
    }
    return savedGame
}
