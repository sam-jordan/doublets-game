/* eslint-disable @typescript-eslint/strict-void-return */

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
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
    const [guesses, setGuesses] = useState<Guess[]>(emptyGuesses(4));
    const [currentGuess, setCurrentGuess] = useState<number>(0);
    const [popup, setPopup] = useState<{ show: boolean; message: string }>({
        show: false,
        message: '',
    });
    const [difficulty, setDifficulty] = useState<Difficulties>(
        Difficulties.EASY
    );
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [showHelp, setShowHelp] = useState<boolean>(false);

    // Animations
    const [lastTyped, setLastTyped] = useState<number | undefined>(undefined);
    const [useShake, setUseShake] = useState<number | undefined>(undefined);
    const [useJump, setUseJump] = useState<number | undefined>(undefined);

    const timeoutRef = useRef<number | undefined>(undefined);

    const puzzle = getPuzzle(difficulty);

    useEffect(() => {
        async function handleKeyboardEvent(event: KeyboardEvent) {
            event.preventDefault();
            await handleKeyUp(event.key);
        }

        document.body.addEventListener('keyup', handleKeyboardEvent);

        return () => {
            document.body.removeEventListener('keyup', handleKeyboardEvent);
        };
    });

    async function handleKeyUp(key: string) {
        if (/^[a-z]$/iv.test(key)) {
            handleType(key);
        } else {
            switch (key) {
                case 'Enter': {
                    if (currentGuess === guesses.length - 1) {
                        await handleSubmit();
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
                    if (currentGuess < guesses.length - 1) {
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
        if (gameOver) {
            return;
        }

        const nextIndex = guesses[currentGuess].letters.indexOf(' ');
        const nextGuess = {
            ...guesses[currentGuess],
            letters: guesses[currentGuess].letters.map((letter, index) => {
                if (nextIndex !== -1 && index === nextIndex) {
                    return value.toUpperCase();
                }

                return letter;
            }),
        };

        const nextGuesses = guesses.map(guess => {
            if (guess.index === currentGuess) {
                const changed = getChanged(
                    nextGuess.letters,
                    nextGuess.index === 0
                        ? puzzle.startWord.split('')
                        : guesses[nextGuess.index - 1].letters
                );

                return {
                    ...nextGuess,
                    changed,
                };
            }

            if (guess.index === currentGuess + 1) {
                const changed = getChanged(guess.letters, nextGuess.letters);

                return { ...guess, changed };
            }

            const changed = getChanged(
                guess.letters,
                guess.index === 0
                    ? puzzle.startWord.split('')
                    : guesses[guess.index - 1].letters
            );

            return { ...guess, changed };
        });

        setLastTyped(nextIndex);
        setGuesses(nextGuesses);
    }

    function handleBackspace() {
        if (gameOver) {
            return;
        }

        const currentIndex = guesses[currentGuess].letters.findLastIndex(
            letter => letter !== ' '
        );

        if (currentIndex === -1 && currentGuess > 0) {
            setCurrentGuess(currentGuess - 1);
            setUseJump(currentGuess - 1);
        } else {
            const nextGuess = {
                ...guesses[currentGuess],
                letters: guesses[currentGuess].letters.map((letter, i) => {
                    if (i === currentIndex) {
                        return ' ';
                    }

                    return letter;
                }),
            };

            const changed = getChanged(
                nextGuess.letters,
                nextGuess.index === 0
                    ? puzzle.startWord.split('')
                    : guesses[nextGuess.index - 1].letters
            );

            const nextGuesses = guesses.map(guess => {
                if (guess.index === currentGuess) {
                    return {
                        ...nextGuess,
                        changed,
                    };
                }

                return guess;
            });

            setLastTyped(undefined);
            setGuesses(nextGuesses);
        }
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
        setGameOver(false);
    }

    async function handleSubmit() {
        if (gameOver) {
            return;
        }

        setPopup({ ...popup, show: false });
        if (typeof timeoutRef.current === 'number') {
            clearTimeout(timeoutRef.current);
        }

        const result = await validateSolution(guesses, puzzle);

        if (result.valid) {
            setPopup({ show: true, message: 'Splendid!' });
            setGameOver(true);
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
                <div className='flex justify-evenly items-center grow'>
                    <div>
                        <Word
                            key={'start-word'}
                            index={100}
                            letters={puzzle.startWord.split('')}
                            type={WordTypes.FIXED}
                        />
                        {guesses.map(guess => (
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
                            />
                        ))}
                        <Word
                            key={'end-word'}
                            index={101}
                            letters={puzzle.endWord.split('')}
                            type={WordTypes.FIXED}
                        />
                    </div>
                    <Keyboard handleKeyUp={handleKeyUp} />
                </div>
            </div>
        </div>
    );
}
