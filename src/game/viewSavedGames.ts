import db from "../db/db";
import { Game, GameRecord, GameSlots, SaveGameRecord, GameMetaData, Player, WsResponse } from "../common/types/types";
import { manager } from "../common/util/createWebSocketServer";
import { gameNotFoundError } from "../common/types/errors";


export default async function viewSavedGames(): Promise<WsResponse> {
    return db.select(
        "gameState.saveName",
        "gameState.id",
        "gameState.players",
        "gameState.globeID",
        "gameState.turn",
        "gameState.phase",
        "gameState.name",
    ).from('gameState')
    .then((savedGameRecords: SaveGameRecord[]) => {
        if (savedGameRecords.length === 0) {
            throw new gameNotFoundError({
                message: `No games found'`
            })
        }
        else {
            let savedGames: GameMetaData[] = [];
            for (let i=0; i<savedGameRecords.length; i++) {
                let savedGame: GameMetaData = {
                    saveName: '',
                    playerSlots: [],
                    openSlots: 0,
                    id: '',
                    playerCount: 0,
                    globeID: '',
                    turn: 0,
                    phase: 'deploy',
                    name: ''
                };
                const players: Player[] = typeof savedGameRecords[i].players === 'string' ? JSON.parse(savedGameRecords[i].players) : savedGameRecords[i].players;
                savedGame.playerSlots = players.map((player: Player) => player.id);
                savedGame.playerCount = players.length;
                savedGame.openSlots = 0;
                savedGame.saveName = savedGameRecords[i].saveName;
                savedGame.id = savedGameRecords[i].id;
                savedGame.globeID = savedGameRecords[i].globeID;
                savedGame.turn = savedGameRecords[i].turn;
                savedGame.phase = savedGameRecords[i].phase;
                savedGame.name = savedGameRecords[i].name;
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
    }
    )
}