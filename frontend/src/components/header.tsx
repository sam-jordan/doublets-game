import clsx from 'clsx';
import {
    faCircleQuestion,
    faSquareMinus,
    faSquarePlus,
} from '@fortawesome/free-regular-svg-icons';
import {
    faChartSimple,
    faDumbbell,
    faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type GameState } from '../logic/types';
import { formatDuration } from '../logic/format-duration';
import HeaderButton from './header-button';

type HeaderProps = {
    readonly overlay: 'help' | 'select-difficulty' | 'stats' | undefined;
    readonly setOverlay: React.Dispatch<
        React.SetStateAction<'help' | 'select-difficulty' | 'stats' | undefined>
    >;
    readonly addGuess: () => void;
    readonly removeGuess: () => void;
    readonly gameState: GameState;
};

export default function Header({
    overlay,
    setOverlay,
    addGuess,
    removeGuess,
    gameState,
}: HeaderProps) {
    const { solved, difficulty, timers } = gameState;

    return (
        <header className='flex justify-between border-b px-4'>
            <div className='flex items-center gap-4'>
                <h1
                    className={clsx(
                        'font-(family-name:--title-fonts) text-3xl text-pink-bright py-2 font-extrabold hidden',
                        'sm:block'
                    )}
                >
                    DOUBLETS
                </h1>
                <p className='font-(family-name:--standard-fonts)'>
                    {`${difficulty.slice(0, 1).toUpperCase()}${difficulty.slice(1)}`}
                </p>
                <p className='font-(family-name:--standard-fonts)'>
                    {formatDuration(timers[difficulty])}
                    <span className='inline-flex'>
                        {solved[difficulty] === undefined ? null : (
                            <FontAwesomeIcon
                                icon={faTrophy}
                                style={{ color: 'rgb(255, 255, 255)' }}
                                className='ml-1'
                                size='xs'
                            />
                        )}
                    </span>
                </p>
            </div>
            <div className='flex justify-between gap-x-2'>
                <HeaderButton
                    icon={faSquarePlus}
                    overlay={overlay}
                    setOverlay={setOverlay}
                    name='Add Guess'
                    onClick={addGuess}
                />
                <HeaderButton
                    icon={faSquareMinus}
                    overlay={overlay}
                    setOverlay={setOverlay}
                    name='Remove Guess'
                    onClick={removeGuess}
                />
                <HeaderButton
                    icon={faDumbbell}
                    overlay={overlay}
                    setOverlay={setOverlay}
                    name='Select Difficulty'
                    onClick={() => {
                        setOverlay('select-difficulty');
                    }}
                />
                <HeaderButton
                    icon={faChartSimple}
                    overlay={overlay}
                    setOverlay={setOverlay}
                    name='Stats'
                    onClick={() => {
                        setOverlay('stats');
                    }}
                />
                <HeaderButton
                    icon={faCircleQuestion}
                    overlay={overlay}
                    setOverlay={setOverlay}
                    name='Help'
                    onClick={() => {
                        setOverlay('help');
                    }}
                />
            </div>
        </header>
    );
}
