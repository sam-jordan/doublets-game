import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import { getChanged, validateSolution } from '../logic/validators';
import { emptyGuesses } from '../logic/empty-guesses';
import { getPuzzle } from '../logic/get-puzzle';
import { Difficulties, WordTypes, type Guess } from '../logic/types';
import Popup from './popup';
import Word from './word';
import Keyboard from './keyboard';
import Header from './header';
import Help from './help';

export default function Game() {
    // Game state
    const [guesses, setGuesses] = useState<Guess[][]>(emptyGuesses());
    const [currentGuess, setCurrentGuess] = useState<number>(0);
    const [popup, setPopup] = useState<{ show: boolean; message: string }>({
        show: false,
        message: '',
    });
    const [difficulty, setDifficulty] = useState<Difficulties>(
        Difficulties.EASY
    );
    const [solved, setSolved] = useState<Array<number | undefined>>(
        Array.from({ length: 3 }, _ => undefined)
    );
    const [showHelp, setShowHelp] = useState<boolean>(false);

    // Animations
    const [lastTyped, setLastTyped] = useState<number | undefined>(undefined);
    const [useShake, setUseShake] = useState<number | undefined>(undefined);
    const [useJump, setUseJump] = useState<number | undefined>(undefined);
    const [gameWin, setGameWin] = useState<number | undefined>(undefined);

    const timeoutRef = useRef<number | undefined>(undefined);

    const puzzle = getPuzzle(difficulty);

    useEffect(() => {
        const timers: number[] = [];
        if (
            solved[difficulty] !== undefined &&
            DateTime.now().toMillis() <
                solved[difficulty] + (4500 + 750 * difficulty)
        ) {
            // Animating the start word
            setGameWin(100);

            // Animating the guesses
            for (const guess of guesses[difficulty]) {
                const timer = setTimeout(
                    () => {
                        setGameWin(guess.index);
                    },
                    750 * (guess.index + 1)
                );

                timers.push(timer);
            }

            // Animating the end word
            const timer = setTimeout(
                () => {
                    setGameWin(101);
                },
                750 * (guesses[difficulty].length + 1)
            );

            const final = setTimeout(
                () => {
                    setGameWin(undefined);
                },
                750 * (guesses[difficulty].length + 2)
            );

            timers.push(timer, final);
        }

        return () => {
            for (const timer of timers) {
                clearTimeout(timer);
            }
        };
    }, [solved]);

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
        } else {
            switch (key) {
                case 'Enter': {
                    if (currentGuess === guesses[difficulty].length - 1) {
                        handleSubmit();
                    } else {
                        setCurrentGuess(currentGuess + 1);
                        setUseJump(currentGuess + 1);
                    }

                    setLastTyped(undefined);
                    break;
                }

                case 'Backspace': {
                    handleBackspace();
                    break;
                }

                case 'ArrowUp': {
                    if (currentGuess !== 0) {
                        setCurrentGuess(currentGuess - 1);
                        setUseJump(currentGuess - 1);
                    }

                    setLastTyped(undefined);
                    break;
                }

                case 'ArrowDown': {
                    if (currentGuess < guesses[difficulty].length - 1) {
                        setCurrentGuess(currentGuess + 1);
                        setUseJump(currentGuess + 1);
                    }

                    setLastTyped(undefined);
                    break;
                }

                default: {
                    break;
                }
            }
        }
    }

    function handleType(value: string) {
        if (solved[difficulty] !== undefined) {
            return;
        }

        const nextIndex =
            guesses[difficulty][currentGuess].letters.indexOf(' ');
        const nextGuess = {
            ...guesses[difficulty][currentGuess],
            letters: guesses[difficulty][currentGuess].letters.map(
                (letter, index) => {
                    if (nextIndex !== -1 && index === nextIndex) {
                        return value.toUpperCase();
                    }

                    return letter;
                }
            ),
        };

        const nextGuesses = guesses.map((difficultyGuesses, index) => {
            if (index === difficulty.valueOf()) {
                return difficultyGuesses.map(guess => {
                    if (guess.index === currentGuess) {
                        const changed = getChanged(
                            nextGuess.letters,
                            nextGuess.index === 0
                                ? puzzle.startWord.split('')
                                : difficultyGuesses[nextGuess.index - 1].letters
                        );

                        return {
                            ...nextGuess,
                            changed,
                        };
                    }

                    if (guess.index === currentGuess + 1) {
                        const changed = getChanged(
                            guess.letters,
                            nextGuess.letters
                        );

                        return { ...guess, changed };
                    }

                    const changed = getChanged(
                        guess.letters,
                        guess.index === 0
                            ? puzzle.startWord.split('')
                            : difficultyGuesses[guess.index - 1].letters
                    );

                    return { ...guess, changed };
                });
            }

            return difficultyGuesses;
        });

        setLastTyped(nextIndex);
        setGuesses(nextGuesses);
    }

    function handleBackspace() {
        if (solved[difficulty] !== undefined) {
            return;
        }

        const currentIndex = guesses[difficulty][
            currentGuess
        ].letters.findLastIndex(letter => letter !== ' ');

        if (currentIndex === -1 && currentGuess > 0) {
            setCurrentGuess(currentGuess - 1);
            setUseJump(currentGuess - 1);
        } else {
            const nextGuess = {
                ...guesses[difficulty][currentGuess],
                letters: guesses[difficulty][currentGuess].letters.map(
                    (letter, i) => {
                        if (i === currentIndex) {
                            return ' ';
                        }

                        return letter;
                    }
                ),
            };

            const changed = getChanged(
                nextGuess.letters,
                nextGuess.index === 0
                    ? puzzle.startWord.split('')
                    : guesses[difficulty][nextGuess.index - 1].letters
            );

            const nextGuesses = guesses.map((difficultyGuesses, index) => {
                if (index === difficulty.valueOf()) {
                    return difficultyGuesses.map(guess => {
                        if (guess.index === currentGuess) {
                            return {
                                ...nextGuess,
                                changed,
                            };
                        }

                        return guess;
                    });
                }

                return difficultyGuesses;
            });

            setLastTyped(undefined);
            setGuesses(nextGuesses);
        }
    }

    function handleDifficulty(nextDifficulty: Difficulties) {
        if (nextDifficulty === difficulty) {
            return;
        }

        setDifficulty(nextDifficulty);
        setCurrentGuess(0);
    }

    function handleSubmit() {
        if (solved[difficulty] !== undefined) {
            return;
        }

        setPopup({ ...popup, show: false });
        if (typeof timeoutRef.current === 'number') {
            clearTimeout(timeoutRef.current);
        }

        const result = validateSolution(guesses[difficulty], puzzle);

        if (result.valid) {
            setPopup({ show: true, message: 'Splendid!' });

            const nextSolved = solved.map((difficultySolved, index) => {
                if (index === difficulty.valueOf()) {
                    return DateTime.now().toMillis();
                }

                return difficultySolved;
            });
            setSolved(nextSolved);
        } else {
            setUseShake(result.index);
            setPopup({ show: true, message: result.message });
        }

        timeoutRef.current = setTimeout(() => {
            setUseShake(undefined);
            setPopup({ ...popup, show: false });
        }, 2000);
    }

    return (
        <div>
            <Help showHelp={showHelp} setShowHelp={setShowHelp} />
            <div
                className={clsx(
                    'font-(family-name:--game-fonts) w-screen h-screen bg-grey-very-dark text-white flex flex-col',
                    showHelp ? 'brightness-50' : ''
                )}
            >
                <Header
                    handleDifficulty={handleDifficulty}
                    showHelp={showHelp}
                    setShowHelp={setShowHelp}
                />
                <Popup popup={popup} />
                <div className='flex flex-col justify-center items-center grow gap-8'>
                    <div>
                        <Word
                            key={'start-word'}
                            index={100}
                            letters={puzzle.startWord.split('')}
                            type={WordTypes.FIXED}
                            gameWin={gameWin}
                        />
                        {guesses[difficulty].map(guess => (
                            <Word
                                key={`guess-${guess.index}`}
                                index={guess.index}
                                letters={guess.letters}
                                type={guess.type}
                                changed={guess.changed}
                                currentGuess={guess.index === currentGuess}
                                setCurrentGuess={setCurrentGuess}
                                lastTyped={lastTyped}
                                useShake={useShake}
                                useJump={useJump}
                                setUseJump={setUseJump}
                                gameWin={gameWin}
                            />
                        ))}
                        <Word
                            key={'end-word'}
                            index={101}
                            letters={puzzle.endWord.split('')}
                            type={WordTypes.FIXED}
                            gameWin={gameWin}
                        />
                    </div>
                    <Keyboard handleKeyUp={handleKeyUp} />
                </div>
            </div>
        </div>
    );
}
