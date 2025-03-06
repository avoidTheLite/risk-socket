import rollCombat from "../services/rollCombat";
import { Game, Engagement, WsResponse } from "../../common/types/types";
import { attackError } from "../../common/types/errors";
import saveGame from "../saveGame";

export function combatResult(game: Game, engagement: Engagement): Game {
    game.countries[engagement.attackingCountry].armies -= engagement.attackersLost;
    game.countries[engagement.defendingCountry].armies -= engagement.defendersLost;
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
    
    engagement = rollCombat(engagement);
    game = combatResult(game, engagement);
    game = await saveGame(game);
    const response = {
        data: {
            action: 'attack',
            message: `Player ${game.activePlayerIndex} has attacked ${game.countries[engagement.defendingCountry].name} with ${engagement.attackingTroopCount} armies from ${game.countries[engagement.attackingCountry].name}. `,
            status: "success",
            engagement: engagement,
            gameState: game
        }
    }
    return response
}