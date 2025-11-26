
import { motion } from 'framer-motion';

interface ProgressBarProps {
    current: number;
    total: number;
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
    const progress = (current / total) * 100;
    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-8">
            <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
                {current} / {total}
            </div>
        </div>
    );
};

export default ProgressBar;
