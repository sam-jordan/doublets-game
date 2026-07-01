import { useEffect, useState } from 'react';
import { validateSolution, validateWord } from '../logic/validators';
import { emptyGuesses } from '../logic/empty-guesses';
import { getPuzzle } from '../logic/get-puzzle';
import { Difficulties, Status, type Word } from '../logic/types';
import Popup from './popup';
import Row from './row';
import Keyboard from './keyboard';

export default function App() {
    const [guesses, setGuesses] = useState<Word[]>(emptyGuesses(4));
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
                        status: Status.CHECKED,
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
            <header className='flex justify-between border-b-1 px-4 py-2'>
                <h1 className='text-3xl text-correct'>DOUBLETS</h1>
                <div className='flex justify-between gap-x-2'>
                    <button className='w-8'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 640 640'
                        >
                            <path
                                fill='rgb(255, 255, 255)'
                                d='M96 176C96 149.5 117.5 128 144 128C170.5 128 192 149.5 192 176L192 288L448 288L448 176C448 149.5 469.5 128 496 128C522.5 128 544 149.5 544 176L544 192L560 192C586.5 192 608 213.5 608 240L608 288C625.7 288 640 302.3 640 320C640 337.7 625.7 352 608 352L608 400C608 426.5 586.5 448 560 448L544 448L544 464C544 490.5 522.5 512 496 512C469.5 512 448 490.5 448 464L448 352L192 352L192 464C192 490.5 170.5 512 144 512C117.5 512 96 490.5 96 464L96 448L80 448C53.5 448 32 426.5 32 400L32 352C14.3 352 0 337.7 0 320C0 302.3 14.3 288 32 288L32 240C32 213.5 53.5 192 80 192L96 192L96 176z'
                            />
                        </svg>
                    </button>
                    <button className='w-8'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 640 640'
                        >
                            <path
                                fill='rgb(255, 255, 255)'
                                d='M528 320C528 205.1 434.9 112 320 112C205.1 112 112 205.1 112 320C112 434.9 205.1 528 320 528C434.9 528 528 434.9 528 320zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 240C302.3 240 288 254.3 288 272C288 285.3 277.3 296 264 296C250.7 296 240 285.3 240 272C240 227.8 275.8 192 320 192C364.2 192 400 227.8 400 272C400 319.2 364 339.2 344 346.5L344 350.3C344 363.6 333.3 374.3 320 374.3C306.7 374.3 296 363.6 296 350.3L296 342.2C296 321.7 310.8 307 326.1 302C332.5 299.9 339.3 296.5 344.3 291.7C348.6 287.5 352 281.7 352 272.1C352 254.4 337.7 240.1 320 240.1zM288 432C288 414.3 302.3 400 320 400C337.7 400 352 414.3 352 432C352 449.7 337.7 464 320 464C302.3 464 288 449.7 288 432z'
                            />
                        </svg>
                    </button>
                </div>
            </header>
            <Popup showPopup={popupMessage !== ''} message={popupMessage} />
            <div className='flex justify-evenly items-center mt-16'>
                <div>
                    <Row
                        key={'start-word'}
                        index={100}
                        letters={puzzle.startWord.split('')}
                        status={Status.FIXED}
                        difficulty={difficulty}
                    />
                    {guesses.map(guess => (
                        <Row
                            key={`guess-${guess.index}`}
                            index={guess.index}
                            letters={guess.letters}
                            status={guess.status}
                            difficulty={difficulty}
                            currentGuess={guess.index === currentGuess}
                            setCurrentGuess={setCurrentGuess}
                        />
                    ))}
                    <Row
                        key={'end-word'}
                        index={101}
                        letters={puzzle.endWord.split('')}
                        status={Status.FIXED}
                        difficulty={difficulty}
                    />
                </div>
                <Keyboard handleKeyUp={handleKeyUp} />
            </div>
        </div>
    );
}
