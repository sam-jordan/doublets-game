import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import HeaderButton from './header-button';

// eslint-disable-next-line no-void
const onClick = vi.fn(() => void {});

describe('HeaderButton', () => {
    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it('should render', () => {
        const { asFragment } = render(
            <HeaderButton id='test' overlay={undefined} onClick={onClick} />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should call the function passed to it when clicked', async () => {
        const user = userEvent.setup();
        const ui = render(
            <HeaderButton id='test' overlay={undefined} onClick={onClick} />
        );

        const button = ui.getByRole('button');
        await user.click(button);

        expect(onClick).toHaveBeenCalledOnce();
    });

    it.each([
        'add-guess-button',
        'remove-guess-button',
        'difficulties-button',
        'help-button',
        'stats-button',
    ])('should render with the correct icon (%s)', id => {
        const { asFragment } = render(
            <HeaderButton id={id} overlay={undefined} onClick={onClick} />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should render correctly and disable onClick when overlay is defined', async () => {
        const user = userEvent.setup();
        const ui = render(
            <HeaderButton id='test' overlay={<p>test</p>} onClick={onClick} />
        );

        expect(ui.asFragment()).toMatchSnapshot();

        const button = ui.getByRole('button');
        await user.click(button);

        expect(onClick).toHaveBeenCalledTimes(0);
    });
});
