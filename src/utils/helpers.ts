export const removeTypedSentenceDuplicates = (sentences: string[]): string[] => {
    return sentences;
}

/**
 * Regex chunk a large string of sentences into an array of its sentences
 * @param body
 */
export const chunkSentences = (body: string): string[] => {
    // Regex to split body of text into it's respective sentences, including punctuation, quotes
    const sentences = body.replace(/(\.+|:|!|\?)("*|'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|");
 
    // Remove characters + whitespace.
    return sentences.map(x => x.replace(/["',.?!]/g, '').trim());
}