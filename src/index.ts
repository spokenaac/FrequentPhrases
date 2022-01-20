import FPNode from "./utils/FPNode/FPNode";
import { FPNodeProps, Format } from "./utils/interfaces";

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
    sentenceRegistry: string[];
    rootNode: FPNode;
    constructor(sentenceLimit = 500) {
        this.boo = false;
        this.sentenceRegistry = [];
        this.limit = sentenceLimit;
        this.rootNode = this.instantiateRootNode();
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
     * Cleans out the sentence registry and destroys the node tree
     */
    public clearData() {
        this.registry = [];
        this.root = new FPNode('ROOT');
    }

    /**
     * Process a string of sentences. Frequent phrases can only
     * be extracted from processed text.
     * @param body
     * @returns [registry, rootNode]
     */
    public async process(body: string): Promise<(string[] | FPNode)[]> {
        this.registry = this.rootNode.parseSentences(body);
        const root = this.root;

        root.tree(this.sentenceRegistry);

        return [this.sentenceRegistry, this.rootNode];
    }

    /**
     * Export current FPNode tree data in JSONifiable format.
     * Can be a JSON stringified string or an object.
     * @param format must be either 'string' or 'object'
     */
    public exportData(format: Format): FPNodeProps | string | Error {
        if (format == Format.Object) return this.rootNode.exportObj();
        if (format == Format.String) return this.rootNode.exportStr();
        return Error('Format param must be either "string" or "object"');
    }
}

export default FrequentPhrase;
