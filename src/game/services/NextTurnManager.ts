import { Game, Player, Card, TurnTracker, WsResponse } from "../../common/types/types";
import calculateReinforcements, { playerIsDefeated } from "./calculateReinforcements";
import saveGame from "../saveGame";
import { TurnError } from "../../common/types/errors";

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

    resetTurnTracker(): void {
        this.game.turnTracker = {
            phase: 'deploy',
            earnedCard: false,
            armiesEarned: 0,
        }
    }

    drawCard(): void {
        const selectedCard: Card = this.game.cardsAvailable[Math.floor(Math.random() * this.game.cardsAvailable.length)];
        this.game.players[this.game.activePlayerIndex].cards.push(selectedCard);
        this.game.cardsAvailable.splice(this.game.cardsAvailable.indexOf(selectedCard), 1); 
    }

    setNextTurn(): void {
        if(this.isEndOfDeployPhase()) {
            this.game.phase = 'play';
            this.game.turn = 1;
            this.game.activePlayerIndex = 0;
        } else {
            this.game.turn += 1;   
        }
    }

    setNextPlayerTurn(): void {
        this.game.activePlayerIndex = (this.game.turn - 1) % this.game.players.length;
        this.resetTurnTracker();
    }

    distributeReinforcements(): void {
        const reinforcements: number = calculateReinforcements(this.game.activePlayerIndex, this.game.countries, this.game.continents);
        this.game.players[this.game.activePlayerIndex].armies += reinforcements;
        this.game.turnTracker.armiesEarned = reinforcements;
    }

    async endTurn(): Promise<WsResponse> {
        if (this.game.turnTracker.earnedCard) this.drawCard()
        this.setNextTurn();
        this.setNextPlayerTurn();
        let skippedTurns = 0;
        while (playerIsDefeated(this.game.countries, this.game.players[this.game.activePlayerIndex].id)) {
            console.log(`Player ${this.game.activePlayerIndex} is defeated. Skipping their turn.`)
            this.setNextTurn();
            this.setNextPlayerTurn();
            skippedTurns += 1;
            if (skippedTurns >= this.game.players.length) {
                throw new TurnError({ message: `Unable to End turn. All players are defeated.`}) 
            }
        }
        if(this.game.phase === 'play') this.distributeReinforcements();
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