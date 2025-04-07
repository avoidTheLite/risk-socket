import { Game, Player, Globe, Card, GameOptions, WsResponse } from '../common/types/types';
import ShortUniqueId = require('short-unique-id');
import { playerCountError } from '../common/types/errors';
import saveGame from './saveGame';
import loadGlobe from './loadGlobe';
import assignCountries from './services/assignCountries';
import assignArmies from './services/assignArmies';
import defaultCardSeed from '../common/util/test/defaultCardSeed';
import { WebSocket } from 'ws';
import { manager } from '../common/util/createWebSocketServer';

let uid = new ShortUniqueId({ length: 10 });

async function newGame(ws: WebSocket, players: Player[], globeID: string, gameOptions?: GameOptions, saveName?: string) {
    try {
        console.log(`loading game with globe ID ${globeID}`)
        let globe: Globe = await loadGlobe(globeID);
        let cards: Card[] = defaultCardSeed();
        if (players.length > globe.playerMax) {
            throw new playerCountError({
                message:`Globe supports up to ${globe.playerMax} players, but ${players.length} players were provided`
            })
        }
        let game: Game = {
            saveName: '',
            id: uid.rnd(),
            players: players,
            countries: globe.countries,
            continents: globe.continents,
            globeID: globe.id,
            turn: 1,
            turnTracker: {
                phase: 'deploy',
                earnedCard: false,
                armiesEarned: 0
            },
            phase: 'deploy',
            activePlayerIndex: 0,
            cardsAvailable: cards,
            matches: 0    
        }
        if (saveName) {
            game.saveName = saveName;
        } else {
            game.saveName = game.id + ' - autosave turn ' + game.turn;
        }
        game.countries = await assignCountries(players, globe.countries, gameOptions)
        game.players = await assignArmies(players, globe.countries)
        game = await saveGame(game) 
        manager.connectToGame(ws, game.saveName, game.players.map((player) => player.id))
        console.log(`New game created: ${game.id} with save name: ${game.saveName}`)

        const response: WsResponse= {
            data: {
                action: 'newGame',
                gameOptions: gameOptions,
                message: `New game created with save name: ${game.saveName} for ${players.length} players`,
                status: "success",
                gameState: game
            }
        }
        return response
    
    } catch (error) {
        throw error
    }

    
}

export default newGame