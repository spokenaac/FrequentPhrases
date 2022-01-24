import {
    Config,
    Candidates,
    FPNodeProps,
    ScoredCandidates,
    PreProcessConfig,
    PostProcessConfig,
    CandidatesSelectionResult
} from "../interfaces"

import {
    normalize
} from '../helpers';

/**
 * Scores
 */
class FPNodeScorer {
    /**
     * Pre process candidates to narrow or clarify the field of potential
     * candidates. Steps are decided by the default config or other
     * specified options.
     * 
     * Options are:
     * @param node 
     * @param steps 
     * @returns 
     */
    private preProcessCandidates(node: FPNodeProps, steps: PreProcessConfig): FPNodeProps[] {
        const candidates: FPNodeProps[] = [];

        const trim = steps.trim;

        node.childNodes.sort((a, b) => b.visits - a.visits);

        for (let i = 0; i < trim; i += 1) {
            candidates.push(node.childNodes[i]);
        }
        return candidates;
    }

    /**
     * Prepare candidates for output. Steps are:
     * @param scoredCandidates 
     * @param steps 
     */
    private postProcessCandidates(scoredCandidates: ScoredCandidates[], steps: PostProcessConfig): ScoredCandidates[] {
        const postProcessedCandidates: ScoredCandidates[] = [];
        // unfinished, would find commonalities in unique starting word phrases
        // if (steps.uniqueWordAtCutoffDepth === 'auto') {
        //     const uniqueStartingWords = new Set(scoredCandidates.map(i => i.phrase.split(' ')[0]));
            
        //     for (const word of uniqueStartingWords) {
        //         const matchedCandidates = scoredCandidates.filter(i => i.phrase.split(' ')[0] === word);
        //         console.log('wowowow: ', matchedCandidates);
        //     }
        // }

        if (steps.uniqueWordAtCutoffDepth === 1) {
            const uniqueStartingWords = new Set(scoredCandidates.map(i => i.phrase.split(' ')[0]));

            for (const word of uniqueStartingWords) {
                postProcessedCandidates.push(scoredCandidates.find(candidate => candidate.phrase.split(' ')[0] === word)!)
            }
        }

        return postProcessedCandidates;
    }

    /**
     * Parses selected candidates into a readily scorable format
     * @param candidates 
     * @returns 
     */
    private parseCandidates(candidates: Candidates[]): CandidatesSelectionResult[] {
        const result: CandidatesSelectionResult[] = [];

        let curCounter = 1;
        let phrase = '';
        let visits: number[] = [];
        let branches: number[] = [];

        // offload some code from the for loop w/ these helpers
        // push to result array
        const push = (idx: number): void => {
            const phraseCandidate: CandidatesSelectionResult = {
                phrase: phrase.trim(),
                visits: visits,
                childBranches: branches
            }
            result[idx] = phraseCandidate
        }

        // reset props
        const reset = (): void => {
            curCounter = 1;
            phrase = '';
            visits = [];
            branches = [];
        }

        // split arrays to account for running backwards in a phrase.
        // e.g. -->
        //      phrase1 = hello how are you
        //      phrase2 = hello how will you
        //                ^^^   ^^^
        //      We need to keep the first two words for the next phrase, remove the
        //      rest. So we slice back elements until we can continue the phrase loop
        const split = (counter: number, wordCounter: number): void => {
            phrase = phrase.split(' ').slice(0, -(counter - wordCounter + 1)).join(' ');
            visits = visits.slice(0, -(counter - wordCounter + 1));
            branches = branches.slice(0, -(counter - wordCounter + 1));
        }

        console.log(candidates);

        // TODO comment this mess, also rework to be cleaner
        for (const [idx, word] of candidates.entries()) {
            // if it's the first word in the phrase
            if (word.c === 1) {
                // if the phrase is only one word
                if (phrase.length > 0) {
                    push(idx);
                }

                // we're starting a new phrase, reset the props
                reset();
            }
            // else if the counter is larger than the word counter
            // means we have similar starter word between phrases and need
            // to remove some words from the tail end (see split() comments)
            else if (curCounter >= word.c) {
                push(idx);
                split(curCounter, word.c);
                curCounter -= word.c;
            }
            // no conditions met, +1 counter
            else {
                curCounter += 1;
            }

            idx >= 31 && console.log(word, curCounter);

            // Regardless of conditions above, append our arrays
            phrase += ` ${word.word}`;
            visits.push(word.visits);
            branches.push(word.branches);

            // Last loop, make sure we still push it
            if (idx === candidates.length - 1) {
                push(idx);
            }
        }
        return result;
    }

