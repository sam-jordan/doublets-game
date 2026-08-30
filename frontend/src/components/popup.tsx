type PopupProps = {
    readonly popup: {
        show: boolean;
        message: string;
    };
};

export default function Popup({ popup }: PopupProps) {
    const { show, message } = popup;

    return show ? (
        <div className='font-(family-name:--standard-fonts) fixed top-14 left-1/2 bg-white text-black text-sm rounded-sm px-4 py-4 -translate-x-1/2 animate-fade-out font-medium text-center'>
            {message}
        </div>
    ) : null;
}
