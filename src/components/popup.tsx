export default function Popup(props: { showPopup: boolean; message: string }) {
    return props.showPopup ? (
        <div className='absolute top-5 bg-white text-black text-sm rounded-sm px-4 py-4'>
            {props.message}
        </div>
    ) : null;
}
