import {
    Config,
    Candidate,
    FPNodeProps,
    CandidatesSelectionResult,
    SelectionConfig
} from "../fptypes"
import Parser from "../Parser";

/**
 * Selects candidates using a specific candidate selection algorithm
 */
class CandidateSelector {
    preProcessedCandidates: FPNodeProps[];
    config: Config;
    algorithmConfig: SelectionConfig;

    constructor(preProcessedCandidates: FPNodeProps[], config: Config) {
        this.preProcessedCandidates = preProcessedCandidates;
        this.config = config;
        this.algorithmConfig = this.config.selectionConfig;
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
     * @returns {Candidate[]} An array of candidates
     */
    private dropOffCandidateSelection(node: FPNodeProps, counter = 1): Candidate[] {
        // Recursively keep creating our Candidates array and populate with current node and children
        const props: Candidate[] = [];
        props.push({
            word: node.nodeWord,
            visits: node.visits,
            branches: node.childBranches,
            c: counter
        });

        // Recursive bit
        for (const child of node.childNodes) {
            if (child.visits / node.visits >= this.algorithmConfig.dropOff.threshold) {
                if (counter === this.config.maxPhraseLength) break;
                props.push(...this.dropOffCandidateSelection(child, counter + 1));
            }
        }
        return props;
    }

    /**
     * Select candidates for scoring
     * @param selectionAlgorithm 
     * @param rootNode 
     * @param config 
     * @returns {CandidatesSelectionResult[]} Array of selected candidates
     */
    public candidateSelection(): CandidatesSelectionResult[] {
        // Instantiate our candidates array that will be fed to our scoring algorithms
        const unlinkedCandidates: Candidate[] = [];
        const parser = new Parser(this.config.parserConfig);

        // drop off algorithm
        if (this.config.selectionAlgorithm === 'dropOff') {
            for (const child of this.preProcessedCandidates) {
                unlinkedCandidates.push(...this.dropOffCandidateSelection(child));
            }
        }

        // We've selected our candidates, parse and return them
        return parser.parseCandidates(unlinkedCandidates);
    }
}

export default CandidateSelector;
