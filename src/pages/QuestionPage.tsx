import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { questions } from '../data/questions';
import { useMbtiStore } from '../store/mbtiStore';
import ProgressBar from '../components/ui/ProgressBar';

const QuestionPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const { setAnswer, calculateResult } = useMbtiStore();
    const question = questions[currentStep];

    const handleAnswer = (value: string) => {
        setAnswer(question.id, value);
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            const result = calculateResult();
            navigate(`/result/${result}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <Helmet>
                <title>테스트 진행 중 - MBTI Snap</title>
            </Helmet>
            <div className="w-full max-w-md">
                <ProgressBar current={currentStep + 1} total={questions.length} />
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold mb-8 text-center leading-relaxed">
                            {question.text}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {question.options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleAnswer(option.value)}
                                    className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 px-5 md:py-5 md:px-6 rounded-xl transition-all border border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 text-left text-sm md:text-base"
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default QuestionPage;
