import FPNode from "./utils/FPNode";
import { FPNodeProps, Format } from "./utils/interfaces";

/**
 * Used to parse large swathes of sentence data and output
 * a word tree using a recursive node algorithm.
 * 
 * This tree can be used to generate a number of phrases that appear
 * frequently throughout the given data, modified by optionally provided params.
 */
class FrequentPhrase {
    registry?: boolean
    rootNode: FPNode
    constructor() {
        this.registry = false;
        this.rootNode = this.instantiateRootNode();
    }

    /**
     * Instantiate root node either from existing data or from scratch
     */
    private instantiateRootNode(): FPNode {
        if (this.registry) {
            // some storage stuff, check for existing data
            return new FPNode('ignore this, check for storage');
        } else {
        return new FPNode('ROOT');
        }
    }

    /**
     * Process a string of sentences. Frequent phrases can only
     * be extracted from processed text.
     * @param body 
     */
    public async process(body: string): Promise<void> {
        // Regex to split body of text into it's respective sentences, including punctuation, quotes
        let sentences = body.replace(/(\.+|:|!|\?)("*|'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|");

        // Remove " and ' from text
        // Don't return any sentences that are None, blank strings. Also remove whitespace.
        sentences = sentences.map(x => x.replace(/["',.?!]/g, '').trim());

        for (const sentence of sentences) {
            this.rootNode.tree(sentence);
            this.rootNode;
        }

        return
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
