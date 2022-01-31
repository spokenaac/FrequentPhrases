# Frequent Phrases
Process large chunks of text into a node tree, which can then be traversed to grab phrases that match the given criteria.

To install:

```
npm install frequent-phrases
```

# Usage
The workflow is generally:

1. Construct FrequentPhrase instance
2. Define custom config (Optional)
3. Process text
4. Output frequent phrases

## Construct
```javascript
const FP = new FrequentPhrase();
```

## Custom Config
The default config object is as follows:
```javascript
const defaultConfig = {
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
        trim: 3
    },
    postProcessing: {
        uniqueWordAtCutoffDepth: 1
    }
}
```

Access the config property to modify this after instantiation, or construct a new config object and pass it in.
```javascript
const FP = new FrequentPhrase();

FP.config = newConfigObject;
// or
FP.config.maxPhraseLength = 8; // etc.
```

## Process Text And/Or Generate Phrases
The last bit can be separated out, or done altogether.

To just process text:
```javascript
const text = '
FP.process(text)
```