/* eslint-disable no-void -- needed for mock functions */

import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
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
                icon={faCircleQuestion}
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
                icon={faCircleQuestion}
                overlay={undefined}
                setOverlay={setOverlay}
                onClick={onClick}
            />
        );

        const button = ui.getByRole('button');
        await user.click(button);

        expect(onClick).toHaveBeenCalledOnce();
    });

    it('should render correctly and disable onClick when overlay is defined', async () => {
        const user = userEvent.setup();
        const ui = render(
            <HeaderButton
                icon={faCircleQuestion}
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
