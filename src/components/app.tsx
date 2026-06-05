import { useEffect, useState } from "react";
import Word from "./word";
import { validateWord } from "../logic/validate-word";
import { emptyGuesses } from "../logic/empty-guesses";
import { getPuzzle } from "../logic/get-puzzle";
import Popup from "./popup";

export default function App() {
    const [guesses, setGuesses] = useState<{ index: number, letters: string[], status: string }[]>(emptyGuesses());
    const [currentGuess, setCurrentGuess] = useState<number>(0);
    const [popupMessage, setPopupMessage] = useState<string>();

    const puzzle = getPuzzle();
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
                    ...guess, letters: guess.letters.map((letter, index) => {
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

    // TODO - definitely want more feedback here - guess valid/invalid - popup, animation, text highlighting
    async function handleGuess() {
        // TODO - likely want this in an Effect (contains API call)
        const validation = await validateWord(guesses[currentGuess].letters, currentGuess === 0 ? puzzle[0].split('') : guesses[currentGuess - 1].letters, puzzle);

        if (validation.valid) {
            const nextGuesses = guesses.map(guess => {
                if (guess.index === currentGuess) {
                    return {
                        ...guess,
                        status: 'checked',
                    };
                } else {
                    return guess;
                }
            });

            setGuesses(nextGuesses);

            if (currentGuess === 3) {
                showPopup('Splendid');
            } else {
                setCurrentGuess(currentGuess + 1);
            }
        } else {
            showPopup(validation.message);
        }
    }

    function handleBackspace() {
        const currentIndex = guesses[currentGuess].letters.findLastIndex(letter => letter !== ' ');

        const nextGuesses = guesses.map(guess => {
            if (guess.index === currentGuess) {
                return {
                    ...guess, letters: guess.letters.map((letter, i) => {
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

    function showPopup(message: string) {
        setPopupMessage(message);

        setTimeout(() => {
            setPopupMessage(undefined);
        }, 2_000);
    };

    // TODO - allow current guess to be selected and allow for difficulty selection - will need 4, 5 or 6 guess rows
    return <div className="flex flex-col justify-evenly items-center text-xl font-(family-name:--use-font-family) w-screen h-screen ">
        <h1 className="text-3xl text-correct">DOUBLETS</h1>
        <Popup message={popupMessage} />
        <div className="flex gap-x-32 items-center">
            <div>
                <Word key={'start'} word={puzzle[0].split('')} status='puzzle' />
                {guesses.map((word, index) => <Word key={index} word={word.letters} status={word.status} />)}
                <Word key={'end'} word={puzzle[1].split('')} status='puzzle' />
            </div>
            <div className="flex flex-col items-center gap-y-1.5">
                {keyboard.map(row => <div className="flex gap-x-1.5">{row.map(key => <button key={key} className='bg-button-bg rounded-sm py-4 px-4 cursor-pointer' onClick={() => handleKeyUp(key)}>{key === 'Backspace' ? '⌫' : key.toUpperCase()}</button>)}</div>)}
            </div>
        </div>
    </div>
}