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
    readonly name: string;
};

export default function HeaderButton({
    icon,
    overlay,
    setOverlay,
    onClick,
    name,
}: HeaderButtonProps) {
    return (
        <button
            type='button'
            className={clsx(
                'w-10 min-h-12',
                'sm:w-12',
                overlay === undefined
                    ? 'hover:bg-grey-mid active:bg-grey-mid cursor-pointer'
                    : ''
            )}
            id={`${icon.iconName}-overlay-button`}
            aria-label={name}
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
                size='xl'
            />
        </button>
    );
}
