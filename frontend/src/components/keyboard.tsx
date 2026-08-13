import clsx from 'clsx';

export default function Keyboard(props: {
    readonly handleKeyUp: (key: string) => void;
    // eslint-disable-next-line react/boolean-prop-naming -- too strict
    readonly showHelp: boolean;
}) {
    const keyboard = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
    ];

    return (
        <div className='flex flex-col items-center gap-y-1.5'>
            {keyboard.map(row => (
                <div
                    key={`keyboard-row-${keyboard.indexOf(row)}`}
                    className='flex gap-x-1.5'
                >
                    {row.map(key => (
                        <button
                            key={`keyboard-${key}`}
                            type='button'
                            className={clsx(
                                'h-14.5 bg-grey-light rounded-sm p-3 select-none font-bold flex justify-center items-center',
                                key === 'Backspace' || key === 'Enter'
                                    ? 'w-12 sm:w-17'
                                    : 'w-8 sm:w-10.75',
                                key === 'Enter'
                                    ? 'text-xs sm:text-sm'
                                    : 'text-lg sm:text-xl',
                                props.showHelp
                                    ? ''
                                    : 'cursor-pointer hover:bg-grey-very-light active:bg-grey-very-light'
                            )}
                            onClick={() => {
                                props.handleKeyUp(key);
                            }}
                        >
                            {key === 'Backspace' ? (
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 640 640'
                                    height='24'
                                    width='24'
                                >
                                    <path
                                        fill='rgb(255, 255, 255)'
                                        d='M576 192C576 156.7 547.3 128 512 128L205.3 128C188.3 128 172 134.7 160 146.7L9.4 297.4C3.4 303.4 0 311.5 0 320C0 328.5 3.4 336.6 9.4 342.6L160 493.3C172 505.3 188.3 512 205.3 512L512 512C547.3 512 576 483.3 576 448L576 192zM284.1 252.1C293.5 242.7 308.7 242.7 318 252.1L351.9 286L385.8 252.1C395.2 242.7 410.4 242.7 419.7 252.1C429 261.5 429.1 276.7 419.7 286L385.8 319.9L419.7 353.8C429.1 363.2 429.1 378.4 419.7 387.7C410.3 397 395.1 397.1 385.8 387.7L351.9 353.8L318 387.7C308.6 397.1 293.4 397.1 284.1 387.7C274.8 378.3 274.7 363.1 284.1 353.8L318 319.9L284.1 286C274.7 276.6 274.7 261.4 284.1 252.1z'
                                    />
                                </svg>
                            ) : (
                                <p>{key.toUpperCase()}</p>
                            )}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}
