import { WsActions, Game, WsResponse } from "../../common/types/types";
import { PlayerControlError, TurnError } from "../../common/types/errors";
import { WebSocket } from "ws";
import { manager } from "../../common/util/createWebSocketServer";

export default function actionAllowed(game: Game, action: WsActions, playerID: number,ws: WebSocket): void {

    if (game.activePlayerIndex !== playerID) {
        throw new TurnError({ message: `Unable to perform action: ${action}. It is not your turn. Active player is player ${game.activePlayerIndex}: ${game.players[game.activePlayerIndex].name}`});
    }

    const controllingClient: WebSocket = manager.getOwner(game.saveName, game.activePlayerIndex);
    if (controllingClient != ws) {
        console.log(`ws = ${JSON.stringify(ws)}`)
        console.log(`controllingClient = ${JSON.stringify(controllingClient)}`)
        throw new PlayerControlError({ message: `Unable to perform action: ${action} for player ${playerID}. You do not control this player`});
    }

}