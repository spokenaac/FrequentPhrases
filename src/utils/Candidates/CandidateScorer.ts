import {
    ScoredCandidates,
    CandidatesSelectionResult,
    Config
} from "../fptypes"

import Parser from "../Parser";

class CandidateScorer {
    unscoredCandidates: CandidatesSelectionResult[]
    config: Config;
    parser: Parser;
    constructor(unscoredCandidates: CandidatesSelectionResult[], config: Config) {
        this.unscoredCandidates = unscoredCandidates
        this.config = config;
        this.parser = new Parser(this.config.parserConfig);
    }

    /**
     * DON'T USE test scoring algorithm
     * @param unscoredCandidates 
     * @returns {ScoredCandidates[]} Scored candidates
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

    /**
     * Default scoring algorithm. Weights phrase length, cumulative visits, and cumulative branches
     * @param unscoredCandidates 
     * @returns {ScoredCandidates[]} Scored candidates
     */
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
     * @returns {ScoredCandidates[]} Normalized and sorted scored candidates
     */
    private normalizeAndSortScores(scoredCandidates: ScoredCandidates[]): ScoredCandidates[] {
        // catch any undef values
        const filteredScoredCandidates = scoredCandidates.filter(i => i);

        // Normalize our scores
        const scores = scoredCandidates.map(i => i.score);
        const normalizedScores = this.parser.normalize(scores);

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
     * Score the candidates
     * @returns {ScoredCandidates[]} Scored candidates
     */
    public candidateScoring(): ScoredCandidates[] {
        // Scoring algorithm
        let scoredCandidates: ScoredCandidates[] = [];

        if (this.config.scoringAlgorithm === 'default') {
            scoredCandidates = this.defaultScore(this.unscoredCandidates);
        }

        // Normalize scores and sort in descending order
        const result = this.normalizeAndSortScores(scoredCandidates);

        return result;
    }
}

export default CandidateScorer;
