export default function Word(props: { word: string[], setWord: ((value: string) => void) | undefined }) {
    return (
        <div tabIndex={0} className='grid grid-cols-5 w-68 gap-y-2'>
            {props.word.map(character => <div className='min-h-12 max-w-12 border-2 border-black text-center'><strong>{character}</strong></div>)}
        </div>
    );
} 