import createTestPlayers from "./createTestPlayers";
import { defaultGlobeSeed } from "./defaultGlobeSeed";
import defaultCardSeed from "./defaultCardSeed";
import { Game, Player, Globe, Card } from "../../types/types"

export default function createTestGame(playerCount: number) {
    const players: Player[] = createTestPlayers(playerCount);
    const globe: Globe = defaultGlobeSeed();
    const cards: Card[] = defaultCardSeed();
    return new Game(
        'testGameID - autosave turn 1',
        'testGameID',
        players,
        globe.countries,
        globe.continents,
        globe.id,
        1,
        {
            phase: 'deploy',
            earnedCard: false,
            armiesEarned: 0,
        },
        'deploy',
        0,
        cards,
        0
    );
}