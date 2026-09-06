import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type IconDefinition } from '@fortawesome/free-solid-svg-icons';

type HeaderButtonProps = {
    readonly icon: IconDefinition;
    readonly overlay: 'help' | 'select-difficulty' | 'stats' | undefined;
    readonly setOverlay: React.Dispatch<
        React.SetStateAction<'help' | 'select-difficulty' | 'stats' | undefined>
    >;
    readonly onClick: () => void;
};

export default function HeaderButton({
    icon,
    overlay,
    setOverlay,
    onClick,
}: HeaderButtonProps) {
    return (
        <button
            type='button'
            className={clsx(
                'w-10',
                'sm:w-12',
                overlay === undefined
                    ? 'hover:bg-grey-mid active:bg-grey-mid cursor-pointer'
                    : ''
            )}
            onClick={() => {
                if (overlay === undefined) {
                    onClick();
                } else {
                    setOverlay(undefined);
                }
            }}
        >
            <FontAwesomeIcon
                icon={icon}
                style={{ color: 'rgb(255, 255, 255)' }}
                id='overlay-button'
            />
        </button>
    );
}
