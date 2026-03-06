export default function validateGuesses(words: string[], setSubmitText: React.Dispatch<React.SetStateAction<string>>) {
    console.log(words.includes(''))

    if (words.includes('')) {
        setSubmitText('The start and end word are not connected!');
        return;
    }

    for (let i = 0; i < words.length - 1; i++) {
        const diff = getWordDiff(words[i], words[i+1]);

        if (diff !== 1) {
            setSubmitText('There should only be one character that changes between each word!');
            return;
        }
    }

    setSubmitText('You win!');
}

function getWordDiff(word1: string, word2: string): number {
    const diff = []

    if (word1.length !== word1.length) {
        return 0;
    }

    for (const char of word1.split('')) {
        if (!word2.split('').includes(char)) {
            diff.push(char);
        }
    }

    return diff.length;
}