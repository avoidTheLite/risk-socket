import { Game, Player, Card } from "../../common/types/types";
import saveGame from "../saveGame";
import updateTurnTracker from "../../game/services/nextTurn";
import { saveGameError, turnError } from "../../common/types/errors";

function isEndOfDeployPhase(players: Player[]): boolean {
    let totalPlayerArmies: number = 0;
    for (let i = 0; i < players.length; i++) {
        totalPlayerArmies += players[i].armies;
    }
    if (totalPlayerArmies === 0) {
        return true
    } else {
        return false
    }
}

function drawCard(cardsAvailable: Card[]): Card {
    const selectedCard: Card = cardsAvailable[Math.floor(Math.random() * cardsAvailable.length)];
    return selectedCard
}

function setNextPlayerTurn(game: Game): void {
    game.activePlayerIndex = (game.turn - 1) % game.players.length;
    game.turnTracker = updateTurnTracker(game.phase, game.activePlayerIndex, game.countries, game.continents);
    game.players[game.activePlayerIndex].armies += game.turnTracker.armiesEarned;
}

export default async function endTurn(game: Game) {
    game.turn += 1;
    if (game.phase === 'deploy') {
        if(isEndOfDeployPhase(game.players)) {
            game.phase = 'play';
            game.turn = 1;
        };
    } else if (game.phase === 'play') {
        if (game.turnTracker.earnedCard) {
            const card = drawCard(game.cardsAvailable)
            game.players[game.activePlayerIndex].cards.push(card);
            game.cardsAvailable.splice(game.cardsAvailable.indexOf(card), 1); 
        }
    }
    setNextPlayerTurn(game);
    try {
        game = await saveGame(game);
    } catch (error) {
        throw new turnError({ message: `Unable to end turn.Failed to save game ${error}` })
    }
    const response = {
        data: {
            action: 'endTurn',
            message: `${game.players[game.activePlayerIndex].name} (Player ${game.activePlayerIndex}) has ended their turn`,
            status: "success",
            gameState: game
        }
    }
    return response
}