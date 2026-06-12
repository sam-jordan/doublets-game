export function emptyGuesses(guesses: number) {
    return [...Array(guesses).keys()].map(item => ({
        index: item,
        letters: new Array(5).fill(' '),
        status: 'unchecked',
    }));
}