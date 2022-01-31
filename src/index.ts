import FPNode from "./utils/FPNode";
import Parser from "./utils/Parser";
import defaultConfig from "./utils/config";
import { Config, FP, ScoredCandidates } from "./utils/fptypes";

/**
 * Used to parse large swathes of sentence data and output
 * a word tree using a recursive node algorithm.
 * 
 * This tree can be used to generate a number of phrases that appear
 * frequently throughout the given data, modified by optionally provided params.
 */
class FrequentPhrase {
    existingData: boolean;
    limit: number;
    config: Config;
    parser: Parser;
    rootNode: FPNode;
    sentenceRegistry: string[];

    constructor(sentenceLimit = 500, config = defaultConfig) {
        this.existingData = false;
        this.limit = sentenceLimit;
        this.config = config
        this.parser = new Parser(this.config.parserConfig);
        this.rootNode = this.instantiateRootNode();
        this.sentenceRegistry = [];
    }

    /**
     * Instantiate root node either from existing data or from scratch
     * @returns {FPNode} An FPNode form existing data, or a new node.
     */
    private instantiateRootNode(): FPNode {
        if (this.existingData) {
            // some storage stuff when we figure it out, check for existing data
            return new FPNode('ignore this, check for storage', this.config);
        } else {
            return new FPNode('ROOT', this.config);
        }
    }

    /**
     * Return Frequent Phrases from data already processed.
     * @param body OPTIONAL - string of text, if passed it will be processed and then phrases will be extracted. If not passed, phrases will be extracted from existing data.
     * @returns {Promise<FP>} Frequent phrases present in the text
     */
    public async getFrequentPhrases(body?: string): Promise<FP> {
        // Performance monitoring
        const start = performance.now();

        // If we received text, process it first
        if (body) {
            await this.process(body);
        }

        // Get our frequent phrases
        let phrases: ScoredCandidates[] = [];

        await this.rootNode.getFP(this.rootNode, this.config).then((results) => {
            phrases = results;
        });

        return {
            frequentPhrases: phrases,
            executionTime: `${(performance.now() - start).toFixed(3)}ms`,
            ok: true,
            msg: ''
        };
    }

    /**
     * Process a string of sentences. Frequent phrases can only
     * be extracted from processed text.
     * @param body
     * @returns {Promise<string[] | FPNode[]>} [registry, rootNode]
     */
    public async process(body: string): Promise<(string[] | FPNode)[]> {
        // parse giant string into sentences
        this.sentenceRegistry = this.parser.parseSentences(body);

        // generate FPNode tree
        this.rootNode.generateTree(this.sentenceRegistry);

        return [this.sentenceRegistry, this.rootNode];
    }

    /**
     * Cleans out the sentence registry and destroys the node tree
     * @returns {Promise<string[] | FPNode[]>} [registry, FPNode]
     */
    public async reset(): Promise<(string[] | FPNode)[]> {
        this.sentenceRegistry = [];
        this.rootNode = new FPNode('ROOT', this.config);

        return [this.sentenceRegistry, this.rootNode];
    }
}

export {
    FrequentPhrase,
    Parser
};
