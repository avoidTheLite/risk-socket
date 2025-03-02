import deploy from "./commands/deploy";
import newGame from "./newGame";
import { Game, WsResponse } from "../common/types/types";
import loadGame from "./loadGame";
import { turnError } from "../common/types/errors";

export default async function wsMessageHandler(data: any) {
    let game: Game
    let response: WsResponse
    switch(data.action) {       
    case 'newGame':
        game = await newGame(data.players, data.globeID);
        response= {
            data: {
                action: data.action,
                message: `New game created with save name: ${game.saveName} for ${data.players.length} players`,
                status: "success",
                gameState: game
            }
        }
        return response
    case 'deploy' :
        game = await loadGame(data.saveName);
        if (game.players[game.activePlayerIndex].id !== data.playerID) {
            throw new turnError({
                message: 'Not your turn'
            })
        }
        game = await deploy(game, data.countryID, data.armies);
        response = {
            data: {
                action: data.action,
                message: `${data.playerName} Deployed ${data.armies} armies to ${data.countryID}`,
                status: "success",
                gameState: game
            }
        }
        return response
    case 'attack':
    case 'move':
    case 'echo':
        response = {
            data: {
                action: data.action,
                message: data.message,
                status: "success"
            }
        }
        return response
    }
}