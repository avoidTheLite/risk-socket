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
        "gameState.turnTracker",
        "gameState.phase",
        "gameState.activePlayerIndex",
        "gameState.cardsAvailable",
        "gameState.matches",
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
            return new Game(
                gameRecord[0].saveName,
                gameRecord[0].id,
                gameRecord[0].players = typeof gameRecord[0].players === 'string' ? JSON.parse(gameRecord[0].players) : gameRecord[0].players,
                gameRecord[0].countries = typeof gameRecord[0].countries === 'string' ? JSON.parse(gameRecord[0].countries) : gameRecord[0].countries,
                gameRecord[0].continents = typeof gameRecord[0].continents === 'string' ? JSON.parse(gameRecord[0].continents) : gameRecord[0].continents,
                gameRecord[0].globeID,
                gameRecord[0].turn,
                gameRecord[0].turnTracker = typeof gameRecord[0].turnTracker === 'string' ? JSON.parse(gameRecord[0].turnTracker) : gameRecord[0].turnTracker,
                gameRecord[0].phase,
                gameRecord[0].activePlayerIndex,
                gameRecord[0].cardsAvailable = typeof gameRecord[0].cardsAvailable === 'string' ? JSON.parse(gameRecord[0].cardsAvailable) : gameRecord[0].cardsAvailable,
                gameRecord[0].matches,
            )
        }

    });
}