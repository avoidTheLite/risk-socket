import { Game, Deployment, WsResponse } from "../../common/types/types";
import { deployError } from "../../common/types/errors";
import saveGame from "../saveGame";

function executeDeployment(game: Game, deployment: Deployment): void {
    game.countries[deployment.targetCountry].armies += deployment.armies;
    game.players[game.activePlayerIndex].armies -= deployment.armies;
}

function isEndOfTurnDeployPhase(game: Game): boolean {
    return game.players[game.activePlayerIndex].armies === 0 && game.phase === "play"
}
export default async function deploy(game: Game, deployment: Deployment): Promise<WsResponse> {
    if (game.phase === 'play' && game.turnTracker.phase !== 'deploy') {
        throw new deployError({ message: 'Not in deploy phase of your turn'});
    }
    if (game.players[game.activePlayerIndex].armies < deployment.armies) {
        throw new deployError({ message: `Not enough armies. Player only has ${game.players[game.activePlayerIndex].armies}`});
    } 
    if (game.countries[deployment.targetCountry].ownerID !== game.activePlayerIndex) {
        throw new deployError({ message: `Country does not belong to player ${game.activePlayerIndex}: ${game.players[game.activePlayerIndex].name}. It belongs to player ${game.countries[deployment.targetCountry].ownerID}: ${game.players[game.countries[deployment.targetCountry].ownerID].name}`});
    }
    executeDeployment(game, deployment);
    if (isEndOfTurnDeployPhase(game)) {
        game.turnTracker.phase = "combat";
    }
    try {
        const savedGame = await saveGame(game);
    } catch (error) {
        throw new deployError({ message: `Deployment Failed, failed to save game: ${error.message}`});
    }
    const response = {
        data: {
            action: 'deploy',
            message: `${game.players[game.activePlayerIndex].name} (Player ${game.activePlayerIndex}) has deployed ${deployment.armies} armies to ${game.countries[deployment.targetCountry].name}`,
            status: "success",
            gameState: game
        }
    }
    return response
    
}