import { default as availableCommands, cardMatchOptions } from "./availableCommands";
import { Game, WsResponse, Card, AvailableCommand, WsActions } from "../../common/types/types";
import { describe, test, expect } from '@jest/globals';
import createTestGame from "../../common/util/test/createTestGame";
import assignCountries from "../services/assignCountries";
import assignArmies from "../services/assignArmies";
import defaultCardSeed from "../../common/util/test/defaultCardSeed";




describe('availableCommands - Unit tests', () => {
    
    // During Deploy Phase
    test('should return attack, move, and conquer options as unavilable', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.phase = 'deploy';

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.attack.available).toBe(false);
        expect(response.data.availableCommands.move.available).toBe(false);
        expect(response.data.availableCommands.conquer.available).toBe(false);
    })

    test('should return valid deploy options', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.players[playerID].armies = 5;
        game.phase = 'deploy';
        game.countries = assignCountries(game.players, game.countries);

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.deploy.available).toBe(true);
        expect(response.data.availableCommands.deploy.deployOptions?.length).toBe(11);
    })

    test('should return valid deploy options during play phase', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.players[playerID].armies = 5;
        game.phase = 'play';
        game.turnTracker.phase = 'deploy';
        game.countries = assignCountries(game.players, game.countries);

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.deploy.available).toBe(true);
        expect(response.data.availableCommands.deploy.deployOptions?.length).toBe(11);
    })

    test('should return valid attack options when player 0 has armies on alaska only', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.countries = assignCountries(game.players, game.countries);
        game.players = assignArmies(game.players, game.countries);
        game.countries[0].armies = 10;
        game.phase = 'play';
        game.turnTracker.phase = 'combat';

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.attack.available).toBe(true);
        expect(response.data.availableCommands.attack.attackOptions?.length).toBe(3);
    })

    test('should exclude country from attack option when player owns a connected country', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.countries = assignCountries(game.players, game.countries);
        game.players = assignArmies(game.players, game.countries);
        game.countries[0].ownerID = 0;
        game.countries[0].armies = 10;
        game.countries[1].armies = 10;
        game.countries[31].ownerID = 0;
        game.phase = 'play';
        game.turnTracker.phase = 'combat';

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.attack.available).toBe(true);
        expect(response.data.availableCommands.attack.attackOptions?.length).toBe(2);
    })

    test('should return the only the conquer option when available', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.countries = assignCountries(game.players, game.countries);
        game.players = assignArmies(game.players, game.countries);
        game.countries[0].ownerID = 0;
        game.countries[0].armies = 10;
        game.countries[1].armies = 0;
        game.phase = 'play';
        game.turnTracker.phase = 'conquer';
        game.lastEngagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 1,
            attackersLost: 0,
            defendersLost: 1,
            conquered: true
        }

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.conquer.available).toBe(true);
        expect(response.data.availableCommands.conquer.conquerOption.defendingCountry).toBe(1);
        expect(response.data.availableCommands.move.available).toBe(false);
    })

    test('should return valid move options when player 0 has armies on alaska only', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.countries = assignCountries(game.players, game.countries);
        game.players = assignArmies(game.players, game.countries);
        game.countries[0].armies = 10;
        game.countries[0].ownerID = 0;
        game.countries[1].ownerID = 0;
        game.countries[5].ownerID = 0;
        game.phase = 'play';
        game.turnTracker.phase = 'combat';

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.status).toBe('success');
        expect(response.data.availableCommands.move.available).toBe(true);
        expect(response.data.availableCommands.move.moveOptions?.length).toBe(2);
    })
})
describe('cardMatchOptions - Unit tests', () => {
    
    test('card match options should work with 5 of a kind', () => {
        let cardsAvailable: Card[] = defaultCardSeed();
        let playerCards = [
            cardsAvailable[0],
            cardsAvailable[3],
            cardsAvailable[6],
            cardsAvailable[9],
            cardsAvailable[12],
        ]
        let cardMatch: AvailableCommand = {
            action: 'cardMatch' as WsActions,
            playerID: 0,
            available: false,
            cardMatchOptions: [],
        }
        cardMatch = cardMatchOptions(playerCards, cardMatch);
        expect(cardMatch.cardMatchOptions.length).toBe(1);
    })

    test('card match options should work with 4 of a kind', () => {
        let cardsAvailable: Card[] = defaultCardSeed();
        let playerCards = [
            cardsAvailable[0],
            cardsAvailable[3],
            cardsAvailable[6],
            cardsAvailable[9],
            cardsAvailable[11],
        ]
        let cardMatch: AvailableCommand = {
            action: 'cardMatch' as WsActions,
            playerID: 0,
            available: false,
            cardMatchOptions: [],
        }
        cardMatch = cardMatchOptions(playerCards, cardMatch);
        expect(cardMatch.cardMatchOptions.length).toBe(1);
    })

    test('card match options should work with 2 sets of 3 of a kind', () => {
        let cardsAvailable: Card[] = defaultCardSeed();
        let playerCards = [
            cardsAvailable[0],
            cardsAvailable[1],
            cardsAvailable[3],
            cardsAvailable[4],
            cardsAvailable[6],
            cardsAvailable[7],
        ]
        let cardMatch: AvailableCommand = {
            action: 'cardMatch' as WsActions,
            playerID: 0,
            available: false,
            cardMatchOptions: [],
        }
        cardMatch = cardMatchOptions(playerCards, cardMatch);
        expect(cardMatch.cardMatchOptions.length).toBe(2);
    })

    test('should return card match options when player has 2 sets of 3 of a kind', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.phase = 'deploy';
        let cardsAvailable: Card[] = defaultCardSeed();
        game.players[0].cards = [
            cardsAvailable[0],
            cardsAvailable[1],
            cardsAvailable[3],
            cardsAvailable[4],
            cardsAvailable[6],
            cardsAvailable[7],
        ]

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.cardMatch.available).toBe(true);
        expect(response.data.availableCommands.cardMatch.cardMatchOptions.length).toBe(2);
    })

    test('should return card match options when player has one of each symbol', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.phase = 'play';
        game.turnTracker.phase = 'deploy';
        let cardsAvailable: Card[] = defaultCardSeed();
        game.players[0].cards = [
            cardsAvailable[0],
            cardsAvailable[1],
            cardsAvailable[2],
        ]

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.cardMatch.available).toBe(true);
        expect(response.data.availableCommands.cardMatch.cardMatchOptions.length).toBe(1);
    })

    test('should return card match options during combat phase when >= 5 cardsv', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.phase = 'play';
        game.turnTracker.phase = 'combat';
        let cardsAvailable: Card[] = defaultCardSeed();
        game.players[0].cards = [
            cardsAvailable[0],
            cardsAvailable[1],
            cardsAvailable[2],
            cardsAvailable[3],
            cardsAvailable[4],
        ]

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.cardMatch.available).toBe(true);
        expect(response.data.availableCommands.cardMatch.cardMatchOptions.length).toBe(1);
    })
})