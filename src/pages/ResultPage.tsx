import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Helmet } from 'react-helmet-async';
import { results } from '../data/results';
import { useMbtiStore } from '../store/mbtiStore';

const ResultPage = () => {
    const { mbti } = useParams<{ mbti: string }>();
    const navigate = useNavigate();
    const { reset } = useMbtiStore();
    const resultRef = useRef<HTMLDivElement>(null);

    const result = results[mbti || ''] || {
        title: "알 수 없는 유형",
        description: "결과를 찾을 수 없습니다.",
        tags: [],
    };

    const shareUrl = window.location.href;

    const handleRetest = () => {
        reset();
        navigate('/');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('링크가 복사되었습니다!');
        } catch (err) {
            console.error('Failed to copy link', err);
        }
    };

    const handleDownload = async () => {
        if (resultRef.current) {
            try {
                const canvas = await html2canvas(resultRef.current, {
                    backgroundColor: '#1f2937',
                    scale: 2,
                });
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `mbti_result_${mbti}.png`;
                link.click();
            } catch (err) {
                console.error('Capture failed', err);
                alert('이미지 저장에 실패했습니다.');
            }
        }
    };

    const handleInstagramShare = async () => {
        if (navigator.share && resultRef.current) {
            try {
                const canvas = await html2canvas(resultRef.current, {
                    backgroundColor: '#1f2937',
                    scale: 2,
                });
                const dataUrl = canvas.toDataURL('image/png');
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                const file = new File([blob], `mbti_result_${mbti}.png`, { type: 'image/png' });
                await navigator.share({ files: [file], title: `${mbti} - ${result.title}`, text: result.description, url: shareUrl });
            } catch (err) {
                console.error('Instagram share failed', err);
                // fallback to download
                handleDownload();
                alert('이미지를 저장하고 인스타그램에 업로드하세요.');
            }
        } else {
            // fallback for browsers without share API
            handleDownload();
            alert('이미지를 저장하고 인스타그램에 업로드하세요.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <Helmet>
                <title>{mbti} - 나의 성향 결과 | MBTI Snap</title>
                <meta name="description" content={`${result.title} - ${result.description}`} />
                <meta property="og:title" content={`${mbti} - ${result.title}`} />
                <meta property="og:description" content={result.description} />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md flex flex-col gap-6"
            >
                <div ref={resultRef} className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center border border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <h3 className="text-xl text-gray-400 mb-2 mt-4">나의 성향은?</h3>
                    <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 tracking-tighter">
                        {mbti}
                    </h1>
                    <h2 className="text-2xl font-bold mb-4 text-white">{result.title}</h2>
                    <p className="text-gray-300 mb-8 leading-relaxed">{result.description}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {result.tags.map(tag => (
                            <span key={tag} className="bg-gray-700 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg"
                    >
                        <Download size={20} />
                        이미지 저장
                    </button>
                    <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg"
                    >
                        복사하기
                    </button>
                </div>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={handleInstagramShare}
                        className="flex items-center justify-center gap-2 bg-[#C13584] hover:bg-[#a02e6c] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg w-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5"><path fill="currentColor" d="M224.1 141c-63.6 0-115 51.4-115 115 0 63.6 51.4 115 115 115 63.6 0 115-51.4 115-115 0-63.6-51.4-115-115-115zm0 190c-41.4 0-75-33.6-75-75s33.6-75 75-75 75 33.6 75 75-33.6 75-75 75zm146.4-194.1c0 14.9-12 26.9-26.9 26.9h-26.9c-14.9 0-26.9-12-26.9-26.9v-26.9c0-14.9 12-26.9 26.9-26.9h26.9c14.9 0 26.9 12 26.9 26.9v26.9z" /></svg>
                        인스타그램 공유
                    </button>
                </div>
                <button
                    onClick={handleRetest}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
                >
                    <RefreshCw size={20} />
                    다시 테스트하기
                </button>
            </motion.div>
        </div>
    );
};

export default ResultPage;
