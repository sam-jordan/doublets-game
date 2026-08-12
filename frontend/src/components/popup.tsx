export default function Popup(props: {
    readonly popup: { show: boolean; message: string };
}) {
    return props.popup.show ? (
        <div className='font-(family-name:--standard-fonts) fixed top-14 left-1/2 bg-white text-black text-sm rounded-sm px-4 py-4 -translate-x-1/2 animate-fade-out font-medium'>
            {props.popup.message}
        </div>
    ) : null;
}
