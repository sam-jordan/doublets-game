import { useState } from "react";
import Word from "./word";
import validateGuesses from "../logic/validate-guesses";

export default function App() {
    const [words, setWords] = useState<string[][]>([
        ['W', 'O', 'R', 'D', 'S'],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['C', 'H', 'I', 'N', 'A'],
    ]);
    const [submitText, setSubmitText] = useState('');

    function handleSetWord(index: number, value: string) {
        const nextWords = words.map((word, i) => {
            if (i === index) {
                return value.split('');
            } else {
                return word;
            }
        });
        setWords(nextWords);
    }

    return <div>
        {words.map((word, index) => <Word key={index} word={word} setWord={index === 0 || index === 5 ? undefined : (value: string) => handleSetWord(index, value)}/>)}
        <button onClick={() => validateGuesses(words, setSubmitText)}>Submit Guesses</button>
        <p>{submitText}</p>
    </div>
}