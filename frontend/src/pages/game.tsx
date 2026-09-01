import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { DateTime, Duration } from 'luxon';
import { useMutation } from '@tanstack/react-query';
import z from 'zod';
import { getChanged, validateSolution } from '../logic/validators';
import { emptyGuess } from '../logic/empty-guesses';
import { getPuzzle } from '../logic/get-puzzle';
import {
    type Attempted,
    type Difficulties,
    type Solved,
    type UseGameState,
} from '../logic/types';
import Popup from '../components/popup';
import Word from '../components/word';
import Keyboard from '../components/keyboard';
import Header from '../components/header';
import Overlay from '../components/overlay';
import Stats from '../components/overlays/stats';
import Help from '../components/overlays/help';
import SelectDifficulty from '../components/overlays/select-difficulty';
import { useCurrentUser } from '../logic/queries';
import { callApi } from '../logic/query-helpers';

export default function Game(props: UseGameState) {
    // Displays
    const [popup, setPopup] = useState<{ show: boolean; message: string }>({
        show: false,
        message: '',
    });
    const [overlay, setOverlay] = useState<
        'help' | 'select-difficulty' | 'stats' | undefined
    >(undefined);

    // Animations
    const [lastTyped, setLastTyped] = useState<number | undefined>(undefined);
    const [useShake, setUseShake] = useState<number | undefined>(undefined);
    const [useJump, setUseJump] = useState<number | undefined>(undefined);
    const [gameWin, setGameWin] = useState<number | undefined>(undefined);

    const popupTimeoutRef = useRef<number | undefined>(undefined);
    const timerTimeoutRef = useRef<number | undefined>(undefined);

    // Main state
    const { gameState, setGameState } = props;
    const { guesses, currentGuess, difficulty, solved, timers, attempted } =
        gameState;

    // TanStack queries
    const currentUser = useCurrentUser();
    const attemptedMutation = useMutation({
        mutationFn: async (options: {
            username: string | undefined;
            body: Attempted;
        }) =>
            callApi({
                endpoint: {
                    path: `game/${options.username}/attempted/${difficulty}`,
                    schema: z.string(),
                },
                method: 'POST',
                body: options.body,
            }),
    });
    const solvedMutation = useMutation({
        mutationFn: async (options: {
            username: string | undefined;
            body: Solved;
        }) =>
            callApi({
                endpoint: {
                    path: `game/${options.username}/solved/${difficulty}`,
                    schema: z.string(),
                },
                method: 'PUT',
                body: options.body,
            }),
    });

    const puzzle = getPuzzle(difficulty);

    // Cache game state in browser
    useEffect(() => {
        localStorage.setItem(
            `doublets:[${DateTime.now().toUTC().toLocaleString(DateTime.DATE_SHORT)}]`,
            JSON.stringify(gameState)
        );
    }, [gameState]);

    // Increment timer
    useEffect(() => {
        if (solved[difficulty] !== undefined || overlay !== undefined) {
            return;
        }

        timerTimeoutRef.current = setTimeout(() => {
            setGameState({
                ...gameState,
                timers: {
                    ...timers,
                    [difficulty]: timers[difficulty].plus(
                        Duration.fromMillis(1000)
                    ),
                },
            });
        }, 1000);

        return () => {
            clearTimeout(timerTimeoutRef.current);
        };
    }, [gameState, overlay]);

    // Show game win animation
    useEffect(() => {
        const animationTimers: number[] = [];
        if (
            solved[difficulty] !== undefined &&
            DateTime.now().toMillis() < solved[difficulty] + 6500
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
            setGameState({
                ...gameState,
                solved: {
                    ...solved,
                    [difficulty]: DateTime.now().toMillis(),
                },
            });
            solvedMutation.mutate({
                username: currentUser.data?.username,
                body: {
                    attempted: true,
                    solved: true,
                    solveTime: timers[difficulty],
                    guesses: guesses[difficulty].map(guess =>
                        guess.letters.join('')
                    ),
                },
            });
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
        if (key === 'Escape') {
            setOverlay(undefined);
        }

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

        const nextGuesses = {
            ...guesses,
            [difficulty]: guesses[difficulty].map(guess => {
                if (guess.index === currentGuess) {
                    const changed = getChanged(
                        nextGuess.letters,
                        nextGuess.index === 0
                            ? puzzle.startWord.split('')
                            : guesses[difficulty][nextGuess.index - 1].letters
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
                        : guesses[difficulty][guess.index - 1].letters
                );

                return { ...guess, changed };
            }),
        };

        setLastTyped(nextIndex);
        if (attempted[difficulty]) {
            setGameState({ ...gameState, guesses: nextGuesses });
        } else {
            setGameState({
                ...gameState,
                guesses: nextGuesses,
                attempted: {
                    ...attempted,
                    [difficulty]: true,
                },
            });
            attemptedMutation.mutate({
                username: currentUser.data?.username,
                body: {
                    attempted: true,
                    solved: false,
                },
            });
        }
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

            const nextGuesses = {
                ...guesses,
                [difficulty]: guesses[difficulty].map(guess => {
                    if (guess.index === currentGuess) {
                        return {
                            ...nextGuess,
                            changed,
                        };
                    }

                    return guess;
                }),
            };

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

        setGameState({
            ...gameState,
            guesses: {
                ...guesses,
                [difficulty]: [
                    ...guesses[difficulty],
                    emptyGuess(guesses[difficulty].length),
                ],
            },
        });
    }

    function removeGuess() {
        if (solved[difficulty] !== undefined) {
            return;
        }

        let nextCurrentGuess = currentGuess;
        if (currentGuess === guesses[difficulty].length - 1) {
            nextCurrentGuess =
                currentGuess === 0 ? currentGuess : currentGuess - 1;
        }

        setGameState({
            ...gameState,
            guesses: {
                ...guesses,
                [difficulty]: guesses[difficulty].toSpliced(-1, 1),
            },
            currentGuess: nextCurrentGuess,
        });
    }

    function getOverlay() {
        switch (overlay) {
            case 'help': {
                return <Help setOverlay={setOverlay} />;
            }

            case 'select-difficulty': {
                return (
                    <SelectDifficulty
                        setOverlay={setOverlay}
                        handleDifficulty={handleDifficulty}
                    />
                );
            }

            case 'stats': {
                return <Stats setOverlay={setOverlay} />;
            }

            case undefined: {
                return undefined;
            }
        }
    }

    function handleClick(event: React.MouseEvent) {
        if (!(
            event.target instanceof HTMLElement ||
            event.target instanceof SVGElement
        )) {
            return;
        }

        if (!event.target.closest('button')?.id.endsWith('overlay-button')) {
            setOverlay(undefined);
        }
    }

    return (
        <div>
            <Overlay overlay={overlay}>{getOverlay()}</Overlay>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- handled by Effect/popover */}
            <div
                className={clsx(
                    'font-(family-name:--standard-fonts) w-svw h-svh min-h-fit bg-grey-very-dark text-white flex flex-col',
                    overlay === undefined ? '' : 'brightness-50'
                )}
                onClick={handleClick}
            >
                <Header
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
                            type='fixed'
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
                            type='fixed'
                            gameWin={gameWin}
                        />
                    </div>
                    <Keyboard handleKeyUp={handleKeyUp} overlay={overlay} />
                </div>
            </div>
        </div>
    );
}
