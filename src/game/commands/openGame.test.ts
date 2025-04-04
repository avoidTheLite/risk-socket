jest.mock('../../common/util/createWebSocketServer', () => ({
    manager: {
        openGame: jest.fn(),
    }
}));

import openGame from "./openGame";
import { Game, WsResponse } from "../../common/types/types";
import { describe, test, expect } from '@jest/globals';
import createTestGame from "../../common/util/test/createTestGame";
import { manager } from "../../common/util/createWebSocketServer";
import { openGameError } from "../../common/types/errors";


describe('Open Game - Unit Tests', () => {

    test('should successfully open a game', () => {
        const testGame: Game = createTestGame(4);
        const slotsToOpen: number[] = [2, 3];
        const response: WsResponse = openGame(testGame, slotsToOpen);
        expect(manager.openGame).toHaveBeenCalledWith(testGame.saveName, slotsToOpen);
        expect(response.data.status).toBe('success');
    })

    test('should return message addendum if opening SOME players that dont exist', () => {
        const testGame: Game = createTestGame(4);
        const slotsToOpen: number[] = [2, 3, 4];
        const response: WsResponse = openGame(testGame, slotsToOpen);
        expect(manager.openGame).toHaveBeenCalledWith(testGame.saveName, slotsToOpen);
        expect(response.data.status).toBe('success');
        expect(response.data.message).toContain('However, these invalid Player IDs: 4 were ignored.');
    })

    test('should return an error if NO opening players exist', () => {
        const testGame: Game = createTestGame(4);
        const slotsToOpen: number[] = [4, 5];
        expect(() => openGame(testGame, slotsToOpen)).toThrow(openGameError);
    })
})