    /**
     * Simple drop off algorithm for getting frequent phrases. Traverses
     * the tree until the next child's visits score drops at or more than the given
     * threshold.
     * 
     * child visits / parent visits >= threshold
     * 
     * Scores phrases on visit deviations (less deviation = higher score)
     * @param tree node tree
     * @param threshold between 0 and 0.9
     */
    private dropOffCandidateSelection(node: FPNodeProps, threshold = 0.33, counter = 1): Candidates[] {
        // Recursively keep creating our Candidates array and populate with current node and children
        const props: Candidates[] = [];
        props.push({
            word: node.nodeWord,
            visits: node.visits,
            branches: node.childBranches,
            c: counter
        });

        // Recursive bit
        for (const child of node.childNodes) {
            if (child.visits / node.visits >= threshold) {
                if (counter === 6) break;
                props.push(...this.dropOffCandidateSelection(child, threshold, counter + 1));
            }
        }
        return props;
    }

    /**
     * DON'T USE test scoring algorithm
     * @param unscoredCandidates 
     * @returns 
     */
    private badScore(unscoredCandidates: CandidatesSelectionResult[]): ScoredCandidates[] {
        const scoredCandidates: ScoredCandidates[] = unscoredCandidates.map((candidate) => {
            const composite = candidate.visits.reduce((c,d) => c+d) + candidate.childBranches.reduce((c,d) => c+d);
            return {
                phrase: candidate.phrase,
                score: composite
            }
        })
        return scoredCandidates;
    }

    private defaultScore(unscoredCandidates: CandidatesSelectionResult[]): ScoredCandidates[] {
        const scoredCandidates: ScoredCandidates[] = unscoredCandidates.map((candidate) => { 
            const lengthWeight = candidate.phrase.length / 6;
            const visitsWeight = candidate.visits.reduce((a, b) => a + b) / 18;
            const branchesWeight = candidate.childBranches.reduce((a, b) => a + b) / 12;

            return {
                phrase: candidate.phrase,
                score: lengthWeight * visitsWeight * branchesWeight
            }
        })
        return scoredCandidates;
    }

    /**
     * Normalizes scores to a range between 0 and 1. Also
     * sorts candidates based on scores descending.
     * @param scoredCandidates 
     */
    private normalizeAndSortScores(scoredCandidates: ScoredCandidates[]): ScoredCandidates[] {
        // catch any undef values
        const filteredScoredCandidates = scoredCandidates.filter(i => i);

        // Normalize our scores
        const scores = scoredCandidates.map(i => i.score);
        const normalizedScores = normalize(scores);

        const unsorted = filteredScoredCandidates.map((candidate, idx) => {
            return {
                phrase: candidate.phrase,
                score: normalizedScores[idx]
            }
        })
        // Sort in descending order
        return unsorted.sort((a, b) => b.score - a.score);
    }

    /**
     * Select candidates for scoring
     * @param selectionAlgorithm 
     * @param rootNode 
     * @param config 
     * @returns 
     */
    private candidateSelection(preProcessedCandidates: FPNodeProps[], config: Config): CandidatesSelectionResult[] {
        // Instantiate our candidates array that will be fed to our scoring algorithms
        const unlinkedCandidates: Candidates[] = [];

        // drop off algorithm
        if (config.selectionAlgorithm === 'dropOff') {
            for (const child of preProcessedCandidates) {
                unlinkedCandidates.push(...this.dropOffCandidateSelection(child));
            }
        }

        // We've selected our candidates, parse and return them
        return this.parseCandidates(unlinkedCandidates);
    }

    private candidateScoring(unscoredCandidates: CandidatesSelectionResult[]): ScoredCandidates[] {
        // Scoring algorithm
        const scoredCandidates = this.defaultScore(unscoredCandidates);

        // Normalize scores and sort in descending order
        const result = this.normalizeAndSortScores(scoredCandidates);

        return result;
    }

    public getFrequentPhrases(rootNode: FPNodeProps, config: Config) {
        // Pre process our candidates based on the config
        const preProcessedCandidates: FPNodeProps[] = this.preProcessCandidates(rootNode, { trim: 12 });
        console.log('Preprocessed Candidates: \n', preProcessedCandidates);

        const selectedCandidates: CandidatesSelectionResult[] = this.candidateSelection(preProcessedCandidates, config);
        console.log('Chosen Candidates: \n', selectedCandidates);

        const scoredCandidates: ScoredCandidates[] = this.candidateScoring(selectedCandidates);
        console.log('Scored Candidates: \n', scoredCandidates);

        const postProcessedCandidates: ScoredCandidates[] = this.postProcessCandidates(scoredCandidates, {uniqueWordAtCutoffDepth: 1});
        console.log('Post Processed Candidates: \n', postProcessedCandidates);

        return postProcessedCandidates;
    }
}

export default FPNodeScorer;
