export default function Word(props: { word: string[] }) {
    return (
        <div tabIndex={0} className='grid grid-cols-5 w-64 h-13'>
            {props.word.map(character => <div className='text-3xl max-h-12 max-w-12 border-2 border-inactive-border flex justify-center items-center'><strong>{character}</strong></div>)}
        </div>
    );
} 