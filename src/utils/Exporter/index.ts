import FPNode from "../FPNode";
import { FPNodeProps } from "../fptypes";

class Exporter {
    node: FPNode;

    constructor(node: FPNode) {
        this.node = node;
    }

    /**
     * Recursively runs through all branches,
     * exporting data in an object (JSONifiable format).
     * @returns {FPNodeProps} Object format of Node tree
     */
    public exportObj(): FPNodeProps {
        return {
            'nodeWord': this.node.nodeWord,
            'visits': this.node.visits,
            'childNodes': this.recursiveNodeCrawl(this.node),
            'childBranches': this.node.childBranches
        }
    }

    /**
     * Recursively runs through all branches,
     * exporting data as a string (JSONifiable format).
     * @returns {string} JSON stringified format of Node tree
     */
    public exportStr(): string {
        return JSON.stringify({
            'nodeWord': this.node.nodeWord,
            'visits': this.node.visits,
            'childNodes': this.recursiveNodeCrawl(this.node),
            'childBranches': this.node.childBranches
        })
    }

    /**
     * Recursively crawls through the FPNode directory, starting at the top
     * ROOT node.
     * @param node
     * @returns {FPNodeProps[]} FPNode properties
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
     * Display hierarchy starting at the Root Node, spanning all branches to their endpoints.
     * --WARNING: may throw recursion errors if you have large amounts of data!
     * @param level
     */
    public logHierarchy(level = 1): void {
        level === 1 && console.log('***** ROOT LEVEL *****');

        for (const child of this.node.childNodes) {
            // console log nodes
            level === 1 && console.log(`***** START BRANCH: ${child.nodeWord} *****\n`);
            console.log('+' + '-'.repeat(level * 2 - 2), child.nodeWord, '( visits:', child.visits, ')');

            // Recursive function call for all children
            const childExporter = new Exporter(child);
            childExporter.logHierarchy(level + 1);
        }
    }
}

export default Exporter;
