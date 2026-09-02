import { DIFFICULTIES, type Difficulties } from '../../logic/types';
import OverlayCloseButton from '../overlay-close-button';

type SelectDifficultyProps = {
    readonly handleDifficulty: (nextDifficulty: Difficulties) => void;
    readonly setOverlay: React.Dispatch<
        React.SetStateAction<'help' | 'select-difficulty' | 'stats' | undefined>
    >;
};

export default function SelectDifficulty({
    handleDifficulty,
    setOverlay,
}: SelectDifficultyProps) {
    return (
        <div>
            <div className='flex justify-between sm:min-w-lg'>
                <h2 className='font-(family-name:--title-fonts) font-bold text-2xl'>
                    Select a difficulty
                </h2>
                <OverlayCloseButton setOverlay={setOverlay} />
            </div>
            <p className='font-(family-name:--title-fonts) mb-2'>
                Easy has a &quot;par&quot; of 4 words, Medium 5, and Hard 6.
            </p>
            <div className='flex flex-col justify-between items-center text-xl gap-y-4 font-bold my-8'>
                {DIFFICULTIES.map(difficulty => (
                    <button
                        key={`${difficulty}-button`}
                        type='button'
                        className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl'
                        onClick={() => {
                            handleDifficulty(difficulty);
                            setOverlay(undefined);
                        }}
                    >
                        {`${difficulty.slice(0, 1).toUpperCase()}${difficulty.slice(1)}`}
                    </button>
                ))}
            </div>
        </div>
    );
}
