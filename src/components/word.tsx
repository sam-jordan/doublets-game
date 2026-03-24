export default function Word(props: { word: string[], modifiable: boolean }) {
    return (
        <div tabIndex={0} className='grid grid-cols-5 w-64 h-13'>
            {props.word.map(character => 
                <div className={`${props.modifiable ? 'border-inactive-border' : 'bg-white text-dark-bg border-button-bg'} border-2 text-3xl max-h-12 max-w-12 flex justify-center items-center`}>
                    <strong>{character}</strong>
                </div>
            )}
        </div>
    );
} 