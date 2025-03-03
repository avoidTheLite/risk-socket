import { Country } from "../../common/types/types";

export default function connectedCountries(countries: Country[], countryID: number) {
    const connections: Country[] = []
    for (let i = 0; i < countries[countryID].connectedTo.length; i++) {
        const connectedID = countries[countryID].connectedTo[i];
        connections.push(countries[connectedID])
    }
    return connections
}