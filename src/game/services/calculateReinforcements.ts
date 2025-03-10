import { Continent, Country } from "../../common/types/types";

export default function calculateReinforcements(activePlayerIndex: number, countries: Country[], continents: Continent[]) {
    let countriesOwned: number = 0
    let reinforcements: number = 0
    const countryMap = new Map<number, Country>();
    countries.forEach(country => countryMap.set(country.id, country));

    for (let i = 0; i < continents.length; i++) {
        const continent = continents[i];
        let countriesOwnedInContinent: number = 0;
        for (let j = 0; j < continent.countries.length; j++) {
            const countryID = continent.countries[j];
            const country = countryMap.get(countryID);
            if (!country) {
                console.error(`Globe Data Error: Country not found: ${countryID}`);
                continue;
            } else {
                if (country.ownerID === activePlayerIndex) {
                    countriesOwnedInContinent += 1;
                }
            }
        }
        if (countriesOwnedInContinent === continent.countries.length) {
            reinforcements += continents[i].armies;
        }
       
    }
    for (let i = 0; i < countries.length; i++) {
        if (countries[i].ownerID === activePlayerIndex) {
            countriesOwned += 1;
        }
       
    }
    reinforcements += Math.floor(countriesOwned/3);
    if (reinforcements < 3) {
        reinforcements = 3
    }
    return reinforcements   
}