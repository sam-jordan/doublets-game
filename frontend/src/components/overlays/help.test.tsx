import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Help from './help';

// eslint-disable-next-line no-void
const setOverlay = vi.fn(() => void {});

describe('Help', () => {
    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it('should render', async () => {
        const { asFragment } = render(<Help setOverlay={setOverlay} />);

        await expect(asFragment()).toMatchFileSnapshot(
            '../__snapshots__/help.test.tsx.snap'
        );
    });

    it('should have a working X button', async () => {
        const user = userEvent.setup();
        const ui = render(<Help setOverlay={setOverlay} />);

        const button = ui.getByRole('button');
        await user.click(button);

        expect(setOverlay).toHaveBeenCalledExactlyOnceWith(undefined);
    });
});
