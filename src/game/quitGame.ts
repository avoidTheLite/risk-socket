import { Game, WsResponse, Player } from "../common/types/types";
import { manager } from "../common/util/createWebSocketServer"
import { WebSocket } from "ws";


export default function quitGame(ws: WebSocket ): WsResponse {
    const gameSaveName: string | undefined = manager.getGame(ws);
    if (!gameSaveName) {
        return {
            data: {
                action: 'quitGame',
                status: 'failure',
                message: 'No game found on the server for this client'
            }
        }
    }
    const playerIDs: number[] = manager.getPlayers(ws);
    manager.handleDisconnect(ws);
    return {
        data: {
            action: 'quitGame',
            status: 'success',
            message: `Client controlling players: ${playerIDs} has left the game`
        }
    }
}