import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import OverlayCloseButton from './overlay-close-button';

// eslint-disable-next-line no-void
const setOverlay = vi.fn(() => void {});

describe('HeaderButton', () => {
    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it('should render', () => {
        const { asFragment } = render(
            <OverlayCloseButton setOverlay={setOverlay} />
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
