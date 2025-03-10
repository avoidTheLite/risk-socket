import { Game } from "../../common/types/types";

export default function victoryCheck(game: Game): boolean {

    let deployedArmies: number[] = [];
    for (let i = 0; i < game.players.length; i++) {
        deployedArmies[i] = 0;
    }
    let victory: boolean = true;
    for (let i = 0; i < game.countries.length; i++) {
        const owner = game.countries[i].ownerID;
        deployedArmies[owner] += game.countries[i].armies;
    }
    console.log(deployedArmies)
    for (let i = 0; i < game.players.length; i++) {
        if ( i != game.activePlayerIndex) {
            if (deployedArmies[i] > 0) {
                victory = false
            }
        }
    }

    return victory
}