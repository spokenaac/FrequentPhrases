import { PostProcessConfig, ScoredCandidates } from "../fptypes";

class CandidatePostProcessor {
    scoredCandidates: ScoredCandidates[];
    config: PostProcessConfig;

    constructor(scoredCandidates: ScoredCandidates[], config: PostProcessConfig) {
        this.scoredCandidates = scoredCandidates;
        this.config = config;
    }

    /**
     * Prepare candidates for output. Steps are:
     * @param scoredCandidates 
     * @param steps 
     */
    public process(): ScoredCandidates[] {
        const postProcessedCandidates: ScoredCandidates[] = [];
        
        // unfinished, would find commonalities in unique starting word phrases
        // if (steps.uniqueWordAtCutoffDepth === 'auto') {
        //     const uniqueStartingWords = new Set(scoredCandidates.map(i => i.phrase.split(' ')[0]));
            
        //     for (const word of uniqueStartingWords) {
        //         const matchedCandidates = scoredCandidates.filter(i => i.phrase.split(' ')[0] === word);
        //         console.log('wowowow: ', matchedCandidates);
        //     }
        // }

        if (this.config.uniqueWordAtCutoffDepth === 1) {
            const uniqueStartingWords = new Set(this.scoredCandidates.map(i => i.phrase.split(' ')[0]));
            for (const word of uniqueStartingWords) {
                const foundWord = this.scoredCandidates.find(candidate => candidate.phrase.split(' ')[0] === word);
                
                if (foundWord) {
                    postProcessedCandidates.push(foundWord);
                }
            }
        }
        
        return postProcessedCandidates;
    }
}

export default CandidatePostProcessor;
