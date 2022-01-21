/**
 * Excludes parent property to avoid recursive outputs (parent nodes are implied
 * via object structure).
 * 
 * @property {number} visits
 * @property {string} nodeWord
 * @property {number} childBranches
 * @property {FPNodeProps[]} childNodes
 * @property {FPNodeProps[]} parentNodes *Optional*
 */
export interface FPNodeProps {
    visits: number,
    nodeWord: string,
    childBranches: number
    childNodes: FPNodeProps[],
    parentNodes?: FPNodeProps[]
}

export interface ParseConfig {
    chunkSentences: boolean;
    removeTypedSentences: boolean;
}

export interface UnlinkedCandidates {
    w: string,
    v: number,
    c: number
}

export interface LinkedCandidates {
    w: string,
    v: number
}
