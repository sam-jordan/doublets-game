import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

type KeyboardProps = {
    readonly handleKeyUp: (key: string) => void;
    readonly overlay: 'help' | 'select-difficulty' | 'stats' | undefined;
};

export default function Keyboard({ handleKeyUp, overlay }: KeyboardProps) {
    const keyboard = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
    ];

    return (
        <div className='flex flex-col items-center gap-y-1.5 p-1.5'>
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
                                overlay === undefined
                                    ? 'cursor-pointer hover:bg-grey-very-light active:bg-grey-very-light'
                                    : ''
                            )}
                            onClick={() => {
                                handleKeyUp(key);
                            }}
                        >
                            {key === 'Backspace' ? (
                                <FontAwesomeIcon
                                    icon={faDeleteLeft}
                                    style={{ color: 'rgb(255, 255, 255)' }}
                                    width='1.5rem'
                                    height='1.5rem'
                                />
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
