import Word from "./word";

const words = {start: 'WORDS', guess1: undefined, guess2: undefined, guess3: undefined, guess4: undefined, guess5: undefined, end: 'FILTH'};

export default function App() {
    return <div>
        {Object.entries(words).map(word => <Word word={word[1]} writeable={['start', 'end'].includes(word[0]) ? false : true} key={word[0]}/>)}
    </div>
}