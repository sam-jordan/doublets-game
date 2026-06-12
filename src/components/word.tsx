import { getPuzzle } from "../logic/get-puzzle";

export default function Word(props: { word: string[], status: string, difficulty: 'easy' | 'medium' | 'hard' }) {
    return (
        <div tabIndex={0} className='grid grid-cols-5 w-66 h-13'>
            {props.word.map(character =>
                <div className={buildCharacterStyling(character, props.status, props.difficulty)}>
                    <strong>{character}</strong>
                </div>
            )}
        </div>
    );
}

// TODO - update this to check letter position
function buildCharacterStyling(char: string, status: string, difficulty: 'easy' | 'medium' | 'hard'): string {
    const base = (status === 'unchecked' ? 'border-2 border-inactive-border ' : (status === 'puzzle' ? 'bg-white text-dark-bg ' : ' ')) + 'text-3xl max-h-12 max-w-12 flex justify-center items-center';

    const puzzle = getPuzzle(difficulty);
    if (puzzle.endWord.split('').includes(char) && status === 'checked') {
        return base + ' bg-correct';
    }

    if (status === 'checked') {
        return base + ' bg-inactive-border';
    }

    return base;
}