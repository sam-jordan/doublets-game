export default function Popup(props: { message?: string }) {
    return props.message ? <div className="absolute top-5 bg-white text-black text-sm rounded-sm px-4 py-4">
        {props.message}
    </div> : null;
}