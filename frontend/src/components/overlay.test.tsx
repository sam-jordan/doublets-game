import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Overlay from './overlay';

describe('Overlay', () => {
    afterEach(() => {
        cleanup();
    });

    it('should render', () => {
        const { asFragment } = render(
            <Overlay>
                <p>test</p>
            </Overlay>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should return nothing when called without children', () => {
        const { asFragment } = render(<Overlay />);

        expect(asFragment()).toMatchInlineSnapshot('<DocumentFragment />');
    });
});
