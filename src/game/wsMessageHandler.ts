import deploy from "./commands/deploy";
import newGame from "./newGame";
import { Game, WsResponse } from "../common/types/types";
import loadGame from "./loadGame";
import { turnError } from "../common/types/errors";
import endTurn from "./commands/endTurn";
import attack from "./commands/attack";
import cardMatch from "./commands/cardMatch";
import conquer from "./commands/conquer";
import move from "./commands/move";
import availableCommands from "./commands/availableCommands";
import openGame from "./commands/openGame";
import viewOpenGames from "./commands/viewOpenGames";
import { WebSocket } from "ws";
import joinGame from "./commands/joinGame";
import actionAllowed from "./services/actionAllowed";

export default async function wsMessageHandler(data: any, ws: WebSocket) {
    let game: Game
    let response: WsResponse
    switch(data.action) {       
    case 'newGame':
        response = await newGame(ws, data.players, data.globeID, data.gameOptions, (data.saveName) ? data.saveName: undefined);
        return response
    case 'deploy' :
        game = await loadGame(data.saveName);
        actionAllowed(game, data.action, data.playerID, ws);
        response = await deploy(game, data.deployment);
        return response
    case 'endTurn':
        game = await loadGame(data.saveName);
        actionAllowed(game, data.action, data.playerID, ws);
        response = await endTurn(game);
        return response
    case 'attack':
        game = await loadGame(data.saveName);
        actionAllowed(game, data.action, data.playerID, ws);
        data.engagement.defendingTroopCount = game.countries[data.engagement.defendingCountry].armies;
        response = await attack(game, data.engagement);
        return response
    case 'cardMatch':
        game = await loadGame(data.saveName);
        actionAllowed(game, data.action, data.playerID, ws);
        response = await cardMatch(game, data.cards);
        return response
    case 'conquer':
        game = await loadGame(data.saveName);
        actionAllowed(game, data.action, data.playerID, ws);
        response = await conquer(game, data.engagement);
        return response
    case 'move':
        game = await loadGame(data.saveName);
        actionAllowed(game, data.action, data.playerID, ws);
        response = await move(game, data.movement);
        return response
    case 'availableCommands':
        game = await loadGame(data.saveName);
        response = await availableCommands(game, data.playerID);
        return response
    case 'openGame':
        game = await loadGame(data.saveName);
        response = openGame(game, data.playerSlots);
        return response
    case 'viewOpenGames':
        response = viewOpenGames();
        return response
    case 'joinGame':
        game = await loadGame(data.saveName);
        response = await joinGame(ws, game.saveName, data.playerSlots);
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