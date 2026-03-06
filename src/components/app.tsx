import { useState } from "react";
import Word from "./word";

export default function App() {
    const [words, setWords] = useState(['WORDS', '', '', '', '', 'FILTH']);

    function handleSetWord(index: number, value: string) {
        const nextWords = words.map((word, i) => {
            if (i === index) {
                return value;
            } else {
                return word;
            }
        });
        setWords(nextWords);
    }
    
    return <div>
        {words.map((word, index) => <Word key={index} word={word} setWord={(value: string) => handleSetWord(index, value)}/>)}
    </div>
}