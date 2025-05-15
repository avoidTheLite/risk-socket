import db from "../../db/db";
import { GameRecord, Game, GameSlots, SaveGameRecord, GameMetaData, Player } from "../../common/types/types";
import { gameNotFoundError } from "../../common/types/errors";
import { saveGameError } from "../../common/types/errors";

class GameStateManager {
    async getSavedGames(): Promise<SaveGameRecord[]> {
        return await db.select(
            "gameState.saveName",
            "gameState.id",
            "gameState.players",
            "gameState.globeID",
            "gameState.turn",
            "gameState.phase",
            "gameState.name",
            "gameState.created_at",
            "gameState.updated_at"
        ).from('gameState')
        .orderBy('gameState.created_at', 'desc')
        .then((savedGameRecords: SaveGameRecord[]) => {
            return savedGameRecords
        })
    }

}

export default GameStateManager