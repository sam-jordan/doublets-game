export default function Word(props: { word: string[], setWord: ((value: string) => void) | undefined }) {
    return (
        <div>
            <input 
                type="text"
                value={props.word.join('')}
                onChange={(e) => {
                    if (props.setWord) {
                        return props.setWord((e.target.value).toUpperCase());
                    } 
                    return;
                }}
            />
        </div>
    );
} 