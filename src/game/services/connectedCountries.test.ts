import connectedCountries from "./connectedCountries";
import {describe, expect, test } from '@jest/globals';
import { defaultCountrySeed } from "../../common/util/test/defaultGlobeSeed";
import { Country } from "../../common/types/types";

const alaska: Country = {
    id: 0,
    name: 'Alaska',
    continent: 'North America',
    connectedTo: [ 1, 5, 31 ]
  }

const alberta: Country = {
    id: 1,
    name: 'Alberta',
    continent: 'North America',
    connectedTo: [ 0, 5, 6, 8 ]
  }

const northwestTerritory: Country = {
    id: 5,
    name: 'Northwest Territory',
    continent: 'North America',
    connectedTo: [ 0, 1, 4, 6, 7 ]
  }

const kamchatka: Country = {
  id: 31,
  name: 'Kamchatka',
  continent: 'Asia',
  connectedTo: [ 0, 27, 29, 32, 34, 35 ]
}

  describe('connectedCountries', () => {

    test('Should return Alberta and Northwest territory when Alaska is passed', () => {
        const countries: Country[] = defaultCountrySeed()
        const connected = connectedCountries(countries, 0)
        expect(connected).toEqual([alberta, northwestTerritory, kamchatka])
    })
  })