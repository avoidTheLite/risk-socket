import { Game, Player, Card } from "../../common/types/types";
import saveGame from "../saveGame";
import nextTurn from "../../game/services/nextTurn";
import { saveGameError, turnError } from "../../common/types/errors";

function endOfDeployPhase(players: Player[]) {
    let totalPlayerArmies: number = 0;
    for (let i = 0; i < players.length; i++) {
        totalPlayerArmies += players[i].armies;
    }
    if (totalPlayerArmies === 0) {
        return 'play'
    } else {
        return 'deploy'
    }
}

function drawCard(cardsAvailable: Card[]): Card {
    const selectedCard: Card = cardsAvailable[Math.floor(Math.random() * cardsAvailable.length)];
    return selectedCard
}

export default async function endTurn(game: Game) {
    try{
        game.turn += 1;
        if (game.phase === 'deploy') {
            game.phase = endOfDeployPhase(game.players);
            if (game.phase === 'play') {
                game.turn = 1;
            }
        } else if (game.phase === 'play') {
            if (game.turnTracker.earnedCard) {
                const card = drawCard(game.cardsAvailable)
                game.players[game.activePlayerIndex].cards.push(card);
                game.cardsAvailable.splice(game.cardsAvailable.indexOf(card), 1); 
            }
        }
        game.activePlayerIndex = (game.turn - 1) % game.players.length;
        game.turnTracker = nextTurn(game.phase, game.activePlayerIndex, game.countries, game.continents);
        game.players[game.activePlayerIndex].armies += game.turnTracker.armiesEarned;
    } catch (error) {
        throw new turnError({ message: `Failed to end turn ${error}` })
    }
    try {
        game = await saveGame(game);
    } catch (error) {
        throw new saveGameError({ message: `Failed to save game ${error}` })
    }
    return game
}