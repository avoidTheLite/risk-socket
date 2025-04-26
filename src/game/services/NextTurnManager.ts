import { Game, Player, Card, TurnTracker, WsResponse } from "../../common/types/types";
import calculateReinforcements from "./calculateReinforcements";
import saveGame from "../saveGame";
import { TurnError } from "../../common/types/errors";
import { playerIsDefeated } from "../commands/conquer";

class NextTurnManager{
    private game: Game;

    constructor(game: Game){
        this.game = game;
    }

    isEndOfDeployPhase(): boolean {
        if (this.game.phase === 'deploy') {
            let totalPlayerArmies: number = 0;
            for (let i = 0; i < this.game.players.length; i++) {
                totalPlayerArmies += this.game.players[i].armies;
            }
            if (totalPlayerArmies === 0) {
                return true
            }
        } 
        return false
        
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

    setNextTurn(): void {
        this.game.turn += 1;
    }

    setNextPlayerTurn(): void {
        this.game.activePlayerIndex = (this.game.turn - 1) % this.game.players.length;
        this.game.turnTracker = this.calculateNextTurnTracker();
        this.game.players[this.game.activePlayerIndex].armies += this.game.turnTracker.armiesEarned;
    }

    async endTurn(): Promise<WsResponse> {
        if(this.isEndOfDeployPhase()) {
            this.game.phase = 'play';
            this.game.turn = 1;
            this.game.activePlayerIndex = 0;
        } else {
            if (this.game.turnTracker.earnedCard) {
                const card = this.drawCard()
                this.game.players[this.game.activePlayerIndex].cards.push(card);
                this.game.cardsAvailable.splice(this.game.cardsAvailable.indexOf(card), 1); 
            }
            this.setNextTurn();
            this.setNextPlayerTurn();
            while (playerIsDefeated(this.game, this.game.players[this.game.activePlayerIndex].id)) {
                console.log(`Player ${this.game.activePlayerIndex} is defeated. Skipping their turn.`)
                this.setNextTurn();
                this.setNextPlayerTurn();
            }
        }
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