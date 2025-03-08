import { Game, Card } from "../../common/types/types";
import { cardMatchError } from "../../common/types/errors";
import { matchValue } from "../../common/util/test/defaultCardSeed";
import saveGame from "../saveGame";

export default async function cardMatch(game: Game, cards: Card[]) {
    if (cards.length < 3) {
        throw new cardMatchError({ message: 'Not enough cards to match' })
    }
    for (let i = 0; i < 3; i++) {
        if (!game.players[game.activePlayerIndex].cards.includes(cards[i])) {
            throw new cardMatchError({ message: 'Card not owned by player' })
        }
    }
    const wildCount: number = cards.filter(card => card.symbol === 'wildcard').length;
    
    // A valid match is 3 cards of the same symbol OR one card of each symbol
    if (wildCount == 0) {
        if (cards[0].symbol !== cards[1].symbol) {
            if (cards[0].symbol == cards[2].symbol) {
                throw new cardMatchError({ message: `Only 2 cards match. You have: ${cards[0].symbol}, ${cards[1].symbol}, ${cards[2].symbol}` })
            } else if (cards[1].symbol == cards[2].symbol) {
                throw new cardMatchError({ message: `Only 2 cards match. You have: ${cards[0].symbol}, ${cards[1].symbol}, ${cards[2].symbol}` })
            }
        } else if (cards[1].symbol !== cards[2].symbol) {
            throw new cardMatchError({ message: `Only 2 cards match. You have: ${cards[0].symbol}, ${cards[1].symbol}, ${cards[2].symbol}` })
        }
    }
    const armiesEarned = matchValue[game.matches + 1]
    game.players[game.activePlayerIndex].armies += armiesEarned
    game.turnTracker.armiesEarned += armiesEarned
    game.matches += 1
    game = await saveGame(game)
    const response = {
        data: {
            action: 'cardMatch',
            message: `You gain # armies from your match: ${cards[0].name}, ${cards[1].name}, ${cards[2].name}`,
            status: 'success',
            cards: cards
        }
    }
    return response
}