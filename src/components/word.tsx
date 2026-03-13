import Letter from "./letter";

export default function Word(props: { word: string[], setWord: ((value: string) => void) | undefined }) {
    return (
        <div tabIndex={0}>
            {props.word.map(character => <Letter character={character} />)}
        </div>
    );
} 