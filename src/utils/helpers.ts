export const removeTypedSentenceDuplicates = (sentences: string[]): string[] => {
    return sentences;
}

/**
 * Regex chunk a large string of sentences into an array of its sentences
 * @param body
 */
export const chunkSentences = (body: string): string[] => {
    // Regex to split body of text into it's respective sentences, including punctuation, quotes
    let sentences = body.replace(/(\.+|:|!|\?)("*|'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|");
 
    // Remove characters + whitespace
    sentences = sentences.map(x => x.replace(/["',.?!]/g, '').trim());

    return sentences;
}

export const normalize = (values: number[]): number[] => {
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