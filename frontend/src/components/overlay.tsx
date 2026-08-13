import clsx from 'clsx';

export default function Overlay(props: { readonly children: React.ReactNode }) {
    return props.children === undefined ? null : (
        <div
            className={clsx(
                'overlay fixed top-5 left-1/2 bg-grey-very-dark -translate-x-1/2 p-4 z-99 text-white rounded-lg w-[80vw]',
                'sm:w-fit'
            )}
        >
            {props.children}
        </div>
    );
}
