jest.mock('./saveGame', () => ({
    __esModule: true, 
    default: jest.fn()
}));

jest.mock('../common/util/createWebSocketServer', () => ({
    manager: {
        connectToGame: jest.fn(),
    }
}));

import { describe, it, expect } from '@jest/globals';
import newGame from './newGame';
import {defaultGlobeSeed} from '../common/util/test/defaultGlobeSeed';
import createTestPlayers from '../common/util/test/createTestPlayers';
import { playerCountError } from '../common/types/errors';
import { WsResponse } from '../common/types/types';
import createMockSocket from '../common/util/test/createMockSocket';
import createTestGame from '../common/util/test/createTestGame';
import saveGame from './saveGame';
import { manager } from '../common/util/createWebSocketServer';

describe('New game', () => {

    const mockedSaveGame = saveGame as jest.Mock;
    const testGame = createTestGame(4);
    mockedSaveGame.mockResolvedValue(testGame);
    const client = createMockSocket();

    afterEach(() => {
        jest.clearAllMocks();
    })
    it('should create a new game using default globe and default playermax', async () => {
        let globe = defaultGlobeSeed();
        let players = createTestPlayers(globe.playerMax);
        
        let response: WsResponse = await newGame(client, players, globe.id);
        expect(response.data.gameState.id).toBeTruthy();
        expect(manager.connectToGame).toHaveBeenCalledWith(client, testGame.saveName, testGame.players.map((player) => player.id));
        expect(saveGame).toHaveBeenCalledWith(expect.objectContaining({globeID: globe.id, players: players}));
    })

    it('should use the saveName that was provided, if provided', async () => {
        let globe = defaultGlobeSeed();
        let players = createTestPlayers(globe.playerMax);
        let saveName = 'testSaveName';
        let response: WsResponse = await newGame(client, players, globe.id, undefined, saveName);
        expect(saveGame).toHaveBeenCalledWith(expect.objectContaining({saveName: saveName}));
    })

    it('should throw an error if player count exceeds globe player max', async () => {
        let globe = defaultGlobeSeed();
        let players = createTestPlayers(globe.playerMax + 1);
        await expect(newGame(client, players, globe.id)).rejects.toThrow(playerCountError);
    })

})