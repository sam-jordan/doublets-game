import { getPuzzle } from "../logic/get-puzzle";

export default function Word(props: { word: string[], status: string }) {
    return (
        <div tabIndex={0} className='grid grid-cols-5 w-66 h-13'>
            {props.word.map(character =>
                <div className={buildCharacterStyling(character, props.status)}>
                    <strong>{character}</strong>
                </div>
            )}
        </div>
    );
}

function buildCharacterStyling(char: string, status: string): string {
    const base = (status === 'unchecked' ? 'border-2 border-inactive-border ' : (status === 'puzzle' ? 'bg-white text-dark-bg ' : ' ')) + 'text-3xl max-h-12 max-w-12 flex justify-center items-center';

    const puzzle = getPuzzle();

    if (puzzle[0].split('').includes(char) && status === 'checked') {
        return base + ' bg-pink-500';
    }

    if (puzzle[1].split('').includes(char) && status === 'checked') {
        return base + ' bg-purple-500';
    }

    return base;
}