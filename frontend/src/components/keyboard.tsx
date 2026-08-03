import clsx from 'clsx';

export default function Keyboard(props: {
    handleKeyUp: (key: string) => void;
    showHelp: boolean;
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
                            className={clsx(
                                'bg-grey-light rounded-sm py-2 px-2 select-none sm:py-4 sm:px-4',
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
