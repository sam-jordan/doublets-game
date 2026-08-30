import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Overlay from './overlay';

describe('Overlay', () => {
    afterEach(() => {
        cleanup();
    });

    it('should render', () => {
        const { asFragment } = render(
            <Overlay overlay='help'>
                <p>test</p>
            </Overlay>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should return nothing when overlay prop is set to undefined', () => {
        const { asFragment } = render(
            <Overlay overlay={undefined}>{undefined}</Overlay>
        );

        expect(asFragment()).toMatchInlineSnapshot('<DocumentFragment />');
    });
});
