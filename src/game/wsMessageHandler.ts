import deploy from "./commands/deploy";
import newGame from "./newGame";
import { Game, WsResponse, Engagement } from "../common/types/types";
import loadGame from "./loadGame";
import { turnError } from "../common/types/errors";
import endTurn from "./commands/endTurn";
import attack from "./commands/attack";
import cardMatch from "./commands/cardMatch";
import conquer from "./commands/conquer";
import move from "./commands/move";

export default async function wsMessageHandler(data: any) {
    let game: Game
    let response: WsResponse
    switch(data.action) {       
    case 'newGame':
        game = await newGame(data.players, data.globeID, data.gameOptions);
        response= {
            data: {
                action: data.action,
                gameOptions: data.gameOptions,
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
                message: `Not your turn to deploy. Active player = player ${game.activePlayerIndex}. Player ID = ${data.playerID}`
            })
        }
        game = await deploy(game, data.deployment.targetCountry, data.deployment.armies);
        response = {
            data: {
                action: data.action,
                message: `${data.playerName} Deployed ${data.deployment.armies} armies to ${data.deployment.targetCountry}`,
                status: "success",
                gameState: game
            }
        }
        return response
    case 'endTurn':
        game = await loadGame(data.saveName);
        if (game.activePlayerIndex !== data.playerID) {
            throw new turnError({
                message: `Not your turn to end. Active player = player ${game.activePlayerIndex}. Player ID = ${data.playerID}`
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
        return response
    case 'attack':
        game = await loadGame(data.saveName);
        if (game.players[game.activePlayerIndex].id !== data.playerID) {
            throw new turnError({
                message: `Not your turn to attack. Active player = player ${game.activePlayerIndex}. Player ID = ${data.playerID}`
            })
        }
        data.engagement.defendingTroopCount = game.countries[data.engagement.defendingCountry].armies;
        response = await attack(game, data.engagement);
        return response
    case 'cardMatch':
        game = await loadGame(data.saveName);
        if (game.players[game.activePlayerIndex].id !== data.playerID) {
            throw new turnError({
                message: `Not your turn to cash in cards. Active player = player ${game.activePlayerIndex}. Player ID = ${data.playerID}`
            })
        }
        response = await cardMatch(game, data.cards);
        return response
    case 'conquer':
        game = await loadGame(data.saveName);
        if (game.players[game.activePlayerIndex].id !== data.playerID) {
            throw new turnError({
                message: `Not your turn to conquer. Active player = player ${game.activePlayerIndex}. Player ID = ${data.playerID}`
            })
        }
        response = await conquer(game, data.engagement);
        return response
    case 'move':
        game = await loadGame(data.saveName);
        if (game.players[game.activePlayerIndex].id !== data.playerID) {
            throw new turnError({
                message: `Not your turn to move. Active player = player ${game.activePlayerIndex}. Player ID = ${data.playerID}`
            })
        }
        response = await move(game, data.movement);
        return response
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