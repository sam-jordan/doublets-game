import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import Keyboard from './keyboard';

// eslint-disable-next-line no-void
const handleKeyUp = vi.fn(() => void {});

describe('Keyboard', () => {
    it('should render when shown', () => {
        const { asFragment } = render(
            <Keyboard handleKeyUp={handleKeyUp} showHelp={false} />
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
