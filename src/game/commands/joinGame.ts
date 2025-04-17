import { manager } from "../../common/util/createWebSocketServer";
import { WsResponse, Game } from "../../common/types/types";
import { joinGameError } from "../../common/types/errors";
import { WebSocket } from "ws";

export default function joinGame(ws: WebSocket, game: Game, playerSlots: number[]): WsResponse{

    const availableGameSlots: number[] = manager.getOpenGameSlots(game.saveName);
    if(availableGameSlots.length === 0) {
        throw new joinGameError({ message: `Unable to join game. There are no open game slots for ${game.saveName}` });
    }

    let invalidPlayerIDs: number[] = playerSlots.filter((id) => !availableGameSlots.includes(id));
    if (invalidPlayerIDs.length > 0) {
        throw new joinGameError({ message: `Unable to join game. Invalid player IDs: ${invalidPlayerIDs.join(', ')}` });
    }

    let playerSlotsToJoin: number[] = playerSlots.filter((id) => availableGameSlots.includes(id));
    manager.connectToGame(ws, game.saveName, playerSlotsToJoin);

    const response: WsResponse = {
        data: {
            action: 'joinGame',
            message: `Successfully joined Player Slots: ${playerSlotsToJoin.join(', ')}`,
            status: 'success',
            gameState: game
        }
    }
    return response

}