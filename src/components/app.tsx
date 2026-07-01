import { useEffect, useState } from 'react';
import { validateSolution, validateWord } from '../logic/validators';
import { emptyGuesses } from '../logic/empty-guesses';
import { getPuzzle } from '../logic/get-puzzle';
import { Difficulties, Status, type Guess } from '../logic/types';
import Popup from './popup';
import Word from './word';
import Keyboard from './keyboard';

export default function App() {
    const [guesses, setGuesses] = useState<Guess[]>(emptyGuesses(4));
    const [currentGuess, setCurrentGuess] = useState<number>(0);
    const [popupMessage, setPopupMessage] = useState<string>('');
    const [difficulty, setDifficulty] = useState<Difficulties>(
        Difficulties.EASY
    );

    const puzzle = getPuzzle(difficulty);

    useEffect(() => {
        function handleKeyboardEvent(event: KeyboardEvent) {
            event.preventDefault();
            handleKeyUp(event.key);
        }

        document.body.addEventListener('keyup', handleKeyboardEvent);

        return () => {
            document.body.removeEventListener('keyup', handleKeyboardEvent);
        };
    });

    function handleKeyUp(key: string) {
        if (/^[a-z]$/iv.test(key)) {
            handleType(key);
        }

        // Else if (key === 'Enter') {
        //     await handleGuess();
        // }

        else if (key === 'Backspace') {
            handleBackspace();
        }
    }

    function handleType(value: string) {
        const nextIndex = guesses[currentGuess].letters.indexOf(' ');

        const nextGuesses = guesses.map(guess => {
            if (guess.index === currentGuess) {
                return {
                    ...guess,
                    letters: guess.letters.map((letter, index) => {
                        if (nextIndex !== -1 && index === nextIndex) {
                            return value.toUpperCase();
                        }

                        return letter;
                    }),
                };
            }

            return guess;
        });

        setGuesses(nextGuesses);
    }

    // TODO - definitely want more feedback here - guess valid/invalid - popup, animation, text highlighting
    async function handleGuess() {
        // TODO - likely want this in an Effect (contains API call)
        const validation = await validateWord(
            guesses[currentGuess].letters,
            puzzle
        );

        if (validation.valid) {
            const nextGuesses = guesses.map(guess => {
                if (guess.index === currentGuess) {
                    return {
                        ...guess,
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                        status: Status.CHECKED as Status.CHECKED,
                    };
                }

                return guess;
            });

            setGuesses(nextGuesses);

            // Will need changed if increasing the length of chain per difficulty
            const maxGuesses = 4 + difficulty; 
            if (currentGuess < maxGuesses - 1) {
                setCurrentGuess(currentGuess + 1);
            }
        } else {
            showPopup(validation.message);
        }
    }

    function handleBackspace() {
        guesses[currentGuess].status = Status.UNCHECKED;
        const currentIndex = guesses[currentGuess].letters.findLastIndex(
            letter => letter !== ' '
        );

        const nextGuesses = guesses.map(guess => {
            if (guess.index === currentGuess) {
                return {
                    ...guess,
                    letters: guess.letters.map((letter, i) => {
                        if (currentIndex !== -1 && i === currentIndex) {
                            return ' ';
                        }

                        return letter;
                    }),
                };
            }

            return guess;
        });

        setGuesses(nextGuesses);
    }

    function showPopup(message: string) {
        setPopupMessage(message);

        setTimeout(() => {
            setPopupMessage('');
        }, 2000);
    }

    function handleDifficulty(nextDifficulty: Difficulties) {
        if (nextDifficulty === difficulty) {
            return;
        }

        const guessesLength =
            nextDifficulty === Difficulties.EASY
                ? 4
                : nextDifficulty === Difficulties.MEDIUM
                  ? 5
                  : 6;

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

    return (
        <div className='font-(family-name:--use-font-family) w-screen h-screen'>
            <header className='flex justify-evenly border-b-1 py-2'>
                <h1 className='text-3xl text-correct'>DOUBLETS</h1>
                <div>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path fill="rgb(255, 255, 255)" d="M96 176C96 149.5 117.5 128 144 128C170.5 128 192 149.5 192 176L192 288L448 288L448 176C448 149.5 469.5 128 496 128C522.5 128 544 149.5 544 176L544 192L560 192C586.5 192 608 213.5 608 240L608 288C625.7 288 640 302.3 640 320C640 337.7 625.7 352 608 352L608 400C608 426.5 586.5 448 560 448L544 448L544 464C544 490.5 522.5 512 496 512C469.5 512 448 490.5 448 464L448 352L192 352L192 464C192 490.5 170.5 512 144 512C117.5 512 96 490.5 96 464L96 448L80 448C53.5 448 32 426.5 32 400L32 352C14.3 352 0 337.7 0 320C0 302.3 14.3 288 32 288L32 240C32 213.5 53.5 192 80 192L96 192L96 176z"/>
                        </svg>
                    </button>
                </div>
            </header>
            <Popup showPopup={popupMessage !== ''} message={popupMessage} />
            <div className='flex justify-evenly items-center mt-16'>
                <div>
                    <Word
                        key={'start-word'}
                        index={'start'}
                        letters={puzzle.startWord.split('')}
                        status={Status.PUZZLE}
                        difficulty={difficulty}
                    />
                    {guesses.map(guess => (
                        <Word
                            key={`guess-${guess.index}`}
                            index={guess.index}
                            letters={guess.letters}
                            status={guess.status}
                            difficulty={difficulty}
                            currentGuess={guess.index === currentGuess}
                            setCurrentGuess={setCurrentGuess}
                        />
                    ))}
                    <Word
                        key={'end-word'}
                        index={'end'}
                        letters={puzzle.endWord.split('')}
                        status={Status.PUZZLE}
                        difficulty={difficulty}
                    />
                </div>
                <Keyboard handleKeyUp={handleKeyUp}/>
            </div>
        </div>
    );
}
