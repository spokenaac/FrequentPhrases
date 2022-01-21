import FPNode from "./utils/FPNode/FPNode";
import { FPNodeProps } from "./utils/interfaces";

/**
 * Used to parse large swathes of sentence data and output
 * a word tree using a recursive node algorithm.
 * 
 * This tree can be used to generate a number of phrases that appear
 * frequently throughout the given data, modified by optionally provided params.
 */
class FrequentPhrase {
    boo: boolean;
    limit: number;
    rootNode: FPNode;
    sentenceRegistry: string[];
    constructor(sentenceLimit = 500) {
        this.boo = false;
        this.limit = sentenceLimit;
        this.rootNode = this.instantiateRootNode();
        this.sentenceRegistry = [];
    }

    get registry() {
        return this.sentenceRegistry;
    }

    set registry(val: string[]) {
        this.sentenceRegistry.push(...val);
    }

    get root() {
        return this.rootNode;
    }

    set root(val: FPNode) {
        this.rootNode = val;
    }

    /**
     * Instantiate root node either from existing data or from scratch
     */
    private instantiateRootNode(): FPNode {
        if (this.boo) {
            // some storage stuff, check for existing data
            return new FPNode('ignore this, check for storage');
        } else {
        return new FPNode('ROOT');
        }
    }

    public async scoreTree(): Promise<void> {
        await this.exportObj().then((res) => {
            this.root.candidateSelection('simpleDropOff', this.root, '').then((candidates) => {
                console.log(candidates);
            })
        })
    }

    /**
     * Process a string of sentences. Frequent phrases can only
     * be extracted from processed text.
     * @param body
     * @returns [registry, rootNode]
     */
    public async process(body: string): Promise<(string[] | FPNode)[]> {
        this.registry = this.root.parseSentences(body);
        this.root.tree(this.registry);

        return [this.registry, this.root];
    }

    /**
     * Export current FPNode tree data in JSONifiable format (object).
     */
    public async exportObj(): Promise<FPNodeProps> {
        return this.root.exportObj();
    }

    /**
     * Export current FPNode tree data in JSONifiable format (string).
     */
    public async exportStr(): Promise<string> {
        return this.root.exportStr();
    }

    /**
     * Cleans out the sentence registry and destroys the node tree
     */
    public async clearData(): Promise<(string[] | FPNode)[]> {
        this.registry = [];
        this.root = new FPNode('ROOT');

        return [this.registry, this.root];
    }
}

export default FrequentPhrase;
