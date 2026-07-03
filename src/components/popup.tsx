export default function Popup(props: {
    popup: { show: boolean; message: string };
}) {
    return props.popup.show ? (
        <div className='fixed top-14 left-3/7 bg-white text-black text-sm rounded-sm px-4 py-4'>
            {props.popup.message}
        </div>
    ) : null;
}
