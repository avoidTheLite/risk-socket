import { Country, Player, GameOptions } from "../../common/types/types";

export default function assignCountries(players: Player[], countries: Country[], gameOptions?: GameOptions) {
    //Fisher-yates shuffle
    if (gameOptions?.randomAssignment) {
        for (let i = countries.length-1; i > 0; i--) {
            let j: number = Math.floor(Math.random()*(i+1));
            [countries[i], countries[j]] = [countries[j], countries[i]]
        }
    }
    for (let i = 0; i < countries.length; i++) {
        let playerID: number = players[i % players.length].id
        countries[i].ownerID = playerID
    }
    countries.sort((a: Country, b: Country) => a.id-b.id);
    return countries
}