import { Link } from 'react-router-dom';
import { Duration } from 'luxon';
import { useCurrentUser } from '../../logic/queries';
import LoadingSpinner from '../loading-spinner';

export default function Stats(props: {
    readonly setOverlay: React.Dispatch<
        React.SetStateAction<React.JSX.Element | undefined>
    >;
}) {
    const currentUser = useCurrentUser();

    // Temporary object for developing frontend
    const stats = {
        0: {
            puzzlesAttempted: 12,
            puzzlesSolved: 10,
            wordsUsed: 43,
            averageTime: Duration.fromMillis(3 * 60 * 1000),
            averageGuesses: 4,
        },
        1: {
            puzzlesAttempted: 9,
            puzzlesSolved: 5,
            wordsUsed: 28,
            averageTime: Duration.fromMillis(5.2 * 60 * 1000),
            averageGuesses: 5.3,
        },
        2: {
            puzzlesAttempted: 8,
            puzzlesSolved: 4,
            wordsUsed: 22,
            averageTime: Duration.fromMillis(7.1 * 60 * 1000),
            averageGuesses: 7.5,
        },
    };

    return (
        <>
            <div className='overlay flex justify-between'>
                <h2 className='font-(family-name:--title-fonts) font-bold text-2xl'>
                    Statistics
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
            {currentUser.isPending ? (
                <LoadingSpinner size='4rem' />
            ) : currentUser.isError ? (
                <Link
                    className='font-(family-name:--standard-fonts) border-2 border-white w-48 cursor-pointer py-2 rounded-3xl hover:bg-grey-mid active:bg-grey-mid text-center'
                    to='/user/login'
                >
                    Log in
                </Link>
            ) : (
                <p>Logged in.</p>
            )}
        </>
    );
}
