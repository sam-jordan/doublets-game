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
                                'bg-grey-light rounded-sm p-2.75 select-none text-sm',
                                'sm:p-4 sm:text-base',
                                props.showHelp ? '' : 'cursor-pointer'
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
