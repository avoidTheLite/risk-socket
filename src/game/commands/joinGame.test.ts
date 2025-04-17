jest.mock('../../common/util/createWebSocketServer', () => ({
    manager: {
        connectToGame: jest.fn(),
        getOpenGameSlots: jest.fn()
            .mockReturnValueOnce([2, 3])
            .mockReturnValueOnce([])
            .mockReturnValueOnce([2, 3])
    }
}));

import joinGame from "./joinGame";
import { manager } from "../../common/util/createWebSocketServer";
import { joinGameError } from "../../common/types/errors";
import { WebSocket } from "ws";
import { WsResponse, Game } from "../../common/types/types";
import createMockSocket from "../../common/util/test/createMockSocket";
import createTestGame from "../../common/util/test/createTestGame";

describe('Join Game - Unit Tests', () => {
    
    beforeAll(() => {

        
    })

    test('Successfully joins an open game', () => {
        const ws = createMockSocket();
        const game = createTestGame(4);
        const playerSlots = [2, 3];
        const response = joinGame(ws, game, playerSlots);
        expect(response.data.message).toBe(`Successfully joined Player Slots: ${playerSlots.join(', ')}`); 
        expect(response.data.status).toBe('success');
        expect(response.data.gameState).toBeInstanceOf(Game);
        
    })
    
    test('throws an error if there are no open game slots', () => {
        const ws = createMockSocket();
        const game = createTestGame(4);
        const playerSlots = [2, 3];
        expect(() => joinGame(ws, game, playerSlots)).toThrow(joinGameError);
    })
    
    test('throws an error if the player passes invalid player IDs', () => {
        const ws = createMockSocket();
        const game = createTestGame(4);
        const playerSlots = [2, 3, 4];
        expect(() => joinGame(ws, game, playerSlots)).toThrow(joinGameError);
    })

})