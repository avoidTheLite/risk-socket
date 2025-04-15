import { WsResponse, WsEvent } from "../types/types";

export default function createSocketEventMessage(response: WsResponse): WsEvent {
    return {
        type: 'event',
        data: {
            action: response.data.action,
            message: response.data.message,
            engagement: response.data.engagement,
            movement: response.data.movement,
            deployment: response.data.deployment,
            gameState: response.data.gameState
        }
    }

}