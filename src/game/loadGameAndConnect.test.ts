jest.mock('../common/util/createWebSocketServer', () => ({
    manager: {
        connectToGame: jest.fn(),
    }
}));

import { describe, test, expect } from '@jest/globals';
import loadGameAndConnect from "./loadGameAndConnect";
import { GameAlreadyHostedError } from '../common/types/errors';
import { Game, WsResponse } from '../common/types/types';
import { WebSocket } from 'ws';
import { manager } from '../common/util/createWebSocketServer';
import createMockSocket from '../common/util/test/createMockSocket';

describe('Load game and connect', () => {
    let ws: WebSocket;

    beforeEach(() => {
        ws = createMockSocket();
    })

    test('Should throw error if game is already hosted', async () => {
        const saveName: string = 'test';
        manager.getHost = jest.fn().mockReturnValue("Not Undefined");
        await expect(loadGameAndConnect(ws,saveName)).rejects.toThrow(GameAlreadyHostedError);
    })

    test('Should load game', async () => {
        const saveName: string = 'defaultGameID - autosave turn 0';
        manager.getHost = jest.fn().mockReturnValue(undefined);
        const response: WsResponse = await loadGameAndConnect(ws, saveName);
        expect(response).toMatchObject({
            data: {
                action: 'loadGame',
                message: `Successfully loaded game with save name ${saveName}`,
                status: 'success',
                gameState: expect.anything()
            }
        });
        expect(response.data.gameState.saveName).toBe(saveName);
    })

    test('Should connect host to loaded game', async () => {
        const saveName: string = 'defaultGameID - autosave turn 0';
        const playerIDs: number[] = [0, 1, 2, 3];
        const ws: WebSocket = createMockSocket();
        manager.getHost = jest.fn().mockReturnValue(undefined);
        const response: WsResponse = await loadGameAndConnect(ws,saveName);
        expect(manager.connectToGame).toHaveBeenCalledWith(ws, saveName, playerIDs);
    })
})