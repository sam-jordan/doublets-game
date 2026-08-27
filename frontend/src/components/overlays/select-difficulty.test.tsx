/* eslint-disable no-void -- needed for mock functions */

import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import SelectDifficulty from './select-difficulty';

const handleDifficulty = vi.fn(() => void {});
const setOverlay = vi.fn(() => void {});

describe('SelectDifficulty', () => {
    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it('should render', async () => {
        const { asFragment } = render(
            <SelectDifficulty
                handleDifficulty={handleDifficulty}
                setOverlay={setOverlay}
            />
        );

        await expect(asFragment()).toMatchFileSnapshot(
            '../__snapshots__/select-difficulty.test.tsx.snap'
        );
    });

    it('should have a working X button', async () => {
        const user = userEvent.setup();
        const ui = render(
            <SelectDifficulty
                handleDifficulty={handleDifficulty}
                setOverlay={setOverlay}
            />
        );

        const button = ui.getByRole('button', { name: '' });
        await user.click(button);

        expect(setOverlay).toHaveBeenCalledExactlyOnceWith(undefined);
    });

    it.each([
        ['Easy', 'easy'],
        ['Medium', 'medium'],
        ['Hard', 'hard'],
    ])(
        'should allow the difficulty to be set to %s',
        async (name, difficulty) => {
            const user = userEvent.setup();
            const ui = render(
                <SelectDifficulty
                    handleDifficulty={handleDifficulty}
                    setOverlay={setOverlay}
                />
            );

            const button = ui.getByRole('button', { name });
            await user.click(button);

            expect(handleDifficulty).toHaveBeenCalledExactlyOnceWith(
                difficulty
            );
            expect(setOverlay).toHaveBeenCalledExactlyOnceWith(undefined);
        }
    );
});
