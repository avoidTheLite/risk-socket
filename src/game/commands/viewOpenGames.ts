import { manager, stateManager } from "../../common/util/createWebSocketServer";
import { Game, GameSlots, GameMetaData ,WsResponse, SaveGameRecord, Player } from "../../common/types/types";

export default async function viewOpenGames(): Promise<WsResponse> {

    const openGames: GameSlots[] = manager.getOpenGames();
    const savedGames: SaveGameRecord[] = await stateManager.getSavedGames();
    let openGamesData: GameMetaData[] = [];
    if (openGames.length > 0) {
        for (let i = 0; i < openGames.length; i++) {
            const saveGameRecord: SaveGameRecord = savedGames.find((game: SaveGameRecord) => game.saveName === openGames[i].saveName);
            const players: Player[] = typeof saveGameRecord.players === 'string' ? JSON.parse(saveGameRecord.players) : saveGameRecord.players
            const gameData: GameMetaData = {
                saveName: openGames[i].saveName,
                playerSlots: openGames[i].playerSlots,
                openSlots: openGames[i].playerSlots.length,
                id: saveGameRecord.id,
                playerCount: players.length,
                globeID: saveGameRecord.globeID,
                turn: saveGameRecord.turn,
                phase: saveGameRecord.phase,
                name: saveGameRecord.name
            };
            openGamesData.push(gameData);
        }
    }
    const response: WsResponse = {
        data: {
            action: 'viewOpenGames',
            message: `There are ${openGames.length} open games.`,
            status: 'success',
            gameSlots: openGamesData,
        }
    }

    return response

}