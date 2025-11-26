import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
            <Helmet>
                <title>MBTI Snap - 5분 성향 테스트</title>
                <meta name="description" content="10문항으로 알아보는 나의 성향 테스트" />
                <meta property="og:title" content="MBTI Snap - 5분 성향 테스트" />
                <meta property="og:description" content="10문항으로 알아보는 나의 성향 테스트" />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    MBTI Snap
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    5분 안에 알아보는 나의 성향 테스트
                </p>

                <Link to="/test">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 md:py-4 md:px-10 rounded-full shadow-lg hover:shadow-xl transition-all text-lg md:text-xl"
                    >
                        시작하기
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
};

export default HomePage;
