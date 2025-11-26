import { create } from 'zustand';
import { questions } from '../data/questions';

interface MbtiState {
    answers: Record<number, string>;
    setAnswer: (questionId: number, value: string) => void;
    reset: () => void;
    calculateResult: () => string;
}

export const useMbtiStore = create<MbtiState>((set, get) => ({
    answers: {},
    setAnswer: (questionId, value) =>
        set((state) => ({ answers: { ...state.answers, [questionId]: value } })),
    reset: () => set({ answers: {} }),
    calculateResult: () => {
        const { answers } = get();
        const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

        questions.forEach((q) => {
            const answer = answers[q.id];
            if (answer && answer in scores) {
                scores[answer as keyof typeof scores]++;
            }
        });

        const mbti = [
            scores.E >= scores.I ? 'E' : 'I',
            scores.S >= scores.N ? 'S' : 'N',
            scores.T >= scores.F ? 'T' : 'F',
            scores.J >= scores.P ? 'J' : 'P',
        ].join('');

        return mbti;
    },
}));
