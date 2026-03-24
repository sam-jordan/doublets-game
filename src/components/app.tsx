import { useEffect, useState } from "react";
import Word from "./word";
import validateGuesses from "../logic/validate-guesses";
import splitWords from "../logic/split-words";

export default function App() {
    const [guesses, setGuesses] = useState(new Array(20).fill(' '));
    const [submitText, setSubmitText] = useState('');

    const puzzle = ['WORDS', 'CHINA'];
    const keyboard = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']]

    useEffect(() => {
        function handleKeyUp(e: KeyboardEvent) {
            e.preventDefault();
            handleType(e.key);
        }

        document.body.addEventListener('keyup', handleKeyUp);

        return () => {
            document.body.removeEventListener('keyup', handleKeyUp);
        }
    }, [guesses]);

    function handleType(key: string) {
        if (/^[a-z|A-Z]$/.test(key)) {
            handleGuess(key);
        } 
        
        if (key === 'Enter') {
            validateGuesses(splitWords(guesses, 5), setSubmitText);
        }

        if (key === 'Backspace') {
            handleBackspace();
        }
    }

    function handleGuess(value: string) {
        const nextIndex = guesses.findIndex(letter => letter === ' ');

        const nextGuesses = guesses.map((letter, i) => {
            if (nextIndex !== -1 && i === nextIndex) {
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

    return <div className="flex flex-col justify-center items-center text-xl font-(family-name:--use-font-family) w-screen h-screen gap-y-2">
        <h1>Doublets</h1>
        <div>
            <Word key={'start'} word={puzzle[0].split('')} modifiable={false} />
            {splitWords(guesses, 5).map((word, index) => <Word key={index} word={word} modifiable={true} />)}
            <Word key={'end'} word={puzzle[1].split('')} modifiable={false} />    
        </div>
        <div className="flex gap-8 mt-4">
            <button className='bg-button-bg rounded-sm p-2' onClick={() => validateGuesses(splitWords(guesses, 5), setSubmitText)}>Submit Guesses</button>
            <button className='bg-button-bg rounded-sm p-2' onClick={() => { setGuesses(new Array(20).fill(' ')); setSubmitText(''); }}>Reset Guesses</button>
        </div>
        <p>{submitText}</p>
        <div className="flex flex-col items-center gap-y-1.5">
            {keyboard.map(row => <div className="flex gap-x-1.5">{row.map(key => <button key={key} className='bg-button-bg rounded-sm py-4 px-4 cursor-pointer' onClick={() => handleType(key)}>{key === 'Backspace' ? '⌫' : key.toUpperCase()}</button>)}</div>)}
        </div>   
    </div>
}