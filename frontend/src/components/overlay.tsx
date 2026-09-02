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
                'fixed top-5 left-1/2 bg-grey-very-dark -translate-x-1/2 p-4 text-white rounded-lg w-[80vw] min-h-48 flex flex-col',
                'sm:w-fit sm:min-w-100'
            )}
            // eslint-disable-next-line react/no-unknown-property -- is in fact a valid property
            closedby='any'
        >
            {children}
        </dialog>,
        document.querySelector('#root')!
    );
}
