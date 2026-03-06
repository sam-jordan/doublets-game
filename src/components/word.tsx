export default function Word(props: { word?: string, setWord: any}) {
    return (
        <div>
            <input 
                type="text"
                value={props.word}
                onChange={(e) => props.setWord((e.target.value).toUpperCase())}
            />
        </div>
    );
} 