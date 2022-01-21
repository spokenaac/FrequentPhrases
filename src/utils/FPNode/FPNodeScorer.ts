import { UnlinkedCandidates, FPNodeProps } from "../interfaces"

class FPNodeScorer {
    /**
     * Simple drop off algorithm for getting frequent phrases. Traverses
     * the tree until the 'visits' score drops at or more than the given
     * threshold.
     * 
     * Scores phrases on visit deviations (less deviation = higher score)
     * @param tree node tree
     * @param threshold between 0 and 0.9
     */
     private simpleDropOffCandidateSelection(node: FPNodeProps, threshold = 0, counter = 1): UnlinkedCandidates[] {
        const props: UnlinkedCandidates[] = [];
        props.push({ w: node.nodeWord, v: node.visits, c: counter });

        for (const child of node.childNodes) {
            if (child.visits / node.visits > threshold) {
                props.push(...this.simpleDropOffCandidateSelection(child, threshold, counter + 1))
            }
        }
        return props;
    }

    /**
     * Extracts whole phrases with relevant data for final scores.
     * @param tree 
     * @param candidates 
     * @returns 
     */
    private extractWholePhrases(candidates: UnlinkedCandidates[]): string[] {
        const linkedPhrases: string[] = [];
        let phrase = '';
        let curCounter = 1;

        for (const [idx, word] of candidates.entries()) {
            if (word.c === 1) {
                phrase.length > 0 && linkedPhrases.push(phrase);
                phrase = '';
                curCounter = 1;
            } else if (curCounter > word.c) {
                linkedPhrases.push(phrase);
                phrase = phrase.split(' ').slice(0, -2).join(' ');
                curCounter -= 1;
            } else if (curCounter == word.c) {
                linkedPhrases.push(phrase);
                phrase = phrase.split(' ').slice(0, -1).join(' ');
            } else {
                curCounter += 1;
            }

            phrase += ` ${word.w}`;

            if (idx === candidates.length - 1) {
                linkedPhrases.push(phrase);
            }
        }

        return linkedPhrases.map((i) => i.trim());
    }

    /**
     * Select candidates for scoring
     * @param selectionAlgorithm 
     * @param rootNode 
     * @param config 
     * @returns 
     */
    public async candidateSelection(selectionAlgorithm: string, rootNode: FPNodeProps, config: string): Promise<string[]> {
        const unlinkedCandidates: UnlinkedCandidates[] = [];

        if (selectionAlgorithm === 'simpleDropOff') {
            for (const child of rootNode.childNodes) {
                unlinkedCandidates.push(...this.simpleDropOffCandidateSelection(child));
            }
        }

        // other candidate selection algorithms

        const linkedCandidates = this.extractWholePhrases(unlinkedCandidates);

        return linkedCandidates;
    }
}

export default FPNodeScorer;
