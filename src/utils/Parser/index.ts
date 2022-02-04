import { Candidate, CandidatesSelectionResult, ParserConfig } from "../fptypes";

class Parser {
    config: ParserConfig;
    s: string;

    constructor(config: ParserConfig) {
        this.config = config;
        this.s = '\u00a7';
    }

    /**
     * Compares two strings and returns a percentage match.
     * @param string The first string
     * @param substring the substring or second string to compare to the first
     */
    public stringCompare(string: string, substring: string): number {
        let counter = 0;

        for (let i = 0; i < substring.length; i += 1) {
            counter += substring[i] === string[i] ? 1 : 0
        }

        return counter / substring.length
    }

    /**
     * Catch typed sentences and return the longest, last true copy of a typed sentence
     * @param sentences
     * @returns {string[]} Unique sentences
     */
    public removeTypedSentenceDuplicates(sentences: string[]): string[] {
        const corpus: string[] = [];
        
        // remove \u00a7
        for (const sentence of sentences) {
            corpus.push(sentence.replace('\u00a7 ', ''))
        }

        // sort on string length descending
        corpus.sort((a, b) => b.length - a.length);

        // iterate through each sentence, then iterate through each letter
        // in that sentence. Check if the partial sentence exists in the corpus
        // and if it does, remove it
        for (const sentence of corpus) {
            let accum = '';

            for (const letter of sentence) {
                accum += letter;

                if (corpus.indexOf(accum) !== -1 && sentence.length !== accum.length) {
                    corpus.splice(corpus.indexOf(accum), 1);
                }
            }
        }

        // there are still typos, we need to remove them
        // no 'correctness' algorithm is implemented yet, so for now just
        // favor the longer string as 'correct' when comparing
        for (const sentence of corpus) {
            // make a copy of our corpus
            const newCorpus = [...corpus];

            // remove our current iteration from the new corpus so that we
            // can compare all the other entries against it
            newCorpus.splice(newCorpus.indexOf(sentence), 1);

            // make a unique set of all duplicates
            const dupes: string[] = [];
            dupes.push(sentence);
            
            // scan sentence-removed new corpus for duplicates
            for (const potentialDupe of newCorpus) {
                // compare string vs substring
                const ratio = this.stringCompare(sentence, potentialDupe);

                if (ratio >= 0.8) {
                    // we found a match, splice the match out and add to dupes set
                    dupes.push(newCorpus.splice(newCorpus.indexOf(potentialDupe), 1)[0]);
                }
            }

            // we now have a dupes set. If there's more than one entry (there's duplicates)
            // then remove them all from the original corpus except for the longest one
            //
            // ***TODO  add a 'correctness' algorithm to perform true fuzzy string matching,
            //          as it stands this is half of the fuzzy matching solution
            if (dupes.length > 1) {
                // get the longest string in the dupes array
                const longest = dupes.reduce((a, b) => a.length > b.length ? a : b);

                // remove it from the array
                dupes.splice(dupes.indexOf(longest), 1);

                for (const removable of dupes) {
                    // remove all the remaining duplicates from the corpus
                    corpus.splice(corpus.indexOf(removable), 1);
                }
            }

        }

        return corpus.sort();
    }
    
    /**
     * Regex chunk a large string of sentences into an array of its sentences
     * @param body
     * @returns {string[]} Array of sentences
     */
    public chunkSentences(body: string): string[] {
        // Regex to split body of text into it's respective sentences, including punctuation, quotes
        let sentences = body.replace(/(\.+|:|!|\?)("*|'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|");
     
        // Remove characters + whitespace
        sentences = sentences.map(x => x.replace(/["',.?!]/g, '').trim());
    
        return sentences;
    }
    
    /**
     * Normalize numerical score values to a range between 0 and 1
     * @param values 
     * @returns number[] Normalized (0 - 1) scores
     */
    public normalize(values: number[]): number[] {
        // Make sure we don't get any undef/nulls in our values:
        const scores = values.filter(i => i);
    
        // Normalize our scores
        const dividend = Math.max(...scores) - Math.min(...scores);
        const normalized = scores.map((score) => {
            return (score - Math.min(...scores)) / dividend
        });
    
        // Sort in descending order
        return normalized;
    }

    /**
     * Chunk string into sentences, removing unwanted
     * sentences from the pool and adding to local registry.
     * @param sentence 
     * @returns {string[]} Parsed text based on config
     */
    public parseSentences(body: string): string[] {
        let sentences: string[] = [];

        // chunk big string into it's sentences
        if (this.config.chunkSentences) {
            sentences = this.chunkSentences(body);
        }

        // remove typed sentences
        if (this.config.removeTypedSentences) {
            sentences = this.removeTypedSentenceDuplicates(sentences);
        }

        // other stuff?
        return sentences
    }

    /**
     * Parses selected candidates into a readily scorable format
     * @param candidates 
     * @returns {CandidatesSelectionResult[]} Candidates selected based on config
     */
    public parseCandidates(candidates: Candidate[]): CandidatesSelectionResult[] {
        const result: CandidatesSelectionResult[] = [];

        let curCounter = 1;
        let phrase = '';
        let visits: number[] = [];
        let branches: number[] = [];

        // offload some code from the for loop w/ these helpers
        // push to result array
        const push = (idx: number): void => {
            result[idx] = {
                phrase: phrase.trim(),
                visits: visits,
                childBranches: branches
            }
        }

        // reset props
        const reset = (): void => {
            curCounter = 1;
            phrase = '';
            visits = [];
            branches = [];
        }

        // split arrays to account for running backwards in a phrase.
        // e.g. -->
        //      phrase1 = hello how are you
        //      phrase2 = hello how will you
        //                ^^^   ^^^
        //      We need to keep the first two words for the next phrase, remove the
        //      rest. So we slice back elements until we can continue the phrase loop
        const split = (counter: number, wordCounter: number): void => {
            const slicer = -(counter - wordCounter + 1);

            phrase = phrase.split(' ').slice(0, slicer).join(' ');
            visits = visits.slice(0, slicer);
            branches = branches.slice(0, slicer);
        }

        for (const [idx, word] of candidates.entries()) {
            // if it's the first word in the phrase
            if (word.c === 1) {
                // if the phrase is only one word
                if (phrase.length > 0) {
                    // push phrase + data to results
                    push(idx);
                }
                // we're starting a new phrase, reset the props
                reset();
            }
            // else if the counter is larger than the word counter
            // means we have similar starter word between phrases and need
            // to remove some words from the tail end (see split() comments)
            else if (curCounter >= word.c) {
                // push phrase + data to results
                push(idx);

                // slice phrase array + data to continue on with next phrase
                split(curCounter, word.c);

                // update counter
                curCounter -= (curCounter - word.c);
            }
            else {
                // no conditions met, +1 counter
                curCounter += 1;
            }

            // Regardless of conditions above, push to our phrase/arrays
            phrase += ` ${word.word}`;
            visits.push(word.visits);
            branches.push(word.branches);

            // Last loop, make sure we still push it
            if (idx === candidates.length - 1) {
                // push phrase + data to results
                push(idx);
            }
        }
        return result;
    }
}

export default Parser;
