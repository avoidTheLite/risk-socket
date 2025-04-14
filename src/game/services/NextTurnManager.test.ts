import NextTurnManager from "./NextTurnManager";
import { Game, WsResponse } from "../../common/types/types";
import createTestGame from "../../common/util/test/createTestGame";
import assignCountries from "./assignCountries";


describe('Next Turn Manager', () => {
    let nextTurnManager: NextTurnManager
    let game: Game

    beforeEach(() => {
        game = createTestGame(4);
        nextTurnManager = new NextTurnManager(game);
    })

    test('should end deploy phase and start play phase with turn = 1, when all players have 0 armies', async () => {
        const response = await nextTurnManager.endTurn();
        expect(response.data.gameState.phase).toBe('play');
        expect(response.data.gameState.turn).toBe(1);
        expect(response.data.gameState.turn).toBe(1);
    })

    test('should not end deploy phase when players have armies remaining', async () => {
        game.players[game.activePlayerIndex].armies = 2;
        game.players[game.activePlayerIndex + 1].armies = 2;
        game.players[game.activePlayerIndex + 2].armies = 2;
        const response = await nextTurnManager.endTurn();
        expect(response.data.gameState.phase).toBe('deploy');
        expect(response.data.gameState.turn).toBe(2);
        expect(response.data.gameState.activePlayerIndex).toBe(1);
    })

    test('should stay in play phase and increase turn', async () => {
        game.phase = 'play';
        const response = await nextTurnManager.endTurn();
        expect(response.data.gameState.phase).toBe('play');
        expect(response.data.gameState.turn).toBe(2);
        expect(response.data.gameState.activePlayerIndex).toBe(1);
    })

    test('should allocate reinforcements when ending turn during play phase', async () => {
        game.phase ='play';
        game.countries = assignCountries(game.players, game.countries);
        const response = await nextTurnManager.endTurn();
        expect(response.data.gameState.turnTracker.armiesEarned).toBe(3)

    })

    test('switches to first player when last player ends their turn', async () => {
        game.phase = 'play';
        game.activePlayerIndex = 3;
        game.turn = 4;
        const response = await nextTurnManager.endTurn();
        expect(response.data.gameState.phase).toBe('play');
        expect(response.data.gameState.turn).toBe(5);
        expect(response.data.gameState.activePlayerIndex).toBe(0);
    })

    test('Card is drawn and added to player and removed from cardsAvailable', async () => {
        game.phase = 'play';
        game.activePlayerIndex = 0;
        game.turn = 1;
        game.turnTracker.earnedCard = true;
        const response = await nextTurnManager.endTurn();
        expect(response.data.gameState.players[0].cards.length).toBe(1);
        expect(response.data.gameState.cardsAvailable.length).toBe(43);
    })

    test('No card is drawn if turnTracker.cardEarned is false', async () => {
        game.players[0].cards = [];
        game.phase = 'play';
        game.activePlayerIndex = 0;
        game.turn = 1;
        game.turnTracker.earnedCard = false;
        const response = await nextTurnManager.endTurn();
        expect(response.data.gameState.players[0].cards.length).toBe(0);
        expect(response.data.gameState.cardsAvailable.length).toBe(44);
    })
})