import { useEffect, useState } from "react";
import Word from "./word";
import { validateSolution, validateWord } from "../logic/validate-word";
import { emptyGuesses } from "../logic/empty-guesses";
import { getPuzzle } from "../logic/get-puzzle";
import Popup from "./popup";
import { Difficulties } from "../logic/types/difficulties";
import type { Guess } from "../logic/types/guess";
import { Status } from "../logic/types/status";

export default function App() {
    const [guesses, setGuesses] = useState<Guess[]>(emptyGuesses(4));
    const [currentGuess, setCurrentGuess] = useState<number>(0);
    const [popupMessage, setPopupMessage] = useState<string>();
    const [difficulty, setDifficulty] = useState<Difficulties>(Difficulties.EASY);

    const puzzle = getPuzzle(difficulty);
    const keyboard = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']];

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

    // FIX - will not use updated currentGuess until typed in (React wizardry needed)
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
        const validation = await validateWord(guesses[currentGuess].letters, puzzle);

        if (validation.valid) {
            const nextGuesses = guesses.map(guess => {
                if (guess.index === currentGuess) {
                    return {
                        ...guess,
                        status: Status.CHECKED as Status.CHECKED,
                    };
                } else {
                    return guess;
                }
            });

            setGuesses(nextGuesses);

            const maxGuesses = 4 + difficulty; // Will need changed if increasing the length of chain per difficulty
            if (currentGuess < maxGuesses - 1) {
                setCurrentGuess(currentGuess + 1);
            }
        } else {
            showPopup(validation.message);
        }
    }

    function handleBackspace() {
        guesses[currentGuess].status = Status.UNCHECKED;
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

    function handleDifficulty(nextDifficulty: Difficulties) {
        if (nextDifficulty === difficulty) {
            return;
        }

        const guessesLength = nextDifficulty === Difficulties.EASY ? 4 : (nextDifficulty === Difficulties.MEDIUM ? 5 : 6);

        setDifficulty(nextDifficulty);
        setCurrentGuess(0);
        setGuesses(emptyGuesses(guessesLength));
    }

    async function handleSubmit() {
        const validation = await validateSolution(guesses, puzzle);

        if (validation.valid) {
            showPopup('Splendid!');
        } else {
            showPopup(validation.message);
        }
    }

    return <div className="flex flex-col justify-evenly items-center text-xl font-(family-name:--use-font-family) w-screen h-screen ">
        <h1 className="text-3xl text-correct">DOUBLETS</h1>
        <Popup message={popupMessage} />
        <div className="flex gap-x-32 items-center">
            <div>
                <Word key={'start-word'} index={'start'} letters={puzzle.startWord.split('')} status={Status.PUZZLE} difficulty={difficulty} />
                {guesses.map(guess => <Word key={`guess-${guess.index}`} index={guess.index} letters={guess.letters} status={guess.status} difficulty={difficulty} currentGuess={guess.index === currentGuess} setCurrentGuess={setCurrentGuess} />)}
                <Word key={'end-word'} index={'end'} letters={puzzle.endWord.split('')} status={Status.PUZZLE} difficulty={difficulty} />
            </div>
            <div className="flex flex-col items-center gap-y-1.5">
                <button className='bg-button-bg rounded-sm py-4 px-4 cursor-pointer' onClick={handleSubmit}>SUBMIT</button>
                <div className="flex gap-x-1.5">
                    <button className='bg-button-bg rounded-sm py-4 px-4 cursor-pointer' onClick={() => handleDifficulty(Difficulties.EASY)}>EASY</button>
                    <button className='bg-button-bg rounded-sm py-4 px-4 cursor-pointer' onClick={() => handleDifficulty(Difficulties.MEDIUM)}>MEDIUM</button>
                    <button className='bg-button-bg rounded-sm py-4 px-4 cursor-pointer' onClick={() => handleDifficulty(Difficulties.HARD)}>HARD</button>
                </div>
                {keyboard.map(row => <div key={`keyboard-row-${keyboard.indexOf(row)}`} className="flex gap-x-1.5">{row.map(key => <button key={`keyboard-${key}`} className='bg-button-bg rounded-sm py-4 px-4 cursor-pointer' onClick={() => handleKeyUp(key)}>{key === 'Backspace' ? '⌫' : key.toUpperCase()}</button>)}</div>)}
            </div>
        </div>
    </div>
}