# Frequent Phrases
[![CodeFactor](https://www.codefactor.io/repository/github/spokenaac/frequentphrases/badge)](https://www.codefactor.io/repository/github/spokenaac/frequentphrases)

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

## Custom Config (more info here)
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

```javascript
const speech = 'Five score years ago, a great American, in whose symbolic shadow' // ... MLK's I Have A Dream speech
```

To process text and then extract phrases:
```javascript
FP.process(speech);

// then get Frequent Phrases
await FP.getFrequentPhrases().then((res) => console.log(res))
```

To do both, just pass text in to `getFrequentPhrases()`. Note that this method overwrites previous tree data, and is best served if you are instantiating a `new FrequentPhrase()` everytime.
```javascript
await FP.getFrequentPhrases(speech).then((res) => console.log(res));
```

Both methods will yield the same result:
```typescript
// ^^^^^ console.log(res);
{
    ok: boolean
    msg: string
    frequentPhrases: ScoredCandidates[]
    executionTime: string
}
```

# Config
