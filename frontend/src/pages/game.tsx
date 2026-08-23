import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { DateTime, Duration } from 'luxon';
import { getChanged, validateSolution } from '../logic/validators';
import { emptyGuess } from '../logic/empty-guesses';
import { getPuzzle } from '../logic/get-puzzle';
import {
    type Difficulties,
    WordTypes,
    type UseGameState,
} from '../logic/types';
import Popup from '../components/popup';
import Word from '../components/word';
import Keyboard from '../components/keyboard';
import Header from '../components/header';
import Overlay from '../components/overlay';

export default function Game(props: UseGameState) {
    // Displays
    const [popup, setPopup] = useState<{ show: boolean; message: string }>({
        show: false,
        message: '',
    });
    const [overlay, setOverlay] = useState<React.JSX.Element | undefined>(
        undefined
    );

    // Animations
    const [lastTyped, setLastTyped] = useState<number | undefined>(undefined);
    const [useShake, setUseShake] = useState<number | undefined>(undefined);
    const [useJump, setUseJump] = useState<number | undefined>(undefined);
    const [gameWin, setGameWin] = useState<number | undefined>(undefined);

    const popupTimeoutRef = useRef<number | undefined>(undefined);
    const timerTimeoutRef = useRef<number | undefined>(undefined);

    // Main state
    const { gameState, setGameState } = props;
    const { guesses, currentGuess, difficulty, solved, timers } = gameState;

    const puzzle = getPuzzle(difficulty);

    // Cache game state in browser
    useEffect(() => {
        localStorage.setItem(
            `doublets:${DateTime.now().toUTC().toLocaleString(DateTime.DATE_SHORT)}`,
            JSON.stringify(gameState)
        );
    }, [gameState]);

    // Increment timer
    useEffect(() => {
        if (solved[difficulty] !== undefined) {
            return;
        }

        timerTimeoutRef.current = setTimeout(() => {
            setGameState({
                ...gameState,
                timers: timers.map(timer => {
                    if (timers.indexOf(timer) === difficulty.valueOf()) {
                        return timer.plus(Duration.fromMillis(1000));
                    }

                    return timer;
                }),
            });
        }, 1000);

        return () => {
            clearTimeout(timerTimeoutRef.current);
        };
    }, [gameState]);

    // Show game win animation
    useEffect(() => {
        const animationTimers: number[] = [];
        if (
            solved[difficulty] !== undefined &&
            DateTime.now().toMillis() <
                // eslint-disable-next-line @stylistic/no-mixed-operators -- conflicts with Prettier
                solved[difficulty] + (4500 + 750 * gameState.difficulty) // May need adjusted to account for adding/removing guesses
        ) {
            // Animating the start word
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setGameWin(100);

            // Animating the guesses
            for (const guess of guesses[difficulty]) {
                const timer = setTimeout(
                    () => {
                        setGameWin(guess.index);
                    },
                    750 * (guess.index + 1)
                );

                animationTimers.push(timer);
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

            animationTimers.push(timer, final);
        }

        return () => {
            for (const timer of animationTimers) {
                clearTimeout(timer);
            }
        };
    }, [gameState]);

    function handleSubmit() {
        if (solved[difficulty] !== undefined) {
            return;
        }

        setPopup({ ...popup, show: false });
        if (typeof popupTimeoutRef.current === 'number') {
            clearTimeout(popupTimeoutRef.current);
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
            setGameState({ ...gameState, solved: nextSolved });
        } else {
            setUseShake(result.index);
            setPopup({ show: true, message: result.message });
        }

        popupTimeoutRef.current = setTimeout(() => {
            setUseShake(undefined);
            setPopup({ ...popup, show: false });
        }, 2000);
    }

    function handleKeyUp(key: string) {
        if (overlay !== undefined) {
            return;
        }

        if (/^[a-z]$/iv.test(key)) {
            handleType(key);
        } else {
            switch (key) {
                case 'Enter': {
                    if (currentGuess === guesses[difficulty].length - 1) {
                        handleSubmit();
                    } else {
                        setGameState({
                            ...gameState,
                            currentGuess: currentGuess + 1,
                        });
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
                        setGameState({
                            ...gameState,
                            currentGuess: currentGuess - 1,
                        });
                        setUseJump(currentGuess - 1);
                    }

                    setLastTyped(undefined);
                    break;
                }

                case 'ArrowDown': {
                    if (currentGuess < guesses[difficulty].length - 1) {
                        setGameState({
                            ...gameState,
                            currentGuess: currentGuess + 1,
                        });
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
        setGameState({ ...gameState, guesses: nextGuesses });
    }

    function handleBackspace() {
        if (solved[difficulty] !== undefined) {
            return;
        }

        const currentIndex = guesses[difficulty][
            currentGuess
        ].letters.findLastIndex(letter => letter !== ' ');

        if (currentIndex === -1 && currentGuess > 0) {
            setGameState({ ...gameState, currentGuess: currentGuess - 1 });
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
            setGameState({ ...gameState, guesses: nextGuesses });
        }
    }

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

    function handleDifficulty(nextDifficulty: Difficulties) {
        if (nextDifficulty === difficulty) {
            return;
        }

        setGameState({
            ...gameState,
            difficulty: nextDifficulty,
            currentGuess: 0,
        });
    }

    function addGuess() {
        if (solved[difficulty] !== undefined) {
            return;
        }

        const nextGuesses = guesses.map((difficultyGuesses, index) => {
            if (index === difficulty.valueOf()) {
                return [
                    ...difficultyGuesses,
                    emptyGuess(difficultyGuesses.length),
                ];
            }

            return difficultyGuesses;
        });

        setGameState({ ...gameState, guesses: nextGuesses });
    }

    function removeGuess() {
        if (solved[difficulty] !== undefined) {
            return;
        }

        let nextCurrentGuess = currentGuess;
        const nextGuesses = guesses.map((difficultyGuesses, index) => {
            if (index === difficulty.valueOf()) {
                if (currentGuess === difficultyGuesses.length - 1) {
                    nextCurrentGuess =
                        currentGuess === 0 ? currentGuess : currentGuess - 1;
                }

                return difficultyGuesses.toSpliced(-1, 1);
            }

            return difficultyGuesses;
        });

        setGameState({
            ...gameState,
            guesses: nextGuesses,
            currentGuess: nextCurrentGuess,
        });
    }

    return (
        <div>
            <Overlay>{overlay}</Overlay>
            <div
                className={clsx(
                    'font-(family-name:--standard-fonts) w-svw h-svh min-h-fit bg-grey-very-dark text-white flex flex-col',
                    overlay === undefined ? '' : 'brightness-50'
                )}
            >
                <Header
                    handleDifficulty={handleDifficulty}
                    overlay={overlay}
                    setOverlay={setOverlay}
                    addGuess={addGuess}
                    removeGuess={removeGuess}
                    gameState={gameState}
                />
                <Popup popup={popup} />
                <div className='flex flex-col justify-between items-center grow'>
                    <div className='flex flex-col justify-center grow mt-3 mb-1.5'>
                        <Word
                            key='start-word'
                            index={100}
                            letters={puzzle.startWord.split('')}
                            type={WordTypes.FIXED}
                            gameWin={gameWin}
                        />
                        <div
                            className={clsx(
                                'scrollbar-none overflow-auto',
                                guesses[difficulty].length > 4 ? 'h-71' : ''
                            )}
                        >
                            {guesses[difficulty].map(guess => (
                                <Word
                                    key={`guess-${guess.index}`}
                                    index={guess.index}
                                    letters={guess.letters}
                                    type={guess.type}
                                    changed={guess.changed}
                                    gameState={gameState}
                                    setGameState={setGameState}
                                    lastTyped={lastTyped}
                                    useShake={useShake}
                                    useJump={useJump}
                                    setUseJump={setUseJump}
                                    gameWin={gameWin}
                                />
                            ))}
                        </div>
                        <Word
                            key='end-word'
                            index={101}
                            letters={puzzle.endWord.split('')}
                            type={WordTypes.FIXED}
                            gameWin={gameWin}
                        />
                    </div>
                    <Keyboard handleKeyUp={handleKeyUp} overlay={overlay} />
                </div>
            </div>
        </div>
    );
}
