export default function Word(props: { word: string[], modifiable: boolean }) {
    return (
        <div tabIndex={0} className='grid grid-cols-5 w-66 h-13'>
            {props.word.map(character => 
                <div className={`${props.modifiable ? 'border-2 border-inactive-border' : 'bg-white text-dark-bg'} text-3xl max-h-12 max-w-12 flex justify-center items-center`}>
                    <strong>{character}</strong>
                </div>
            )}
        </div>
    );
} 