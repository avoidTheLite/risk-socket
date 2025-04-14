jest.mock('../../common/util/createWebSocketServer', () => ({
    manager: {
        getOwner: jest.fn(),
        connectToGame: jest.fn(),
    }
}));

import actionAllowed from "./actionAllowed";
import { describe, expect, test } from '@jest/globals'
import createMockSocket from "../../common/util/test/createMockSocket";
import createTestGame from "../../common/util/test/createTestGame";
import { manager } from "../../common/util/createWebSocketServer"
import { PlayerControlError, TurnError } from "../../common/types/errors";
import { Game, WsActions } from "../../common/types/types"
import { WebSocket } from 'ws'



describe('Action Allowed - unit tests', () => {
    let wsHost: WebSocket
    let ws2: WebSocket
    let game: Game
    wsHost = createMockSocket();
    ws2 = createMockSocket();
    const mockedGetOwner = manager.getOwner as jest.Mock;
    mockedGetOwner.mockReturnValue(wsHost);
    
    
    beforeEach(() => {
        game = createTestGame(4);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })
    
    test('should throw TurnError when non-active player is requesting action', () => {
        const playerID = 1
        const action: WsActions = 'deploy' as WsActions
        expect(() => actionAllowed(game, action, playerID, wsHost)).toThrow(TurnError)
    })
    
    test('should throw PlayerControlError if active player is not controlled by requesting client', () => {
        const playerSlots: number[] = [ 0, 1, 2, 3]
        const playerID = 0
        const action: WsActions = 'deploy' as WsActions
        manager.connectToGame(wsHost, game.saveName, playerSlots)
        expect(() => actionAllowed(game, action, playerID, ws2)).toThrow(PlayerControlError)
    })
    
    test('should NOT throw an error when controlling client requests action for active player', () => {
        const playerSlots: number[] = [ 0, 1, 2, 3]
        const playerID = 0
        const action: WsActions = 'deploy' as WsActions
        manager.connectToGame(wsHost, game.saveName, playerSlots)
        expect(() => actionAllowed(game, action, playerID, wsHost)).not.toThrow();
    })

})