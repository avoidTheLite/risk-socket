import { TurnTracker, Phase, Country, Continent } from '../../common/types/types';
import calculateReinforcements from './calculateReinforcements';


export default function updateTurnTracker(gamePhase: Phase, activePlayerIndex: number,  countries: Country[], continents: Continent[]): TurnTracker {
    if (gamePhase === 'play') {
        const reinforcements: number = calculateReinforcements(activePlayerIndex, countries, continents);
        const turnTracker: TurnTracker = {
            phase: 'deploy',
            earnedCard: false,
            armiesEarned: reinforcements,
        }
        return turnTracker
    } 
    else if (gamePhase === 'deploy') {
            const turnTracker: TurnTracker = {
                phase: 'deploy',
                earnedCard: false,
                armiesEarned: 0,
            }
        return turnTracker
        }
    
    
}