import { Game, Player, Card, TurnTracker, WsResponse } from "../../common/types/types";
import calculateReinforcements from "./calculateReinforcements";
import saveGame from "../saveGame";
import { TurnError } from "../../common/types/errors";

class NextTurnManager{
    private game: Game;

    constructor(game: Game){
        this.game = game;
    }

    isEndOfDeployPhase(): boolean {
        let totalPlayerArmies: number = 0;
    for (let i = 0; i < this.game.players.length; i++) {
        totalPlayerArmies += this.game.players[i].armies;
    }
    if (totalPlayerArmies === 0) {
        return true
    } else {
        return false
    }
    }

    calculateNextTurnTracker(): TurnTracker {
        if (this.game.phase === 'play') {
            const reinforcements: number = calculateReinforcements(this.game.activePlayerIndex, this.game.countries, this.game.continents);
            const turnTracker: TurnTracker = {
                phase: 'deploy',
                earnedCard: false,
                armiesEarned: reinforcements,
            }
            return turnTracker
        } 
        else if (this.game.phase === 'deploy') {
                const turnTracker: TurnTracker = {
                    phase: 'deploy',
                    earnedCard: false,
                    armiesEarned: 0,
                }
            return turnTracker
        }
    }

    drawCard(): Card {
        const selectedCard: Card = this.game.cardsAvailable[Math.floor(Math.random() * this.game.cardsAvailable.length)];
        return selectedCard
    }

    setNextPlayerTurn(): void {
        this.game.activePlayerIndex = (this.game.turn - 1) % this.game.players.length;
        this.game.turnTracker = this.calculateNextTurnTracker();
        this.game.players[this.game.activePlayerIndex].armies += this.game.turnTracker.armiesEarned;
    }

    async endTurn(): Promise<WsResponse> {
        this.game.turn += 1;
        if (this.game.phase === 'deploy') {
            if(this.isEndOfDeployPhase()) {
                this.game.phase = 'play';
                this.game.turn = 1;
            };
        } else if (this.game.phase === 'play') {
            if (this.game.turnTracker.earnedCard) {
                const card = this.drawCard()
                this.game.players[this.game.activePlayerIndex].cards.push(card);
                this.game.cardsAvailable.splice(this.game.cardsAvailable.indexOf(card), 1); 
            }
        }
        this.setNextPlayerTurn();
        try {
            this.game = await saveGame(this.game);
        } catch(error) {
            throw new TurnError({ message: `Unable to End turn. Error saving game: ${error.message}`}) 
        }
        const response: WsResponse = {
            data: {
                action: 'endTurn',
                message: `${this.game.players[this.game.activePlayerIndex].name} (Player ${this.game.activePlayerIndex}) has ended their turn`,
                status: "success",
                gameState: this.game
            }
        }
        return response
    }

}

export default NextTurnManager