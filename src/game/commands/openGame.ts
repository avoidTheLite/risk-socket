import { Game, Player, WsResponse } from "../../common/types/types";
import { openGameError } from "../../common/types/errors";
import { manager } from "../../common/util/createWebSocketServer"

export default  function openGame(game: Game, playerSlots: number[]): WsResponse {

    const playerIDsInGame: number[] = game.players.map((player: Player) => player.id);
    let playerSlotsToOpen: number[] = [];
    let invalidPlayerIDs: number[] = [];
    let invalidMessage: string | undefined;

    for (let i = 0; i < playerSlots.length; i++) {
        if (playerIDsInGame.includes(playerSlots[i])) {
            playerSlotsToOpen.push(playerSlots[i]);
        } else {
            invalidPlayerIDs.push(playerSlots[i]);
            console.log(`Client attempted to open non-existent player slot ${playerSlots[i]}`);
        }
    }
    if(playerSlotsToOpen.length === 0) {
        throw new openGameError({ message: `No Valid player IDs submitted. Unable to open player IDs ${playerSlots.join(', ')}. These players are not in the game!` });
    }
    if (invalidPlayerIDs.length > 0 ) {
        invalidMessage = ` However, these invalid Player IDs: ${invalidPlayerIDs.join(', ')} were ignored.`;
    }
    
    manager.openGame(game.saveName, playerSlots);
    const response: WsResponse = {
        data: {
            action: 'openGame',
            message: `Successfully opened Player Slots: ${playerSlotsToOpen.join(', ')} ${invalidMessage ?? ''}`,
            status: 'success',
            gameState: game
        }

    }

    return response
}