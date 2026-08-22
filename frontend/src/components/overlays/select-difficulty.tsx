import { Difficulties } from '../../logic/types';

export default function SelectDifficulty(props: {
    readonly handleDifficulty: (nextDifficulty: Difficulties) => void;
    readonly setOverlay: React.Dispatch<
        React.SetStateAction<React.JSX.Element | undefined>
    >;
}) {
    return (
        <>
            <div className='overlay flex justify-between sm:min-w-lg'>
                <h2 className='font-(family-name:--title-fonts) font-bold text-2xl'>
                    Select a difficulty
                </h2>
                <button
                    type='button'
                    className='w-4 cursor-pointer -mt-4'
                    onClick={() => {
                        props.setOverlay(undefined);
                    }}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 640 640'
                    >
                        <path
                            fill='rgb(255, 255, 255)'
                            d='M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z'
                        />
                    </svg>
                </button>
            </div>
            <p className='font-(family-name:--title-fonts) mb-2'>
                Easy has a &quot;par&quot; of 4 words, Medium 5, and Hard 6.
            </p>
            <div className='overlay flex flex-col justify-between items-center text-xl gap-y-4 font-bold my-8'>
                <button
                    type='button'
                    className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl'
                    onClick={() => {
                        props.handleDifficulty(Difficulties.EASY);
                        props.setOverlay(undefined);
                    }}
                >
                    Easy
                </button>
                <button
                    type='button'
                    className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl'
                    onClick={() => {
                        props.handleDifficulty(Difficulties.MEDIUM);
                        props.setOverlay(undefined);
                    }}
                >
                    Medium
                </button>
                <button
                    type='button'
                    className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl'
                    onClick={() => {
                        props.handleDifficulty(Difficulties.HARD);
                        props.setOverlay(undefined);
                    }}
                >
                    Hard
                </button>
            </div>
        </>
    );
}
