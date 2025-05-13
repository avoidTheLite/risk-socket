import { manager } from "../../common/util/createWebSocketServer";
import { Game, GameSlots, GameMetaData ,WsResponse } from "../../common/types/types";
import loadGame from "../loadGame";

export default async function viewOpenGames(): Promise<WsResponse> {

    const openGames: GameSlots[] = manager.getOpenGames();
    let openGamesData: GameMetaData[] = [];
    if (openGames.length > 0) {
        for (let i = 0; i < openGames.length; i++) {
            const game: Game = await loadGame(openGames[i].saveName);
            const gameData: GameMetaData = {
                saveName: openGames[i].saveName,
                playerSlots: openGames[i].playerSlots,
                openSlots: openGames[i].playerSlots.length,
                id: game.id,
                playerCount: game.players.length,
                globeID: game.globeID,
                turn: game.turn,
                phase: game.phase,
                name: game.name
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