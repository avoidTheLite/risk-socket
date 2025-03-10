import { Country, Player } from "../../common/types/types";

export default function assignArmies(players: Player[], countries: Country[], startingArmiesOverride?: number) {
    let startingArmies: number;
    if(!startingArmiesOverride) {
        startingArmies = 50-5*players.length;
        } 
    else {
        startingArmies = startingArmiesOverride;
    }

    for (let i = 0; i < players.length; i++){
        players[i].armies = startingArmies;
        players[i].cards = []
    }
    for (let i = 0; i < countries.length; i++){
        const ownerIndex: number = countries[i].ownerID
        if (ownerIndex == 99) {
            countries[i].armies = 2
        } else {
        players[ownerIndex].armies -= 1;
        countries[i].armies = 1
        }
    }

    return players
}