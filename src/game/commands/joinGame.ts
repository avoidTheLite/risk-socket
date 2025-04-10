import { manager } from "../../common/util/createWebSocketServer";
import { WsResponse } from "../../common/types/types";
import { joinGameError } from "../../common/types/errors";
import { WebSocket } from "ws";

export default function joinGame(ws: WebSocket, saveName: string, playerSlots: number[]): WsResponse{

    const availableGameSlots: number[] = manager.getOpenGameSlots(saveName);
    if(availableGameSlots.length === 0) {
        throw new joinGameError({ message: `Unable to join game. There are no open game slots for ${saveName}` });
    }

    let invalidPlayerIDs: number[] = playerSlots.filter((id) => !availableGameSlots.includes(id));
    if (invalidPlayerIDs.length > 0) {
        throw new joinGameError({ message: `Unable to join game. Invalid player IDs: ${invalidPlayerIDs.join(', ')}` });
    }

    let playerSlotsToJoin: number[] = playerSlots.filter((id) => availableGameSlots.includes(id));
    manager.connectToGame(ws, saveName, playerSlotsToJoin);

    const response: WsResponse = {
        data: {
            action: 'joinGame',
            message: `Successfully joined Player Slots: ${playerSlotsToJoin.join(', ')}`,
            status: 'success',
        }
    }
    return response

}