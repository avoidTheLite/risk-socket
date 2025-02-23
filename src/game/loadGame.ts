import db from '../db/db';
import { Game, GameRecord } from '../common/types/types';
import { gameNotFoundError } from '../common/types/errors';

export default async function loadGame(saveName: string): Promise<Game> {
    return db.select(
        "gameState.saveName",
        "gameState.id",
        "gameState.name",
        "gameState.players",
        "gameState.countries",
        "gameState.continents",
        "gameState.globeID",
        "gameState.turn",
        "gameState.phase",
        "gameState.created_at",
        "gameState.updated_at"
    ).from('gameState')
    .where('gameState.saveName', '=', saveName)
    .then((gameRecord: GameRecord[]) => {
        if (gameRecord.length === 0) {
            throw new gameNotFoundError({
                message: `Game with save name ${saveName} not found`
            })
        }
        else {
            let game: Game = {
                saveName: gameRecord[0].saveName,
                id: gameRecord[0].id,
                name: gameRecord[0].name,
                players: gameRecord[0].players = typeof gameRecord[0].players === 'string' ? JSON.parse(gameRecord[0].players) : gameRecord[0].players,
                countries: gameRecord[0].countries = typeof gameRecord[0].countries === 'string' ? JSON.parse(gameRecord[0].countries) : gameRecord[0].countries,
                continents: gameRecord[0].continents = typeof gameRecord[0].continents === 'string' ? JSON.parse(gameRecord[0].continents) : gameRecord[0].continents,
                globeID: gameRecord[0].globeID,
                turn: gameRecord[0].turn,
                phase: gameRecord[0].phase,
                created_at: gameRecord[0].created_at,
                updated_at: gameRecord[0].updated_at
            }
            return game;
        }

    });
}