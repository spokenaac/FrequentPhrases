import { PostProcessConfig, ScoredCandidates } from "../fptypes";

class CandidatePostProcessor {
    scoredCandidates: ScoredCandidates[];
    config: PostProcessConfig;

    constructor(scoredCandidates: ScoredCandidates[], config: PostProcessConfig) {
        this.scoredCandidates = scoredCandidates;
        this.config = config;
    }

    private removeSingleWordPhrases(candidates: ScoredCandidates[]): ScoredCandidates[] {
        const filtered: ScoredCandidates[] = [];

        candidates.forEach((candidate) => {
            if (candidate.phrase.split(' ').length > 1) {
                filtered.push(candidate);
            }
        })
    
        return filtered
    }

    /**
     * Prepare candidates for output. Steps are:
     * @param scoredCandidates 
     * @param steps 
     */
    public process(): ScoredCandidates[] {
        let postProcessedCandidates: ScoredCandidates[] = [];
        
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

        if (this.config.removeSingleWordPhrases) {
            postProcessedCandidates = this.removeSingleWordPhrases(postProcessedCandidates);
        }
        
        return postProcessedCandidates;
    }
}

export default CandidatePostProcessor;
