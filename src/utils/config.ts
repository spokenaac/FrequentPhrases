import { Config } from "./fptypes";

const defaultConfig: Config = {
    maxPhraseLength: 6,
    selectionAlgorithm: 'dropOff',
    selectionConfig: {
        dropOff: {
            threshold: 0.5
        }
    },
    scoringAlgorithm: 'default',
    parserConfig: {
        chunkSentences: true,
        removeTypedSentences: true   
    },
    preProcessing: {
        trim: 0
    },
    postProcessing: {
        uniqueWordAtCutoffDepth: 1
    }
}

export default defaultConfig;
