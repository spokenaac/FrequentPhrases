# Frequent Phrases
[![CodeFactor](https://www.codefactor.io/repository/github/spokenaac/frequentphrases/badge)](https://www.codefactor.io/repository/github/spokenaac/frequentphrases)

Process large chunks of text into a node tree, which can then be traversed to grab phrases that match the given criteria.


To install:

```
npm install frequent-phrases
```

# Basic Usage
The workflow is generally:

1. Construct FrequentPhrase instance
2. Define custom config (Optional)
3. Process text
4. Output frequent phrases

## Construct
```javascript
const FP = new FrequentPhrase();
```

## Custom Config (more info [HERE](#config))
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
await FP.process(speech);

// then get Frequent Phrases
await FP.getFrequentPhrases().then((res) => console.log(res))
```

To do both, just pass text in to `getFrequentPhrases()`. Note that this method overwrites previous tree data, and is best served if you are instantiating a `new FrequentPhrase()` everytime.
```javascript
await FP.getFrequentPhrases(speech).then((res) => console.log(res));
```

Both methods will yield the same result:
```javascript
// ^^^^^ console.log(res);
{
    ok: true
    msg: ''
    frequentPhrases: [
        { phrase: "", score: 0 },
        { phrase: "", score: 0 },
        { phrase: "", score: 0 },
        ...
    ]
    executionTime: '3.544ms'
}
```
## [***For More](#more)

# Modifying the Library
To help understanding of best ways to modify for a specific use-case, the library works as follows:
1. Input corpus
2. Pre-process potential candidates
3. Select Candidates
4. Score selected Candidates
5. Post-process candidates
6. Output

# Config
## Pre-Processing
* trim - Trims candidate pool to only originate from the top `trim` starter words. Trim defaults to `0`, or no trim.

## Candidate Selection
* Selection Algorithm - Algorithm to use for selection algorithm. Default is a simple dropoff, which cuts off phrases based on their relative visits between child / parent.
* Selection Config - Stores constants to modify how selection algorithms perform. See [here]().

## Candidate Scoring:
Defines what scoring algorithm is used. Default algo is based solely on averaged visits, meaning a higher visit average yields higher scores.

## Post-Processing
* uniqueWordAtCutoffDepth - Trims scored candidates so that the highest-scored phrase from each starter word is represented.

## Parser Config
* chunkSentences - convert a string into an array of it's contained sentences
* removeTypedSentences - find the unique, longest sentence amongst a gamut of typed copies of the same sentence.
  * e.g.: We are only interested in the sentence 'How are you?' but we have:
    * 'H'
    * 'Ho'
    * 'How'
    * ...
    * 'How are you?'

# Main Class

## FrequentPhrase
Used to parse large swathes of sentence data and output
a word tree using a recursive node algorithm.

This tree can be used to generate a number of phrases that appear
frequently throughout the given data, modified by optionally provided params.

Public methods:

* [.getFrequentPhrases(body)](#FrequentPhrase+getFrequentPhrases)
* [.process(body)](#FrequentPhrase+process)
* [.reset()](#FrequentPhrase+reset)

---

### FrequentPhrase.getFrequentPhrases(body)
Return Frequent Phrases from data already processed.

**Returns**: <code>Promise.&lt;FP&gt;</code> - Frequent phrases present in the text  

| Param | Description |
| --- | --- |
| body | OPTIONAL - string of text, if passed it will be processed and then phrases will be extracted. If not passed, phrases will be extracted from existing data. |

---

### frequentPhrase.process(body)
Process a string of sentences. Frequent phrases can only
be extracted from processed text.

**Returns**: `Promise<string[] | FPNode[]>` - [registry, rootNode]  

| Param | Description |
| --- | --- |
| body | string of text, if passed it will be processed and then phrases will be extracted. If not passed, phrases will be extracted from existing data. |

---

### frequentPhrase.reset()
Cleans out the sentence registry and destroys the node tree

**Kind**: instance method of [<code>FrequentPhrase</code>](#FrequentPhrase)  
**Returns**: <code>Promise.&lt;(Array.&lt;string&gt;\|Array.&lt;FPNode&gt;)&gt;</code> - [registry, FPNode]
