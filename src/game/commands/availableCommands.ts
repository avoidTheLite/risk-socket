import { conquerError } from "../../common/types/errors";
import { Game, WsActions, AvailableCommand, Deployment, Movement, Engagement, Card } from "../../common/types/types";
import { WsResponse } from "../../common/types/types";

function deployOptions(game: Game, playerID: number, deploy: AvailableCommand): AvailableCommand {
    

    deploy.available = true;
    for (let i = 0; i < game.countries.length; i++) {
        if (game.countries[i].ownerID === game.activePlayerIndex) {
            const deployOption: Deployment = {
                targetCountry: i,
                armies: 1,
            }
            deploy.deployOptions?.push(deployOption);
        }
        
    }

    return deploy
}

export function cardMatchOptions(cards: Card[], cardMatch: AvailableCommand): AvailableCommand {
    const wildCount: number = cards.filter((card) => card.symbol === 'wildcard').length;
    // add 3 of a kind matches
    for (let i = 0; i < cards.length; i++) {
        const matchingCards: Card[] = cards.filter((card) => card.symbol === cards[i].symbol);
        if (matchingCards.length >= 3) {
            cardMatch.cardMatchOptions.push(matchingCards);
            for (let j = 0; j < matchingCards.length; j++) {
                cards.splice(cards.indexOf(matchingCards[j]), 1);
            }
        }
    }
    // add 1 of each symbol matches
    if (wildCount > 0) {
        const matchingCards = [...cards];
        cardMatch.cardMatchOptions.push(matchingCards);
    } else {
        const infantryCards: Card[] = cards.filter((card) => card.symbol === 'infantry');
        const cavalryCards: Card[] = cards.filter((card) => card.symbol === 'cavalry');
        const artilleryCards: Card[] = cards.filter((card) => card.symbol === 'artillery');
        if (infantryCards.length > 0 && cavalryCards.length > 0 && artilleryCards.length > 0) {
            cardMatch.cardMatchOptions.push(cards);
        }
        }
    

    
    if (cardMatch.cardMatchOptions.length > 0) {
        cardMatch.available = true;
    }
    return cardMatch
}


function attackOptions(game: Game, playerID: number, attack: AvailableCommand): AvailableCommand {
    
    for (let i = 0; i < game.countries.length; i++) {
        if (game.countries[i].ownerID === game.activePlayerIndex && game.countries[i].armies > 1) {
            for (let j = 0; j < game.countries[i].connectedTo.length; j++){
                if (game.countries[game.countries[i].connectedTo[j]].ownerID !== game.activePlayerIndex) {
                    const attackOption: Engagement = {
                        defendingCountry: game.countries[i].connectedTo[j],
                        attackingCountry: i,
                        attackingTroopCount: game.countries[i].armies - 1,
                    }
                    attack.attackOptions.push(attackOption)
                }
            }            
        }           
    }
    if (attack.attackOptions.length > 0){
        attack.available = true;
    }
    return attack
}

function conquerOptions(game: Game, conquer: AvailableCommand): AvailableCommand {
    if (game.lastEngagement.conquered != true){
        throw new conquerError({ message: `Mismatch in turntracker phase and engagement state. Turntracker phase: ${game.turnTracker.phase}, engagement conquered state: ${game.lastEngagement.conquered}`});
    }
    conquer.available = true;
    conquer.conquerOption = {
        attackingCountry: game.lastEngagement.attackingCountry,
        defendingCountry: game.lastEngagement.defendingCountry,
        attackingTroopCount: game.countries[game.lastEngagement.attackingCountry].armies -1,
    }

    return conquer
}

function moveOptions(game: Game, playerID: number, move: AvailableCommand): AvailableCommand {
    
    for (let i = 0; i < game.countries.length; i++) {
        if (game.countries[i].ownerID === game.activePlayerIndex && game.countries[i].armies > 1) {
            for (let j = 0; j < game.countries[i].connectedTo.length; j++){
                if (game.countries[game.countries[i].connectedTo[j]].ownerID === game.activePlayerIndex) {
                    const moveOption: Movement = {
                        targetCountry: game.countries[i].connectedTo[j],
                        sourceCountry: i,
                        armies: game.countries[i].armies - 1,
                    }
                    move.moveOptions.push(moveOption)
                }
            }
        }
    }
    if (move.moveOptions.length > 0){
        move.available = true;
    }

    return move
}
export default function availableCommands(game: Game, playerID: number): WsResponse {
    let deploy: AvailableCommand = {
        action: 'deploy' as WsActions,
        playerID: playerID,
        available: false,
        deployOptions: [],
    }
    let move: AvailableCommand = {
        action: 'move' as WsActions,
        playerID: playerID,
        available: false,
        moveOptions: [],
    }
    let attack: AvailableCommand = {
        action: 'attack' as WsActions,
        playerID: playerID,
        available: false,
        attackOptions: [],
    }
    let conquer: AvailableCommand = {
        action: 'conquer' as WsActions,
        playerID: playerID,
        available: false,
        conquerOption: null,
    }
    let cardMatch: AvailableCommand = {
        action: 'cardMatch' as WsActions,
        playerID: playerID,
        available: false,
        cardMatchOptions: [],
    }
    if (game.activePlayerIndex === playerID) {      
        if ((game.phase === 'deploy'|| game.turnTracker.phase === 'deploy') && game.players[game.activePlayerIndex].armies > 0
        ) {
           deploy = deployOptions(game, playerID, deploy);
        }
        if ((game.turnTracker.phase === 'deploy' && game.players[playerID].cards.length >= 3) || game.players[playerID].cards.length >= 5) {
            cardMatch = cardMatchOptions(game.players[playerID].cards, cardMatch);
        }
        if (game.phase === 'play' && game.turnTracker.phase === 'combat') {
            attack = attackOptions(game, playerID, attack);
            move = moveOptions(game, playerID, move);
        }
        if (game.phase === 'play' && game.turnTracker.phase === 'conquer') {
            conquer = conquerOptions(game, conquer);
        }
    }

    const response: WsResponse = {
        data: {
            action: 'availableCommands',
            message: `Retrieved available commands for player ${playerID}`,
            status: "success",
            availableCommands: {
                deploy,
                move,
                attack,
                conquer,
                cardMatch,
            },
            gameState: game
        }
    }
    return response
}