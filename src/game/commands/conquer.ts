import { Game, Engagement } from "../../common/types/types";
import saveGame from "../saveGame";
import { conquerError } from "../../common/types/errors";

export default async function conquer(game: Game, engagement: Engagement) {
    if (game.countries[engagement.defendingCountry].armies != 0) {
        throw new conquerError({ message: `Country ${game.countries[engagement.defendingCountry].name} still has defending armies`});
    }
    if (game.turnTracker.phase !== 'conquer') {
        throw new conquerError({ message: 'Not in conquer phase of your turn'});
    }
    if (!engagement.conquered) {
        throw new conquerError({ message: 'Country has not been conquered'});
    }
    if (game.countries[engagement.attackingCountry].ownerID !== game.activePlayerIndex) {
        throw new conquerError({ message: `Player ${game.activePlayerIndex} is not the owner of ${game.countries[engagement.attackingCountry].name}`});
    }
    if (game.countries[engagement.defendingCountry].ownerID === game.activePlayerIndex) {
        throw new conquerError({ message: `Player ${game.activePlayerIndex} is the owner of ${game.countries[engagement.defendingCountry].name}. You cannot conquer your own country`});
    }
    if (!game.countries[engagement.attackingCountry].connectedTo.includes(engagement.defendingCountry)) {
        throw new conquerError({ message: `Countries ${game.countries[engagement.attackingCountry].name} and ${game.countries[engagement.defendingCountry].name} are not connected`});
    }
    if (engagement.attackingTroopCount >= game.countries[engagement.attackingCountry].armies) {
        throw new conquerError({ message: `You must leave at least one army behind when conquering. Current armies on ${game.countries[engagement.attackingCountry].name}: ${game.countries[engagement.attackingCountry].armies}`});
    }
    if(game.lastEngagement.attackingCountry !== engagement.attackingCountry) {
        throw new conquerError({ message: `You must conquer from the same country as your last attack. Current country: ${game.countries[engagement.attackingCountry].name}`});
    }

    game.countries[engagement.attackingCountry].armies -= engagement.attackingTroopCount;
    game.countries[engagement.defendingCountry].armies = engagement.attackingTroopCount;
    game.countries[engagement.defendingCountry].ownerID = game.activePlayerIndex;
    game.countries[engagement.defendingCountry].color = game.players[game.activePlayerIndex].color;
    game.turnTracker.phase = 'combat';
    engagement.conquered = false;
    game = await saveGame(game);
    const response = {
        data: {
            action: 'conquer',
            message: `Player ${game.activePlayerIndex} has conquered ${game.countries[engagement.defendingCountry].name} with ${engagement.attackingTroopCount} armies from ${game.countries[engagement.attackingCountry].name}. `,
            status: "success",
            engagement: engagement,
            gameState: game,
        }
    }

    return response
}
