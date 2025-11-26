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
                    scale: 4, // 고해상도
                    width: resultRef.current.offsetWidth,
                    height: resultRef.current.offsetHeight,
                    useCORS: true,
                    logging: false,
                });
                const image = canvas.toDataURL('image/png', 1.0);
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

    const handleKakaoShare = async () => {
        if (!resultRef.current) return;

        const shareText = `${mbti} - ${result.title}\n\n${result.description}\n\n나의 성향 테스트 결과를 확인해보세요!\n테스트 하기: ${shareUrl}`;
        
        try {
            // 결과 이미지 생성 (고해상도)
            const canvas = await html2canvas(resultRef.current, {
                backgroundColor: '#1f2937',
                scale: 4, // 해상도 4배 증가
                width: resultRef.current.offsetWidth,
                height: resultRef.current.offsetHeight,
                useCORS: true,
                logging: false,
                windowWidth: resultRef.current.scrollWidth,
                windowHeight: resultRef.current.scrollHeight,
            });
            const dataUrl = canvas.toDataURL('image/png', 1.0); // 최고 품질
            
            // Data URL을 Blob으로 변환
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], `mbti_result_${mbti}.png`, { type: 'image/png' });

            // Web Share API 사용 (이미지와 텍스트 함께 공유)
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        text: shareText,
                        title: `${mbti} - ${result.title}`,
                    });
                    return;
                } catch (shareError: any) {
                    // 사용자가 공유를 취소한 경우
                    if (shareError.name === 'AbortError') {
                        return;
                    }
                    console.log('Web Share API failed, trying fallback:', shareError);
                }
            }

            // Web Share API가 지원되지 않거나 실패한 경우, 카카오톡 앱 직접 호출
            if (/Android/i.test(navigator.userAgent)) {
                // Android: 카카오톡 앱으로 이미지와 텍스트 공유
                // 클립보드에 텍스트 복사
                try {
                    await navigator.clipboard.writeText(shareText);
                } catch (e) {
                    console.error('Clipboard write failed:', e);
                }
                
                // 이미지 다운로드
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `mbti_result_${mbti}.png`;
                link.click();
                
                // 카카오톡 앱 열기 시도
                let appOpened = false;
                const startTime = Date.now();
                
                // 페이지 포커스 이벤트로 앱이 열렸는지 확인
                const checkAppOpened = () => {
                    const elapsed = Date.now() - startTime;
                    if (elapsed < 2000) {
                        appOpened = true;
                    }
                };
                
                window.addEventListener('blur', checkAppOpened);
                
                // 카카오톡 앱 열기
                try {
                    window.location.href = `kakaotalk://send?text=${encodeURIComponent(shareText)}`;
                } catch (e) {
                    console.error('Failed to open KakaoTalk app:', e);
                }
                
                // 앱이 열리지 않으면 웹으로 폴백
                setTimeout(() => {
                    window.removeEventListener('blur', checkAppOpened);
                    if (!appOpened) {
                        // 카카오톡 웹 공유로 폴백
                        window.open(`https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
                    }
                }, 1000);
            } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                // iOS: 카카오톡 앱으로 공유
                // 클립보드에 텍스트 복사
                try {
                    await navigator.clipboard.writeText(shareText);
                } catch (e) {
                    console.error('Clipboard write failed:', e);
                }
                
                // 이미지 다운로드
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `mbti_result_${mbti}.png`;
                link.click();
                
                // 카카오톡 앱 열기
                const kakaoAppUrl = `kakaotalk://send?text=${encodeURIComponent(shareText)}`;
                window.location.href = kakaoAppUrl;
                
                // 앱이 열리지 않으면 웹으로 폴백
                setTimeout(() => {
                    window.open(`https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
                }, 500);
            } else {
                // 데스크톱: 이미지 다운로드 후 카카오톡 웹 공유
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `mbti_result_${mbti}.png`;
                link.click();
                
                // 클립보드에 텍스트 복사
                try {
                    await navigator.clipboard.writeText(shareText);
                    alert('이미지가 저장되고 링크가 복사되었습니다. 카카오톡에서 이미지와 링크를 붙여넣어 공유하세요!');
                } catch (e) {
                    window.open(`https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
                }
            }
        } catch (err) {
            console.error('Kakao share failed:', err);
            // 최종 폴백: 텍스트만 공유
            const fallbackText = `${mbti} - ${result.title}\n${shareUrl}`;
            if (/Android/i.test(navigator.userAgent)) {
                // Android: kakaotalk:// 스킴 직접 사용
                try {
                    window.location.href = `kakaotalk://send?text=${encodeURIComponent(fallbackText)}`;
                    setTimeout(() => {
                        window.open(`https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fallbackText)}`, '_blank');
                    }, 1000);
                } catch (e) {
                    window.open(`https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fallbackText)}`, '_blank');
                }
            } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                window.location.href = `kakaotalk://send?text=${encodeURIComponent(fallbackText)}`;
                setTimeout(() => {
                    window.open(`https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fallbackText)}`, '_blank');
                }, 500);
            } else {
                window.open(`https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fallbackText)}`, '_blank');
            }
        }
    };

    const handleInstagramShare = async () => {
        // 인스타그램은 직접 공유가 불가능하므로 이미지를 다운로드
        if (resultRef.current) {
            try {
                const canvas = await html2canvas(resultRef.current, {
                    backgroundColor: '#1f2937',
                    scale: 4, // 고해상도
                    width: resultRef.current.offsetWidth,
                    height: resultRef.current.offsetHeight,
                    useCORS: true,
                    logging: false,
                });
                const image = canvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                link.href = image;
                link.download = `mbti_result_${mbti}.png`;
                link.click();
                
                // 모바일에서 인스타그램 앱 열기 시도
                if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                    setTimeout(() => {
                        window.location.href = 'instagram://camera';
                    }, 500);
                } else if (/Android/i.test(navigator.userAgent)) {
                    setTimeout(() => {
                        window.location.href = 'intent://instagram.com/#Intent;package=com.instagram.android;scheme=https;end';
                    }, 500);
                } else {
                    alert('이미지가 저장되었습니다. 인스타그램에 업로드해주세요!');
                }
            } catch (err) {
                console.error('Instagram share failed', err);
                alert('이미지 저장에 실패했습니다.');
            }
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
                className="w-full max-w-lg flex flex-col gap-6"
            >
                <div ref={resultRef} className="bg-gray-800 p-10 rounded-2xl shadow-2xl text-center border border-gray-700 relative overflow-hidden min-w-[400px]">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <h3 className="text-xl text-white mb-2 mt-4 font-semibold">나의 성향은?</h3>
                    <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 tracking-tighter">
                        {mbti}
                    </h1>
                    <h2 className="text-2xl font-bold mb-4 text-white">{result.title}</h2>
                    <p className="text-gray-300 mb-8 leading-relaxed">{result.description}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {result.tags.map(tag => (
                            <span key={tag} className="bg-gray-700 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="mt-4 pt-6 border-t border-gray-700">
                        <p className="text-lg font-bold text-white mb-3">너도 해볼래?</p>
                        <p className="text-base text-blue-300 break-all font-medium px-2">{shareUrl}</p>
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
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleKakaoShare}
                        className="flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] font-bold py-3 px-4 rounded-xl transition-colors shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                            <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.78-.123 4.75 4.75 0 0 1-3.847 2.123l-3.423.607a.5.5 0 0 1-.448-.723l1.12-2.24A9.25 9.25 0 0 1 1.5 11.185C1.5 6.665 6.201 3 12 3Z"/>
                        </svg>
                        카카오톡
                    </button>
                    <button
                        onClick={handleInstagramShare}
                        className="flex items-center justify-center gap-2 bg-[#C13584] hover:bg-[#a02e6c] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5" fill="currentColor">
                            <path d="M224.1 141c-63.6 0-115 51.4-115 115 0 63.6 51.4 115 115 115 63.6 0 115-51.4 115-115 0-63.6-51.4-115-115-115zm0 190c-41.4 0-75-33.6-75-75s33.6-75 75-75 75 33.6 75 75-33.6 75-75 75zm146.4-194.1c0 14.9-12 26.9-26.9 26.9h-26.9c-14.9 0-26.9-12-26.9-26.9v-26.9c0-14.9 12-26.9 26.9-26.9h26.9c14.9 0 26.9 12 26.9 26.9v26.9zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                        </svg>
                        인스타그램
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
