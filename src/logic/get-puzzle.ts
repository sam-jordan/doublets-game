export type Puzzle = { startWord: string, endWord: string };

export function getPuzzle(difficulty: 'easy' | 'medium' | 'hard') {
    // Temporary while building frontend
    switch (difficulty) {
        case 'easy':
            return { startWord: 'WORDS', endWord: 'CHINA' };
        case 'medium':
            return { startWord: 'WORDS', endWord: 'OASIS' };
        case 'hard':
            return { startWord: 'WORDS', endWord: 'TAPIR' };
    }
}