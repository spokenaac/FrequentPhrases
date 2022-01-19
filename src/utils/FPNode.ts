class FPNode {
    nodeWord: string
    childNodes: FPNode[];
    parentNodes: FPNode[];
    visits: number;
    constructor(word: string) {
        this.visits = 0
        this.nodeWord = word
        this.childNodes = []
        this.parentNodes = []
    }

    /**
     * Add a new child node to the tree. Logic ensures no duplicate
     * FPNodes at a given hierarchy level are created.
     * Returns either a new FPNode, or the existing one that was found.
     * @param word
     */
    addNewChildNode(word: string): FPNode {
        const child = this.getChildNode(word);

        // See if any duplicate child already exists
        if (child) {
            // Child exists, return it
            return child
        } else {
            // Child doesn't exist, make a new FPNode
            const newChild = new FPNode(word);

            // There already are children in this FPNode
            // add the new Node to the current Node's children
            // and the current Node to the child Node's parents
            this.childNodes.push(newChild);
            newChild.parentNodes.push(this);
            return newChild;
        }
    }

    /**
     * Get a child node that already exists in the tree. If no such child
     * exists, returns false
     * @param word 
     */
    getChildNode(word: string): FPNode | false {
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
     */
    tree(sentence: string): void {
        const words = sentence.split(' ');

        let curNode: FPNode = this;

        for (const word of words) {
            curNode = curNode.addNewChildNode(word)
            curNode.visits += 1
        }
    }

    /**
     * Display hierarchy starting at the Root Node, spanning all branches to their endpoints.
     * --WARNING: may throw recursion errors if you have large amounts of data!
     * @param level 
     */
    getHierarchy(level = 1): void {
        level === 1 && console.log('***** ROOT LEVEL *****');

        const a = '+'
        const b = '-'

        // const curNode: FPNode = this;

        for (const child of this.childNodes) {
            // Special print for second-layer nodes
            level === 1 && console.log(`***** START BRANCH: ${child.nodeWord} *****\n`);

            // Display hierarchy
            console.log(a + b.repeat(level * 2), child.nodeWord, '( visits:', child.visits, ')');

            // Recursive function call for all children
            child.getHierarchy(level + 1);
        }
    }

    /**
     * Display hierarchy starting with a Node of param word, at a given level.
     * Default level is ROOT level.
     * @param word 
     * @param level 
     */
    getSpecificNode(word: string, /* level = 0 */): void {
        for (const child of this.childNodes) {
            child.nodeWord === word && child.getAllProps()
        }
    }

    /**
     * Prints all properties of the node.
     */
    getAllProps(): void {
        console.log('\nword: ', this.nodeWord);
        console.log('parents: ', this.parentNodes.filter((parent) => parent.nodeWord));
        console.log('children: ', this.childNodes.filter((child) => `${child.nodeWord} + ${child.visits}`));
        console.log('visits: ', this.visits);
    }
}

export default FPNode;
