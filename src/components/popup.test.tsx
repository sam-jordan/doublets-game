import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import Popup from './popup';

describe('Popup', () => {
    it('should render when shown', () => {
        const { asFragment } = render(
            <Popup popup={{ show: true, message: 'test' }} />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should return nothing when hidden', () => {
        const { asFragment } = render(
            <Popup popup={{ show: false, message: 'test' }} />
        );

        expect(asFragment()).toMatchInlineSnapshot('<DocumentFragment />');
    });
});
