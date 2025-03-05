import { Knex } from "knex";
import { defaultGlobeSeed } from "../../common/util/test/defaultGlobeSeed";
import createTestPlayers from "../../common/util/test/createTestPlayers";
import { GameRecord } from "../../common/types/types";

export async function seed(knex: Knex): Promise<void> {
    await knex('gameState').del();
    const globe = defaultGlobeSeed();
    const players = createTestPlayers(4);
    const game: GameRecord = {
        saveName: 'defaultGameID - autosave turn 0',
        id: 'defaultGameID',
        name: '4 player test game',
        players: JSON.stringify(players),
        countries: JSON.stringify(globe.countries),
        continents: JSON.stringify(globe.continents),
        globeID: globe.id,
        turn: 0,
        turnTracker: JSON.stringify({
            phase: 'deploy',
            earnedCard: false,
            armiesEarned: 0,
        }),
        phase: 'deploy',
        activePlayerIndex: 0
    }

    await knex('gameState').insert(game) 
}