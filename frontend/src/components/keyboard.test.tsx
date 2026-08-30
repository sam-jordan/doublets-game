import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Keyboard from './keyboard';

// eslint-disable-next-line no-void
const handleKeyUp = vi.fn(() => void {});

describe('Keyboard', () => {
    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it('should render when shown', () => {
        const { asFragment } = render(
            <Keyboard handleKeyUp={handleKeyUp} overlay={undefined} />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should react to being clicked', async () => {
        const user = userEvent.setup();
        const keyboard = render(
            <Keyboard handleKeyUp={handleKeyUp} overlay={undefined} />
        );

        const keys = keyboard.getAllByRole('button');
        const q = keys[0];

        await user.click(q);
        expect(handleKeyUp).toHaveBeenCalledExactlyOnceWith('q');
    });

    it('should render differently when overlay is defined', async () => {
        const { asFragment } = render(
            <Keyboard handleKeyUp={handleKeyUp} overlay='help' />
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
