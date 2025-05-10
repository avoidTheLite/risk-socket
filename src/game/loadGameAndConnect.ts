import { Game, WsResponse } from '../common/types/types';
import loadGame from './loadGame';
import { WebSocket } from 'ws';
import { manager } from '../common/util/createWebSocketServer';
import { GameAlreadyHostedError } from '../common/types/errors';

export default async function loadGameAndConnect(ws: WebSocket, saveName: string): Promise<WsResponse> {
    const host: WebSocket | undefined = manager.getHost(saveName)
    if (host) {
        throw new GameAlreadyHostedError({message: `Unable to load game. Game with save name ${saveName} is already hosted`});
    }

    const game: Game = await loadGame(saveName);
    try {
        manager.connectToGame(ws, game.saveName, game.players.map((player) => player.id));
    } catch (error) {
        console.error(error);
    }
    console.log(`Game Loaded: ${game.id} with save name: ${game.saveName}`)

    const response: WsResponse = {
        data: {
            action: 'loadGame',
            message: `Successfully loaded game with save name ${saveName}`,
            status: 'success',
            gameState: game
        }
    }
    return response;
}