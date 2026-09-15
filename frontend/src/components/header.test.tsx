/* eslint-disable no-void -- needed for mock functions */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { Duration } from 'luxon';
import userEvent from '@testing-library/user-event';
import { emptyGuesses } from '../logic/empty-guesses';
import {
    DIFFICULTIES,
    type Difficulties,
    type GameState,
} from '../../../shared/types';
import Header from './header';

const setOverlay = vi.fn(() => void {});
const addGuess = vi.fn(() => void {});
const removeGuess = vi.fn(() => void {});

describe('Header', () => {
    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    const gameState: GameState = {
        guesses: emptyGuesses(),
        currentGuess: 0,
        difficulty: 'easy',
        solved: Object.fromEntries(
            DIFFICULTIES.map(difficulty => [difficulty, undefined])
        ) as Record<Difficulties, number | undefined>,
        timers: Object.fromEntries(
            DIFFICULTIES.map(difficulty => [difficulty, Duration.fromMillis(0)])
        ) as Record<Difficulties, Duration<true>>,
        attempted: Object.fromEntries(
            DIFFICULTIES.map(d => [d, false])
        ) as Record<Difficulties, boolean>,
    };

    it('should render correctly', () => {
        const { asFragment } = render(
            <Header
                overlay={undefined}
                setOverlay={setOverlay}
                addGuess={addGuess}
                removeGuess={removeGuess}
                gameState={gameState}
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it.each(['Select Difficulty', 'Stats', 'Help'])(
        'should correctly set the overlay when %s clicked',
        async name => {
            const user = userEvent.setup();
            const header = render(
                <Header
                    overlay={undefined}
                    setOverlay={setOverlay}
                    addGuess={addGuess}
                    removeGuess={removeGuess}
                    gameState={gameState}
                />
            );

            const button = header.getByRole('button', { name });
            await user.click(button);

            const code = name.replace(' ', '-').toLowerCase();
            expect(setOverlay).toHaveBeenCalledExactlyOnceWith(code);
        }
    );

    it('should display a trophy icon if current difficulty has been solved', () => {
        const { asFragment } = render(
            <Header
                overlay={undefined}
                setOverlay={setOverlay}
                addGuess={addGuess}
                removeGuess={removeGuess}
                gameState={{
                    ...gameState,
                    solved: { ...gameState.solved, easy: 123_456_789 },
                }}
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
