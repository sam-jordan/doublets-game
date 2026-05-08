export function emptyGuesses() {
    return [...Array(4).keys()].map(item => ({
        index: item,
        letters: new Array(5).fill(' '),
        status: 'unchecked',
    }));
}