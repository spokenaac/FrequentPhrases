import Exporter from '../Exporter';
import {
    CandidateScorer,
    CandidateSelector,
    CandidatePreProcessor,
    CandidatePostProcessor
} from '../Candidates';
import { Config, FPNodeProps, ScoredCandidates } from '../fptypes';

/**
 * Generic Node for creating the word tree hierarchies.
 * Has methods for 
 */
class FPNode {
    config: Config;
    visits: number;
    nodeWord: string;
    childNodes: FPNode[];
    parentNodes: FPNode[];
    childBranches: number;

    constructor(word: string, config: Config) {
        this.config = config;
        this.visits = 0;
        this.nodeWord = word;
        this.childNodes = [];
        this.parentNodes = [];
        this.childBranches = this.childNodes.length;
    }

    /**
     * Add a new child node to the tree. Logic ensures no duplicate
     * FPNodes at a given hierarchy level are created.
     * Returns either a new FPNode, or the existing one that was found.
     * @param word
     * @returns {FPNode} FPNode
     */
    private addNewChildNode(word: string): FPNode {
        const child = this.getChildNode(word);

        // See if any duplicate child already exists
        if (child) {
            // Child exists, return it
            return child
        } else {
            // Child doesn't exist, make a new FPNode
            const newChild = new FPNode(word, this.config);

            // There already are children in this FPNode
            // add the new Node to the current Node's children
            // and the current Node to the child Node's parents
            this.childBranches = this.childNodes.push(newChild);
            newChild.parentNodes.push(this);
            return newChild;
        }
    }

    /**
     * Get a child node that already exists in the tree. If no such child
     * exists, returns false
     * @param word 
     * @returns {FPNode} FPNode
     */
    private getChildNode(word: string): FPNode | false {
        if (this.childNodes) {
            for (const child of this.childNodes) {
                // Return a duplicate child or False for no duplicates
                if (child.nodeWord === word) return child;
            }
        }
        return false;
    }

    /**
     * Process a a sentence into it's respective branches, modifying existing ones
     * as necessary.
     * @param body a sentence string.
     * @returns {FPNodeProps} FPNode properties
     */
    public generateTree(sentences: string[]): FPNodeProps {
        for (const sentence of sentences) {
            const words = sentence.split(' ');
    
            let curNode: FPNode = this;
    
            for (const word of words) {
                curNode = curNode.addNewChildNode(word)
                curNode.visits += 1
            }
        }

        const exporter = new Exporter(this);

        return exporter.exportObj();
    }

    /**
     * Returns Frequent Phrases from a node tree.
     * @param rootNode 
     * @param config 
     * @returns {Promise<ScoredCandidates[]>} Frequent Phrases
     */
    public async getFP(rootNode: FPNodeProps, config: Config): Promise<ScoredCandidates[]> {
        const preProcessedCandidates = new CandidatePreProcessor(rootNode, this.config.preProcessing).process();

        const selectedCandidates = new CandidateSelector(preProcessedCandidates, config).candidateSelection();

        const scoredCandidates = new CandidateScorer(selectedCandidates, config).candidateScoring();

        const postProcessedCandidates = new CandidatePostProcessor(scoredCandidates, this.config.postProcessing).process();

        // console.log('Preprocessed Candidates: \n', preProcessedCandidates);
        // console.log('Chosen Candidates: \n', selectedCandidates);
        // console.log('Scored Candidates: \n', scoredCandidates);
        // console.log('Post Processed Candidates: \n', postProcessedCandidates);
        return postProcessedCandidates;
    }
}

export default FPNode;
