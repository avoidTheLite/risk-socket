import createTestPlayers from "./createTestPlayers";
import { defaultGlobeSeed } from "./defaultGlobeSeed";
import { Game, Player, Globe } from "../../types/types"

export default function createTestGame(playerCount: number) {
    const players: Player[] = createTestPlayers(playerCount);
    const globe: Globe = defaultGlobeSeed();
    return new Game(
        'testGameID',
        'testGameID - autosave turn 0',
        players,
        globe.countries,
        globe.continents,
        globe.id,
        0,
        'deploy',
        0
    );
}