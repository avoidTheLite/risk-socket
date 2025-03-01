import createTestPlayers from "./createTestPlayers";
import { defaultGlobeSeed } from "./defaultGlobeSeed";
import { Game, Player, Globe } from "../../types/types"

export default function createTestGame(playerCount: number) {
    const players: Player[] = createTestPlayers(playerCount);
    const globe: Globe = defaultGlobeSeed();
    let game: Game = {
        id: 'testGameID',
        saveName: 'testGameID - autosave turn 0',
        name: 'test game',
        players: players,
        countries: globe.countries,
        continents: globe.continents,
        globeID: globe.id,
        turn: 0,
        phase: 'deploy',
        activePlayerIndex: 0
    }
    return game
}