import { manager } from "../../common/util/createWebSocketServer";
import { GameSlots, WsResponse } from "../../common/types/types";

export default function viewOpenGames(): WsResponse {

    const openGames: GameSlots[] = manager.getOpenGames();

    const response: WsResponse = {
        data: {
            action: 'viewOpenGames',
            message: `There are ${openGames.length} open games.`,
            status: 'success',
            gameSlots: openGames,
        }
    }

    return response

}