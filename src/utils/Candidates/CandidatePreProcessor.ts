import { FPNodeProps, PreProcessConfig } from "../fptypes";

class CandidatePreProcessor {
    node: FPNodeProps;
    config: PreProcessConfig;
    constructor(node: FPNodeProps, config: PreProcessConfig) {
        this.node = node;
        this.config = config;
    }
    /**
     * Pre process candidates to narrow or clarify the field of potential
     * candidates. Steps are decided by the default config or other
     * specified options.
     * 
     * Options are:
     * @param node 
     * @param config 
     * @returns {FPNodeProps[]} pre-processed candidates
     */
    public process(): FPNodeProps[] {
        const candidates: FPNodeProps[] = [];

        // Sort visits descending
        this.node.childNodes.sort((a, b) => b.visits - a.visits);

        // if trim is 0, don't trim anything
        const trim = this.config.trim === 0
            ? this.node.childNodes.length
            : this.config.trim

        // push only the top 'trim' children
        for (let i = 0; i < trim; i += 1) {
            candidates.push(this.node.childNodes[i]);
        }
        
        return candidates;
    }
}

export default CandidatePreProcessor;
