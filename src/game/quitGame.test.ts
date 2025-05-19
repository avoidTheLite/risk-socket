import quitGame from "./quitGame";
import { describe, test, expect } from '@jest/globals';
import { manager } from "../common/util/createWebSocketServer";
import { WebSocket } from "ws";
import createMockSocket from "../common/util/test/createMockSocket";

describe('quitGame', () => {
    test('should call manager.handleDisconnect when client is in game', () => {
        const ws: WebSocket = createMockSocket();
        const playerIDs: number[] = [1, 2, 3];
        manager.getGame = jest.fn().mockReturnValue('test');
        manager.getPlayers = jest.fn().mockReturnValue(playerIDs);
        manager.handleDisconnect = jest.fn();
        quitGame(ws);
        expect(manager.handleDisconnect).toHaveBeenCalledWith(ws);
    });

    test('should return failure when client is not in a game', () => {
        const ws: WebSocket = createMockSocket();
        manager.getGame = jest.fn().mockReturnValue(undefined);
        const response = quitGame(ws);
        expect(response).toMatchObject({
            data: {
                action: 'quitGame',
                status: 'failure',
                message: 'No game found on the server for this client'
            }
        });

    })
})
