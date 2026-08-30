import clsx from 'clsx';
import { createPortal } from 'react-dom';

type OverlayProps = {
    readonly children: React.ReactNode;
    readonly overlay: 'help' | 'select-difficulty' | 'stats' | undefined;
};

export default function Overlay({ children, overlay }: OverlayProps) {
    if (overlay === undefined) {
        return null;
    }

    return createPortal(
        <dialog
            open
            className={clsx(
                'fixed top-5 left-1/2 bg-grey-very-dark -translate-x-1/2 p-4 text-white rounded-lg w-[80vw]',
                'sm:w-fit'
            )}
            closedby='any'
        >
            {children}
        </dialog>,
        document.querySelector('#root')!
    );
}
