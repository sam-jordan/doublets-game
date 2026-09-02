import OverlayCloseButton from '../overlay-close-button';

type HelpProps = {
    readonly setOverlay: React.Dispatch<
        React.SetStateAction<'help' | 'select-difficulty' | 'stats' | undefined>
    >;
};

export default function Help({ setOverlay }: HelpProps) {
    return (
        <div>
            <div className='flex justify-between'>
                <h2 className='font-(family-name:--title-fonts) font-bold text-2xl'>
                    How to Play
                </h2>
                <OverlayCloseButton setOverlay={setOverlay} />
            </div>
            <p className='font-(family-name:--title-fonts) mb-2'>
                Connect the start and end words using similar words.
            </p>
            <ul className='font-(family-name:--standard-fonts) pl-2'>
                <li>
                    &#8226; Change{' '}
                    <span className='font-extrabold'>exactly one</span> letter
                    between each guess,
                    <br />
                    indicated by the{' '}
                    <span className='text-pink-bright'>pink</span> tiles.
                </li>
                <li>&#8226; Each guess must be a valid 5-letter word.</li>
                {/* Mobile interaction */}
                <li className='sm:hidden'>
                    &#8226; Guesses can be selected by pressing on them or using
                    Enter/Backspace on the keyboard.
                </li>
                {/* Keyboard and mouse interaction */}
                <li className='hidden sm:list-item'>
                    &#8226; Guesses can be selected using the mouse, the arrow
                    keys or Enter/Backspace.
                </li>
                <li>
                    &#8226; Use the + and - buttons at the top of the page to
                    add and remove guesses.
                </li>
                <li>&#8226; Press Enter on the final guess to submit.</li>
                <li>
                    &#8226; Don&apos;t worry, you can keep trying if the
                    submission isn&apos;t valid!
                </li>
            </ul>
        </div>
    );
}
