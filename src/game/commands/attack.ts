import rollCombat from "../services/rollCombat";
import { Game, Engagement, WsResponse } from "../../common/types/types";
import { attackError } from "../../common/types/errors";
import saveGame from "../saveGame";
import victoryCheck from "../services/victoryCheck";

export function combatResult(game: Game, engagement: Engagement): Game {
    game.countries[engagement.attackingCountry].armies -= engagement.attackersLost;
    game.countries[engagement.defendingCountry].armies -= engagement.defendersLost;
    if (game.countries[engagement.defendingCountry].armies == 0) {
        engagement.conquered = true;
        game.turnTracker.earnedCard = true;
        game.turnTracker.phase = 'conquer';
    }
    return game
}
export default async function attack(game: Game, engagement: Engagement): Promise<WsResponse> {
    if (game.phase !== 'play') {
        throw new attackError({ message: 'Not in play phase'});
    }
    if (game.turnTracker.phase !== 'combat') {
        throw new attackError({ message: 'Not in combat phase of your turn'});
    }
    if (game.countries[engagement.attackingCountry].armies <= engagement.attackingTroopCount) {
        throw new attackError({ message: 'Not enough armies to attack'});
    }
    if (game.countries[engagement.attackingCountry].ownerID !== game.activePlayerIndex) {
        throw new attackError({ message: `Player ${game.activePlayerIndex} is not the owner of ${game.countries[engagement.attackingCountry].name}`});
    }
    if (game.countries[engagement.defendingCountry].ownerID === game.activePlayerIndex) {
        throw new attackError({ message: `Player ${game.activePlayerIndex} is the owner of ${game.countries[engagement.defendingCountry].name}. You cannot attack your own country`});
    }
    if (!game.countries[engagement.attackingCountry].connectedTo.includes(engagement.defendingCountry)) {
        throw new attackError({ message: `Countries ${game.countries[engagement.attackingCountry].name} and ${game.countries[engagement.defendingCountry].name} are not connected`});
    }
    
    engagement = rollCombat(engagement);
    game = combatResult(game, engagement);
    let message: string
    if (engagement.conquered) {
        const victory: boolean = victoryCheck(game);
        if (victory) {
            message = `Player ${game.activePlayerIndex} has won the game after conquering ${game.countries[engagement.defendingCountry].name}!`
            game.phase = 'end';
        } else {
            message = `Player ${game.activePlayerIndex} has defeated ${game.countries[engagement.defendingCountry].name}!`
        }
    }
    else {
        message = `Player ${game.activePlayerIndex} has attacked ${game.countries[engagement.defendingCountry].name} with ${engagement.attackingTroopCount} armies from ${game.countries[engagement.attackingCountry].name}. `
    }
    game = await saveGame(game);
    const response = {
        data: {
            action: 'attack',
            message: message,
            status: "success",
            engagement: engagement,
            gameState: game
        }
    }
    return response
}