import { useEffect, useState } from "react";
import Word from "./word";
import { validateWord } from "../logic/validate-word";
import { emptyGuesses } from "../logic/empty-guesses";

export default function App() {
    const [guesses, setGuesses] = useState<{ index: number, letters: string[] }[]>(emptyGuesses);
    const [currentGuess, setCurrentGuess] = useState<number>(0);

    const puzzle = ['WORDS', 'CHINA'];
    const keyboard = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']]

    useEffect(() => {
        function handleKeyboardEvent(e: KeyboardEvent) {
            e.preventDefault();
            handleKeyUp(e.key);
        }

        document.body.addEventListener('keyup', handleKeyboardEvent);

        return () => {
            document.body.removeEventListener('keyup', handleKeyboardEvent);
        }
    }, [guesses]);

    function handleKeyUp(key: string) {
        if (/^[a-z|A-Z]$/.test(key)) {
            handleType(key);
        }

        if (key === 'Enter') {
            handleGuess();
        }

        if (key === 'Backspace') {
            handleBackspace();
        }
    }

    function handleType(value: string) {
        const nextIndex = guesses[currentGuess].letters.findIndex(letter => letter === ' ');

        const nextGuesses = guesses.map(guess => {
            if (guess.index === currentGuess) {
                return {
                    index: guess.index, letters: guess.letters.map((letter, index) => {
                        if (nextIndex !== -1 && index === nextIndex) {
                            return value.toUpperCase();
                        } else {
                            return letter;
                        }
                    })
                };
            } else {
                return guess;
            }
        });

        setGuesses(nextGuesses);
    }

    async function handleGuess() {
        // TODO - investigate dictionary API responses to see if this is actually needed
        const isFullWord = !guesses[currentGuess].letters.includes(' ');

        if (isFullWord) {
            const validation = await validateWord(guesses[currentGuess].letters, currentGuess === 0 ? puzzle[0].split('') : guesses[currentGuess - 1].letters);

            if (validation.valid && validation.changed.length === 1) {
                setCurrentGuess(currentGuess + 1);
            }
        }
    }

    function handleBackspace() {
        const currentIndex = guesses[currentGuess].letters.findLastIndex(letter => letter !== ' ');

        const nextGuesses = guesses.map(guess => {
            if (guess.index === currentGuess) {
                return {
                    index: guess.index, letters: guess.letters.map((letter, i) => {
                        if (currentIndex !== -1 && i === currentIndex) {
                            return ' ';
                        } else {
                            return letter;
                        }
                    })
                };
            } else {
                return guess;
            }
        });

        setGuesses(nextGuesses);
    }

    return <div className="flex flex-col justify-center items-center text-xl font-(family-name:--use-font-family) w-screen h-screen gap-y-2">
        <h1>Doublets</h1>
        <div>
            <Word key={'start'} word={puzzle[0].split('')} modifiable={false} />
            {guesses.map((word, index) => <Word key={index} word={word.letters} modifiable={true} />)}
            <Word key={'end'} word={puzzle[1].split('')} modifiable={false} />
        </div>
        {/* <div className="flex gap-8 mt-4">
            <button className='bg-button-bg rounded-sm p-2 cursor-pointer' onClick={() => validateGuesses(guesses, setSubmitText)}>Submit Guesses</button>
            <button className='bg-button-bg rounded-sm p-2 cursor-pointer' onClick={() => { setGuesses(emptyGuesses()); setSubmitText(''); }}>Reset Guesses</button>
        </div> */}
        <div className="flex flex-col items-center gap-y-1.5">
            {keyboard.map(row => <div className="flex gap-x-1.5">{row.map(key => <button key={key} className='bg-button-bg rounded-sm py-4 px-4 cursor-pointer' onClick={() => handleType(key)}>{key === 'Backspace' ? '⌫' : key.toUpperCase()}</button>)}</div>)}
        </div>
    </div>
}