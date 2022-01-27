import { Config } from "./fptypes";

const defaultConfig: Config = {
    maxPhraseLength: 6,
    selectionAlgorithm: 'dropOff',
    scoringAlgorithm: 'default',
    parserConfig: {
        chunkSentences: true,
        removeTypedSentences: true   
    },
    preProcessing: {
        trim: 3
    },
    postProcessing: {
        uniqueWordAtCutoffDepth: 1
    }
}

export default defaultConfig;
