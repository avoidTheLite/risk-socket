import deploy from "./commands/deploy";
import newGame from "./newGame";
import { Game, WsResponse } from "../common/types/types";
import loadGame from "./loadGame";
import { turnError } from "../common/types/errors";
import endTurn from "./commands/endTurn";

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
        if (Number(game.players[game.activePlayerIndex].id) !== Number(data.playerID)) {
            throw new turnError({
                message: `Not your turn. Active player = player ${game.activePlayerIndex}. Player ID = ${data.playerID}`
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
    case 'endTurn':
        game = await loadGame(data.saveName);
        if (Number(game.players[game.activePlayerIndex].id) !== Number(data.playerID)) {
            throw new turnError({
                message: `Not your turn. Active player = player ${game.activePlayerIndex}. Player ID = ${data.playerID}`
            })
        }
        game = await endTurn(game);
        response = {
            data: {
                action: data.action,
                message: `Player ${data.playerID} has ended their turn`,
                status: "success",
                gameState: game
            }
        }
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