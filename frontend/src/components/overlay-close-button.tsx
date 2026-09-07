import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type OverlayCloseButtonOptions = {
    readonly setOverlay: React.Dispatch<
        React.SetStateAction<'help' | 'select-difficulty' | 'stats' | undefined>
    >;
};

export default function OverlayCloseButton({
    setOverlay,
}: OverlayCloseButtonOptions) {
    return (
        <button
            type='button'
            className='w-4 cursor-pointer -mt-4'
            aria-label='close-dialog'
            onClick={() => {
                setOverlay(undefined);
            }}
        >
            <FontAwesomeIcon
                icon={faXmark}
                style={{ color: 'rgb(255, 255, 255)' }}
            />
        </button>
    );
}
