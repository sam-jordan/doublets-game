/* eslint-disable no-void -- needed for mock functions */

import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import HeaderButton from './header-button';

const onClick = vi.fn(() => void {});
const setOverlay = vi.fn(() => void {});

describe('HeaderButton', () => {
    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it('should render', () => {
        const { asFragment } = render(
            <HeaderButton
                type='test'
                overlay={undefined}
                setOverlay={setOverlay}
                onClick={onClick}
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should call the function passed to it when clicked', async () => {
        const user = userEvent.setup();
        const ui = render(
            <HeaderButton
                type='test'
                overlay={undefined}
                setOverlay={setOverlay}
                onClick={onClick}
            />
        );

        const button = ui.getByRole('button');
        await user.click(button);

        expect(onClick).toHaveBeenCalledOnce();
    });

    it.each([
        'add-guess-overlay-button',
        'remove-guess-overlay-button',
        'difficulties-overlay-button',
        'help-overlay-button',
        'stats-overlay-button',
    ])('should render with the correct icon (%s)', id => {
        const { asFragment } = render(
            <HeaderButton
                type={id}
                overlay={undefined}
                setOverlay={setOverlay}
                onClick={onClick}
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should render correctly and disable onClick when overlay is defined', async () => {
        const user = userEvent.setup();
        const ui = render(
            <HeaderButton
                type='test'
                overlay='help'
                setOverlay={setOverlay}
                onClick={onClick}
            />
        );

        expect(ui.asFragment()).toMatchSnapshot();

        const button = ui.getByRole('button');
        await user.click(button);

        expect(onClick).toHaveBeenCalledTimes(0);
    });
});
