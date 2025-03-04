import { describe, expect, test } from '@jest/globals';
import calculateReinforcements from "./calculateReinforcements";
import { Player, Country, Continent, Globe } from "../../common/types/types";
import createTestGame from '../../common/util/test/createTestGame';

describe('Calculate reinforcements - Unit Tests', () => {

    test('should calculate reinforcements correctly for a player owns North America Only', () => {
        // North America has 9 countries and is worth 5 Armies
        const expectedReinforcements: number = 8
        
        let game = createTestGame(4);
        for (let i = 0; i < 9; i++) {
            game.countries[i].ownerID = 0;
        }
        
        const reinforcements = calculateReinforcements(0, game.countries, game.continents);
        expect(reinforcements).toBe(expectedReinforcements)
    })

    test('should calculate reinforcements correctly for a player owning 0 continents', () => {
        const countriesOwned: number = 10
        const expectedReinforcements: number = 3
        let game = createTestGame(4);
        for (let i = 0; i < countriesOwned-1; i++) {
            game.countries[2*i].ownerID = 0; // skip countries to ensure player owns 0 continents
        }
        const reinforcements = calculateReinforcements(0, game.countries, game.continents);
        expect(reinforcements).toBe(expectedReinforcements)
    })
})