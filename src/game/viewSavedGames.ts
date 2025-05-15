import { SaveGameRecord, GameMetaData, Player, WsResponse } from "../common/types/types";
import { stateManager } from "../common/util/createWebSocketServer";


export default async function viewSavedGames(): Promise<WsResponse> {
    
    const saveGameRecords: SaveGameRecord[] = await stateManager.getSavedGames();
    let savedGames: GameMetaData[] = [];
    for (let i=0; i<saveGameRecords.length; i++) {
        const players: Player[] = typeof saveGameRecords[i].players === 'string' ? JSON.parse(saveGameRecords[i].players) : saveGameRecords[i].players;
        let savedGame: GameMetaData = {
            saveName: saveGameRecords[i].saveName,
            playerSlots: players.map((player: Player) => player.id),
            openSlots: 0,
            id:  saveGameRecords[i].id,
            playerCount: players.length,
            globeID:  saveGameRecords[i].globeID,
            turn:  saveGameRecords[i].turn,
            phase:  saveGameRecords[i].phase,
            name:  saveGameRecords[i].name,
            created_at: saveGameRecords[i].created_at,
            updated_at: saveGameRecords[i].updated_at
        };
        savedGames.push(savedGame);
    }
    return {
        type: 'response',
        data: {
            action: 'viewSavedGames',
            message: `There are ${savedGames.length} saved games.`,
            status: 'success',
            savedGames: savedGames,
        }
    };
}