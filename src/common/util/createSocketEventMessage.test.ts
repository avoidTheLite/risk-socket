import createSocketEventMessage from "./createSocketEventMessage";
import { describe, expect, test } from "@jest/globals"
import { WsResponse, WsEvent, Game } from "../types/types";
import attack from "../../game/commands/attack";
import createTestGame from "./test/createTestGame";

describe('createSocketEventMessage - unit tests', () => {

    test('returns a valid WsEvent from a valid engagement response', () => {
        let game: Game = createTestGame(4)
        const response: WsResponse = {
            data: {
                action: 'attack',
                message: 'attack successful message',
                status: 'successful',
                engagement: {
                    attackingCountry: 0,
                    defendingCountry: 1,
                    attackingTroopCount: 3,
                    defendingTroopCount: 1,
                    attackersLost: 0,
                    defendersLost: 1,
                    attackerRolls: [6, 6, 6],
                    defenderRolls: [1],
                    conquered: true
                },
                gameState: game,
            }
        }
        const socketEventMessage: WsEvent = createSocketEventMessage(response);
        expect(socketEventMessage.type).toEqual('event');
        expect(socketEventMessage.data.action).toBe(response.data.action);
        expect(socketEventMessage.data.message).toBe(response.data.message);
        expect(socketEventMessage.data.engagement).toBe(response.data.engagement);
        expect(socketEventMessage.data.gameState).toBe(response.data.gameState)
        expect(socketEventMessage.data.movement).toBe(undefined);
        expect(socketEventMessage.data.deployment).toBe(undefined);
    })
})