import { Game, Engagement } from "../../common/types/types";
import saveGame from "../saveGame";
import { conquerError } from "../../common/types/errors";
import { numberOfCountriesOwnedByPlayer } from "../services/calculateReinforcements";


export function playerIsDefeated(game: Game, playerID: number): boolean {
    if (numberOfCountriesOwnedByPlayer(game.countries, playerID) === 0) {
        return true;
    }
    return false
}

function transferCards(game: Game, engagement: Engagement) {
    const attackingPlayerID = game.countries[engagement.attackingCountry].ownerID;
    const defendingPlayerID = game.countries[engagement.defendingCountry].ownerID;
    game.players[attackingPlayerID].cards = [...game.players[attackingPlayerID].cards, ...game.players[defendingPlayerID].cards]; 
}

export default async function conquer(game: Game, engagement: Engagement) {
    if (game.countries[engagement.defendingCountry].armies != 0) {
        throw new conquerError({ message: `Country ${game.countries[engagement.defendingCountry].name} still has defending armies`});
    }
    if (game.turnTracker.phase !== 'conquer') {
        throw new conquerError({ message: 'Not in conquer phase of your turn'});
    }
    if (!game.lastEngagement.conquered) {
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
    if (engagement.attackingTroopCount < game.lastEngagement.attackingTroopCount - game.lastEngagement.attackersLost) {
        throw new conquerError({ message: `You must conquer at least as many armies that survived your last attack. ${game.lastEngagement.attackingTroopCount} attackers - ${game.lastEngagement.attackersLost} attackers lost = ${game.lastEngagement.attackingTroopCount - game.lastEngagement.attackersLost} minimum conquerers`});
    }
    if(game.lastEngagement.attackingCountry !== engagement.attackingCountry) {
        throw new conquerError({ message: `You must conquer from the same country as your last attack. Current country: ${game.countries[engagement.attackingCountry].name}`});
    }
    const defendingPlayerID = game.countries[engagement.defendingCountry].ownerID;
    game.countries[engagement.attackingCountry].armies -= engagement.attackingTroopCount;
    game.countries[engagement.defendingCountry].armies = engagement.attackingTroopCount;
    game.countries[engagement.defendingCountry].ownerID = game.activePlayerIndex;
    game.countries[engagement.defendingCountry].color = game.players[game.activePlayerIndex].color;
    let defeatedMessage: string = '';
    if (playerIsDefeated(game, defendingPlayerID)) {
        const cardsTransferred: number = game.players[engagement.defendingCountry].cards.length;
        transferCards(game, engagement);
        defeatedMessage = `${game.players[engagement.attackingCountry].name} (Player ${game.players[engagement.attackingCountry].id}) has defeated ${game.players[engagement.defendingCountry].name} (Player ${game.players[engagement.defendingCountry].id}) and received ${cardsTransferred} cards. `;
    }
    game.turnTracker.phase = 'combat';
    engagement.conquered = false;
    game = await saveGame(game);
    const response = {
        data: {
            action: 'conquer',
            message: `${defeatedMessage} ${game.players[game.activePlayerIndex].name} (Player ${game.activePlayerIndex}) has conquered ${game.countries[engagement.defendingCountry].name} with ${engagement.attackingTroopCount} armies from ${game.countries[engagement.attackingCountry].name}. `,
            status: "success",
            engagement: engagement,
            gameState: game,
        }
    }

    return response
}
