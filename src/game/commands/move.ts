import { Game, Movement, WsResponse } from "../../common/types/types";
import { moveError } from "../../common/types/errors";
import saveGame from "../saveGame";

export default async function move(game: Game, movement: Movement): Promise<WsResponse> {
    if (game.countries[movement.sourceCountry].ownerID !== game.activePlayerIndex ||
    game.countries[movement.targetCountry].ownerID !== game.activePlayerIndex) {
        throw new moveError({ message: `Player is not the owner of both countries. Source Country = ${movement.sourceCountry}, Owner = ${game.countries[movement.sourceCountry].ownerID}, Target Country = ${movement.targetCountry}, Owner = ${game.countries[movement.targetCountry].ownerID}` });
    }
    if (game.phase !== 'play') {
        throw new moveError({ message: 'Not in play phase'});
    }

    if (game.countries[movement.sourceCountry].armies <= movement.armies) {
        throw new moveError({ message: `You must leave at least one army behind when moving. Current armies on ${game.countries[movement.sourceCountry].name}: ${game.countries[movement.sourceCountry].armies}` });
    }
    if (game.turnTracker.phase !== 'combat') {
        throw new moveError({ message: 'Not in combat phase of your turn'});
    }

    game.countries[movement.sourceCountry].armies -= movement.armies;
    game.countries[movement.targetCountry].armies += movement.armies;
    game.turnTracker.phase = 'end';
    game = await saveGame(game);
    const response: WsResponse = {
        data: {
            action: 'move',
            message: `${game.players[game.activePlayerIndex].name} (Player ${game.activePlayerIndex}) has moved ${movement.armies} armies from ${game.countries[movement.sourceCountry].name} to ${game.countries[movement.targetCountry].name}`,
            status: "success",
            movement: movement,
            gameState: game
        }
    }
    return response
}