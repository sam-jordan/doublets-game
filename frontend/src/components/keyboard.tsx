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
                                props.showHelp ? '' : 'cursor-pointer',
                                'hover:bg-grey-very-light active:bg-grey-very-light'
                            )}
                            onClick={() => {
                                props.handleKeyUp(key);
                            }}
                        >
                            {key === 'Backspace' ? '⌫' : key.toUpperCase()}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}
