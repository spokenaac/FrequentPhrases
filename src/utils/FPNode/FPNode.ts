import { FPNodeProps } from '../interfaces';
import { removeTypedSentenceDuplicates, chunkSentences } from '../helpers';

/**
 * Generic Node for creating the word tree hierarchies.
 * Has methods for 
 */
class FPNode {
    visits: number;
    nodeWord: string;
    childNodes: FPNode[];
    parentNodes: FPNode[];
    childBranches: number;
    constructor(word: string) {
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
     */
    private addNewChildNode(word: string): FPNode {
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
            this.childBranches = this.childNodes.push(newChild);
            newChild.parentNodes.push(this);
            return newChild;
        }
    }

    /**
     * Get a child node that already exists in the tree. If no such child
     * exists, returns false
     * @param word 
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
     * Returns all properties of the node.
     * @param node FPNode
     * @param withParents *boolean* with or without parents
     */
    private getAllProps(node: FPNode, withParents: boolean): FPNodeProps {
        const curNode = node || this;

        const props: FPNodeProps = {
            visits: curNode.visits,
            nodeWord: curNode.nodeWord,
            childBranches: curNode.childBranches,
            parentNodes: curNode.parentNodes.filter((parent) => parent.nodeWord),
            childNodes: curNode.childNodes.filter((child) => `${child.nodeWord} + ${child.visits}`),
        }

        const { parentNodes, ...propsWithoutParents }: FPNodeProps = props

        return withParents ? props : propsWithoutParents;
    }

    /**
     * Recursively crawls through the FPNode directory, starting at the top
     * ROOT node.
     * @param node
     */
    private recursiveNodeCrawl(node: FPNode): FPNodeProps[] {
        const props: FPNodeProps[] = [];

        for (const child of node.childNodes) {
            props.push({
                'nodeWord': child.nodeWord,
                'visits': child.visits,
                'childNodes': this.recursiveNodeCrawl(child),
                'childBranches': child.childBranches
            })
        }

        return props;
    }

    /**
     * Recursively runs through all branches,
     * exporting data in an object (JSONifiable format).
     */
    public exportObj(): FPNodeProps {
        const result: FPNodeProps = {
            'nodeWord': this.nodeWord,
            'visits': this.visits,
            'childNodes': this.recursiveNodeCrawl(this),
            'childBranches': this.childBranches
        }

        return result
    }

    /**
     * Recursively runs through all branches,
     * exporting data as a string (JSONifiable format).
     */
    public exportStr(): string {
        return JSON.stringify({
            'nodeWord': this.nodeWord,
            'visits': this.visits,
            'childNodes': this.recursiveNodeCrawl(this),
            'childBranches': this.childBranches
        })
    }

    /**
     * Chunk string into sentences, removing unwanted
     * sentences from the pool and adding to local registry.
     * @param sentence 
     */
    public parseSentences(body: string): string[] {
        let sentences;

        // chunk big string into it's sentences
        sentences = chunkSentences(body);

        // remove typed sentences
        sentences = removeTypedSentenceDuplicates(sentences);

        // other stuff?
        return sentences
    }

    /**
     * Process a a sentence into it's respective branches, modifying existing ones
     * as necessary.
     * @param body a sentence string.
     */
    public tree(sentences: string[]): void {
        for (const sentence of sentences) {
            const words = sentence.split(' ');
    
            let curNode: FPNode = this;
    
            for (const word of words) {
                curNode = curNode.addNewChildNode(word)
                curNode.visits += 1
            }
        }
    }

    /**
     * Display hierarchy starting with a Node of param word, at a given level.
     * Default level is ROOT level.
     * @param word 
     * @param level 
     */
    public getNode(word: string, /* level = 0 */): void {
        for (const child of this.childNodes) {
            child.nodeWord === word && child.getAllProps(child, false);
        }
    }

    /**
     * Display hierarchy starting at the Root Node, spanning all branches to their endpoints.
     * --WARNING: may throw recursion errors if you have large amounts of data!
     * @param level 
     */
    public logHierarchy(level = 1): void {
        level === 1 && console.log('***** ROOT LEVEL *****');

        for (const child of this.childNodes) {
            // console log nodes
            level === 1 && console.log(`***** START BRANCH: ${child.nodeWord} *****\n`);
            console.log('+' + '-'.repeat(level * 2 - 2), child.nodeWord, '( visits:', child.visits, ')');

            // Recursive function call for all children
            child.logHierarchy(level + 1);
        }
    }
}

export default FPNode;
