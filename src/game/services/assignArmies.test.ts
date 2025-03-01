import { describe, test, it, expect } from '@jest/globals';
import { Player, Country } from '../../common/types/types'
import assignArmies from './assignArmies';
import createTestPlayers from '../../common/util/test/createTestPlayers';
import { defaultCountrySeed } from '../../common/util/test/defaultGlobeSeed';
import assignCountries from './assignCountries';

describe('starting armies', () => {

    test('army count total when player count = 4 is 30*4=120', () => {
        const playerCount: number = 4
        let players: Player[] = createTestPlayers(4);
        let countries: Country[] = defaultCountrySeed();
        countries = assignCountries(players, countries);
        players = assignArmies(players, countries);

        let totalArmyCount: number = countries.length;
        for (let i = 0; i < players.length; i++) {
            totalArmyCount += players[i].armies
        } 
        expect(totalArmyCount).toBe(120)
    })

  

})