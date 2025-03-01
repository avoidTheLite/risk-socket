import { Turn, Phase, Country, Continent } from '../../common/types/types';
import calculateReinforcements from './calculateReinforcements';


export default function nextTurn(gamePhase: Phase, activePlayerIndex: number,  countries: Country[], continents: Continent[]): Turn {
    if (gamePhase === 'play') {
        const reinforcements: number = calculateReinforcements(activePlayerIndex, countries, continents);
        const turn: Turn = {
            phase: 'deploy',
            earnedCard: false,
            armiesEarned: reinforcements,
        }
        return turn
    } 
    else if (gamePhase === 'deploy') {
            const turn: Turn = {
                phase: 'deploy',
                earnedCard: false,
                armiesEarned: 0,
            }
        return turn
        }
    
    
}