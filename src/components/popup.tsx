export default function Popup(props: {
    popup: { show: boolean; message: string };
}) {
    return props.popup.show ? (
        <div className='absolute top-5 bg-white text-black text-sm rounded-sm px-4 py-4'>
            {props.popup.message}
        </div>
    ) : null;
}
