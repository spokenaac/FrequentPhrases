import FPNode from "./utils/FPNode";

class FrequentPhrase {
    registry?: { tree: string[] }
    rootNode: FPNode
    constructor() {
        this.registry = undefined;
        this.rootNode = this.instantiateRootNode();
    }

    instantiateRootNode(): FPNode {
        if (false) {
            // some storage stuff, check for existing data
        } else {
            // We don't have any node data yet, instantiate
            return new FPNode('ROOT');
        }
    }

    process(body: string): void {
        // Regex to split body of text into it's respective sentences, including punctuation, quotes
        let sentences = body.replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|");

        // Remove " and ' from text
        // Don't return any sentences that are None, blank strings. Also remove whitespace.
        sentences = sentences.map(x => x.replace(/["',.?!]/g, '').trim());

        for (const sentence of sentences) {
            this.rootNode.tree(sentence);
        }
    }
}

export default FrequentPhrase;
