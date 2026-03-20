import { useEffect, useState } from "react";
import Word from "./word";
import validateGuesses from "../logic/validate-guesses";
import splitWords from "../logic/split-words";

export default function App() {
    const [guesses, setGuesses] = useState(new Array(20).fill(' '));
    const [submitText, setSubmitText] = useState('');

    const puzzle = ['WORDS', 'CHINA'];

    useEffect(() => {
        document.body.addEventListener('keyup', handleKeyPress);

        return () => {
            document.body.removeEventListener('keyup', handleKeyPress);
        }
    }, [guesses]);

    function handleKeyPress(e: KeyboardEvent) {
        e.preventDefault();

        if (/^[a-z]$/.test(e.key)) {
            handleGuess(e.key);
        } 
        
        if (e.key === 'Enter') {
            validateGuesses(splitWords(guesses, 5), setSubmitText);
        }

        if (e.key === 'Backspace') {
            handleBackspace();
        }
    }

    function handleGuess(value: string) {
        const nextIndex = guesses.findIndex(letter => letter === ' ');

        const nextGuesses = guesses.map((letter, i) => {
            if (nextIndex === -1 ? i === guesses.length - 1 : i === nextIndex) {
                return value.toUpperCase();
            } else {
                return letter;
            }
        });

        setSubmitText('');
        setGuesses(nextGuesses);
    }

    function handleBackspace() {
        const currentIndex = guesses.findLastIndex(letter => letter !== ' ');

        const nextGuesses = guesses.map((letter, i) => {
            if (currentIndex !== -1 && i === currentIndex) {
                return ' '
            } else {
                return letter;
            }
        });

        setSubmitText('');
        setGuesses(nextGuesses);
    }

    return <div className="flex flex-col justify-center items-center text-xl font-(family-name:--use-font-family)">
        <div>
            <Word key={'start'} word={puzzle[0].split('')}/>
            {splitWords(guesses, 5).map((word, index) => <Word key={index} word={word} />)}
            <Word key={'end'} word={puzzle[1].split('')}/>    
        </div>
        <button onClick={() => validateGuesses(splitWords(guesses, 5), setSubmitText)}>Submit Guesses</button>
        <p>{submitText}</p>
    </div>
}