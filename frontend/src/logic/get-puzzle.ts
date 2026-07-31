import { Difficulties } from './types';

export function getPuzzle(difficulty: Difficulties) {
    // Temporary while building frontend
    switch (difficulty) {
        case Difficulties.EASY: {
            return { startWord: 'WORDS', endWord: 'CHINA' };
        }

        case Difficulties.MEDIUM: {
            return { startWord: 'WORDS', endWord: 'OASIS' };
        }

        case Difficulties.HARD: {
            return { startWord: 'WORDS', endWord: 'TAPIR' };
        }
    }
}
