import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Leaf, ThumbsUp, ThumbsDown, Clock, Users, Target, BarChart as ChartBar, MoveRight, Languages } from 'lucide-react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { FlickeringGrid } from './components/ui/flickering-grid';
import { translations } from './translations';
import { recommendedTimes } from './config/times';
import { getTodayVotes, submitVote } from './api/flavoria';

const DEVICE_ID_MAP: Record<string, number> = {
  'medbc': 1,
  'medd': 2,
  'lighthouse': 3,
  'lift': 4
};

const VALID_DEVICE_IDS = Object.keys(DEVICE_ID_MAP);
const DEFAULT_DEVICE_ID = 'medbc';

function App() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [vote, setVote] = useState<'YES' | 'NO' | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [showSadEmoji, setShowSadEmoji] = useState(false);
  const [showHappyEmoji, setShowHappyEmoji] = useState(false);
  const [language, setLanguage] = useState<'fi' | 'en'>('fi');
  const [currentVotes, setCurrentVotes] = useState({
    total: 0,
    yes: 0,
    no: 0
  });

  useEffect(() => {
    if (!deviceId || !VALID_DEVICE_IDS.includes(deviceId)) {
      navigate(`/${DEFAULT_DEVICE_ID}`, { replace: true });
    }
  }, [deviceId, navigate]);

  const fetchVotes = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const votes = await getTodayVotes(today);
      const yesVotes = votes.filter((v: any) => v.answer).length;
      const noVotes = votes.filter((v: any) => !v.answer).length;
      setCurrentVotes({
        total: votes.length,
        yes: yesVotes,
        no: noVotes
      });
    } catch (error) {
      console.error('Error fetching votes:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  useEffect(() => {
    fetchVotes();
    const interval = setInterval(fetchVotes, 60000);
    return () => clearInterval(interval);
  }, []);

  const isAskingForTomorrow = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours >= 13 || (hours === 13 && minutes >= 30);
  };

  const t = translations[language];
  const dailyGoal = 100;

  const getRecommendedTimes = () => {
    const now = new Date();
    const day = now.getDay();
    const nextDay = day + 1;
    const adjustedNextDay = nextDay > 5 ? 1 : nextDay;
    const adjustedToday = day === 0 || day === 6 ? 5 : day;
    
    if (vote === 'NO' || (vote === 'YES' && isAskingForTomorrow())) {
      return recommendedTimes[adjustedNextDay as keyof typeof recommendedTimes];
    } else {
      return recommendedTimes[adjustedToday as keyof typeof recommendedTimes];
    }
  };

  useEffect(() => {
    if (language === 'en') {
      const timer = setTimeout(() => {
        setLanguage('fi');
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [language]);

  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 45,
    elementCount: 200,
    dragFriction: 0.1,
    duration: 3000,
    stagger: 0,
    width: "10px",
    height: "10px",
    colors: ["#4ade80", "#22c55e", "#16a34a", "#15803d"]
  };

  const handleVote = async (isYes: boolean) => {
    if (!deviceId || !DEVICE_ID_MAP[deviceId]) {
      console.error('Invalid device ID');
      return;
    }

    try {
      await submitVote(isYes, DEVICE_ID_MAP[deviceId]);
      await fetchVotes();
      
      const voteType = isYes ? 'YES' : 'NO';
      setVote(voteType);
      
      if (isYes) {
        setTriggerConfetti(true);
        setShowHappyEmoji(true);
        setTimeout(() => setTriggerConfetti(false), 100);
      } else {
        setShowSadEmoji(true);
      }
    } catch (error) {
      console.error('Error submitting vote:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  useEffect(() => {
    if (vote) {
      setShowRecommendations(true);
      const timer = setTimeout(() => {
        setShowRecommendations(false);
        setShowSadEmoji(false);
        setShowHappyEmoji(false);
        setVote(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [vote]);

  const ProgressBar = ({ current, total }: { current: number; total: number }) => {
    const percentage = (current / total) * 100;
    const getProgressColor = (percentage: number) => {
      if (percentage < 50) return 'bg-red-500';
      if (percentage < 80) return 'bg-yellow-500';
      return 'bg-green-500';
    };

    return (
      <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-out ${getProgressColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen w-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fff5e6 0%, #ffecd9 50%, #ffe6cc 100%)'
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80"
        alt=""
        className="absolute -top-40 -right-40 w-[600px] h-[600px] object-cover rotate-45 opacity-10 animate-float hidden lg:block"
      />
      <img
        src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80"
        alt=""
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] object-cover -rotate-45 opacity-10 animate-float hidden lg:block"
        style={{ animationDelay: '1.5s' }}
      />
      
      <ReactCanvasConfetti
        fire={triggerConfetti}
        reset={!triggerConfetti}
        {...confettiConfig}
        className="fixed w-full h-full top-0 left-0 pointer-events-none z-50"
      />
      
      <div className="w-[90%] h-[90%] bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 p-4 md:p-8 lg:p-12 relative z-10">
        <div className="flex flex-col h-full">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLanguage(language === 'fi' ? 'en' : 'fi')}
              className="bg-white/80 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg hover:bg-white transition-colors flex items-center gap-2 group text-sm md:text-base"
            >
              <Languages className="w-4 h-4 md:w-5 md:h-5 text-green-700 group-hover:rotate-180 transition-transform duration-300" />
              <span className="text-green-700 font-medium">{t.switchLanguage}</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-800 text-center px-4">
                  {isAskingForTomorrow() ? t.titleTomorrow : t.titleToday}
                </h2>
                
                <div className="relative flex items-center justify-center gap-2 text-base md:text-xl text-green-600">
                  <FlickeringGrid
                    className="absolute inset-0 w-full h-full opacity-5"
                    squareSize={1}
                    gridGap={2}
                    color="#166534"
                    maxOpacity={0.8}
                    flickerChance={0.3}
                  />
                  <Users className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="relative z-10">{t.joinOthers.replace('{count}', currentVotes.total.toString())}</span>
                </div>
              </div>
              
              <div className="flex-1 flex items-center justify-center min-h-[200px] md:min-h-[300px]">
                {!showRecommendations ? (
                  <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 mx-auto relative w-full md:w-auto">
                    <div className="hidden lg:flex absolute -left-80 top-1/2 -translate-y-1/2 items-center">
                      <span className="text-3xl md:text-4xl font-bold text-blue-800 whitespace-pre-line text-center animate-flicker">{t.tapToVote}</span>
                    </div>
                    <div className="hidden lg:flex absolute -right-80 top-1/2 -translate-y-1/2 items-center">
                      <span className="text-3xl md:text-4xl font-bold text-blue-800 whitespace-pre-line text-center animate-flicker">{t.tapToVote}</span>
                    </div>

                    <div className="hidden md:block absolute -left-16 top-1/2 -translate-y-1/2 transform rotate-[-30deg]">
                      <MoveRight className="w-12 h-12 text-green-600 animate-arrow" />
                    </div>
                    <div className="hidden md:block absolute -right-16 top-1/2 -translate-y-1/2 transform rotate-[30deg] scale-x-[-1]">
                      <MoveRight className="w-12 h-12 text-rose-600 animate-arrow" />
                    </div>

                    {[
                      { text: t.yes, icon: ThumbsUp, color: 'green', isYes: true },
                      { text: t.no, icon: ThumbsDown, color: 'rose', isYes: false }
                    ].map(({ text, icon: Icon, color, isYes }) => (
                      <button
                        key={text}
                        onClick={() => handleVote(isYes)}
                        className={`
                          group relative px-6 md:px-12 py-8 md:py-10 rounded-2xl transition-all duration-300
                          w-full md:w-64 h-40 md:h-48 flex flex-col items-center justify-center gap-4
                          bg-white text-${color}-700 border-3 border-${color}-200 hover:border-${color}-400 hover:shadow-lg
                          button-bounce
                        `}
                        style={{
                          animationDelay: !isYes ? '0.5s' : '0s'
                        }}
                      >
                        <Icon className="w-16 h-16 md:w-20 md:h-20 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-3xl md:text-4xl font-bold">{text}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="animate-appear space-y-6 md:space-y-8 text-center w-full">
                    {showHappyEmoji && (
                      <div className="text-6xl md:text-8xl animate-bounce mb-4 md:mb-8">😊</div>
                    )}
                    {showSadEmoji && (
                      <div className="text-6xl md:text-8xl animate-bounce mb-4 md:mb-8">😢</div>
                    )}
                    <div className="space-y-4 md:space-y-6">
                      <h3 className="text-xl md:text-3xl font-semibold text-green-700 flex items-center justify-center gap-3">
                        <Clock className="w-6 h-6 md:w-8 md:h-8" />
                        {(vote === 'NO' || (vote === 'YES' && isAskingForTomorrow())) ? t.considerTimes : t.recommendedTimes}
                      </h3>
                      
                      <div className="space-y-3 md:space-y-4">
                        {(() => {
                          const times = getRecommendedTimes();
                          return [times.early, times.late].map((time) => (
                            <div
                              key={time}
                              className="text-xl md:text-2xl font-bold text-green-800 py-3 md:py-4 px-6 md:px-8 bg-green-50 rounded-xl border-2 border-green-100 hover:border-green-200 transition-colors"
                            >
                              {time}
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between text-base md:text-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <Target className="w-4 h-4 md:w-5 md:h-5" />
                    <span>{t.todaysGoal.replace('{count}', dailyGoal.toString())}</span>
                  </div>
                  <span className="text-green-600 font-semibold">
                    {currentVotes.total} / {dailyGoal}
                  </span>
                </div>
                <ProgressBar current={currentVotes.total} total={dailyGoal} />
              </div>
            </div>
            
            <div className="space-y-4 md:space-y-6 pt-4 md:pt-6 border-t border-green-100 mt-6 md:mt-8">
              <div className="bg-green-50 rounded-xl p-4 md:p-6 transform hover:scale-102 transition-transform duration-300">
                <div className="flex items-center justify-center gap-2 md:gap-3">
                  <div className="relative">
                    <FlickeringGrid
                      className="absolute inset-0 w-full h-full opacity-10"
                      squareSize={2}
                      gridGap={2}
                      color="#166534"
                      maxOpacity={0.5}
                      flickerChance={0.2}
                    />
                    <ChartBar className="relative z-10 w-6 h-6 md:w-8 md:h-8 text-green-600" />
                  </div>
                  <p className="text-lg md:text-xl font-semibold text-green-800">
                    {t.seeTimesAfterVoting}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 md:gap-3">
                <Leaf className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                <p className="text-base md:text-lg text-gray-600 max-w-2xl text-center">
                  {t.helpMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;