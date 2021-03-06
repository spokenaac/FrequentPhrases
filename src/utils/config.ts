import { Config } from "./fptypes";

const defaultConfig: Config = {
    maxPhraseLength: 6,
    selectionAlgorithm: 'dropOff',
    selectionConfig: {
        dropOff: {
            threshold: 0.8
        }
    },
    scoringAlgorithm: 'default',
    parserConfig: {
        chunkSentences: true,
        removeTypedSentences: false   
    },
    preProcessing: {
        trim: 0
    },
    postProcessing: {
        uniqueWordAtCutoffDepth: 1,
        removeSingleWordPhrases: true,
    }
}

export default defaultConfig;
