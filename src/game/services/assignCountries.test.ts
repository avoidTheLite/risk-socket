import assignCountries from "./assignCountries";
import { describe, expect, test, it } from "@jest/globals";
import createTestPlayers from "../../common/util/test/createTestPlayers";
import { defaultCountrySeed } from "../../common/util/test/defaultGlobeSeed";
import { Player, Country } from "../../common/types/types"

describe('assign countries to 4 players', () => {

    
    test('should only assign playerIDs 0-3 when 4 players are in game', () => {
        const playerCount: number = 4
        const players: Player[] = createTestPlayers(playerCount);
        let countries: Country[] = defaultCountrySeed();
        countries = assignCountries(players, countries)
        let countryOwnerIDs: number[] = [];
        for (let i = 0; i < countries.length; i++) {
            countryOwnerIDs.push(Number(countries[i].ownerID))
        }
        expect(Math.max(...countryOwnerIDs)).toBe(playerCount-1)
    })

    test('All countries are assigned when 5 players are in game', () => {
        const playerCount: number = 5
        const players: Player[] = createTestPlayers(playerCount);
        let countries: Country[] = defaultCountrySeed();
        countries = assignCountries(players, countries)
        
        let invalidAssignment: boolean = false;
        for (let i = 0; i < countries.length; i++) {
            if (Number(countries[i].ownerID) >= playerCount){
                console.log(`failed for i = ${i}, ownerID for ${countries[i].id} is ${countries[i].ownerID} and playerCount = ${playerCount}`);
                invalidAssignment = true;
            }         
            if (invalidAssignment === true) {
                console.log(`i = ${i}, ownerID for ${countries[i].id} is ${countries[i].ownerID}`);
                break
            }
        }
        expect(invalidAssignment).toBe(false)
    })
}) 