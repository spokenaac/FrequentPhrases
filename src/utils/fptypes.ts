export interface FPNodeProps {
    visits: number,
    nodeWord: string,
    childBranches: number,
    childNodes: FPNodeProps[],
    parentNodes?: FPNodeProps[]
}

export interface Config {
    maxPhraseLength: number,
    selectionAlgorithm: string,
    selectionConfig: SelectionConfig,
    scoringAlgorithm: string,
    parserConfig: ParserConfig,
    preProcessing: PreProcessConfig,
    postProcessing: PostProcessConfig
}

export interface SelectionConfig {
    dropOff: {
        threshold: number
    }
}

export interface ParserConfig {
    chunkSentences: boolean,
    removeTypedSentences: boolean
}

export interface PreProcessConfig {
    trim: number
}

export interface PostProcessConfig {
    uniqueWordAtCutoffDepth: string | number,
    removeSingleWordPhrases: boolean
}

export interface Candidate {
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

export interface FP {
    frequentPhrases: ScoredCandidates[],
    executionTime: string,
    ok: boolean,
    msg: string
}
