import { Country, Player } from "../../common/types/types";

export default function assignCountries(players: Player[], countries: Country[]) {
    //Fisher-yates shuffle
    let randomOrder: Array<number> = []
    for (let i = countries.length-1; i > 0; i--) {
        let j: number = Math.floor(Math.random()*(i+1));
        [countries[i], countries[j]] = [countries[j], countries[i]]
    }

    for (let i = 0; i < countries.length; i++) {
        let playerID: string = players[i % players.length].id
        countries[i].ownerID = playerID
    }
    countries.sort((a: Country, b: Country) => Number(a.id)-Number(b.id));
    return countries
}