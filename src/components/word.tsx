import { useState } from "react";

export default function Word(props: { word?: string, writeable: boolean }) {
    const [value, setValue] = useState<string | undefined>(props.word);

    return (
        <div>
            {props.writeable ? <input 
                type="text"
                value={value}
                onChange={(e) => setValue((e.target.value).toUpperCase())}
            /> : <p>{value}</p>}
        </div>
    );
} 