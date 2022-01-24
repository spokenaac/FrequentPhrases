/**
 * Excludes parent property to avoid recursive outputs (parent nodes are implied
 * via object structure).
 */
export interface FPNodeProps {
    visits: number,
    nodeWord: string,
    childBranches: number
    childNodes: FPNodeProps[],
    parentNodes?: FPNodeProps[]
}

export interface Config {
    selectionAlgorithm: string;
    scoringAlgorithm: string;
    maxPhraseLength: number;
    preProcessingSteps: PreProcessConfig
}

export interface PreProcessConfig {
    trim: number
}

export interface PostProcessConfig {
    uniqueWordAtCutoffDepth: string | number
}

export interface ParserConfig {
    chunkSentences: boolean;
    removeTypedSentences: boolean;
}

export interface Candidates {
    c: number,
    word: string,
    visits: number,
    branches: number
}

export interface CandidatesSelectionResult {
    phrase: string,
    visits: number[],
    childBranches: number[]
}

export interface ScoredCandidates {
    phrase: string,
    score: number
}
