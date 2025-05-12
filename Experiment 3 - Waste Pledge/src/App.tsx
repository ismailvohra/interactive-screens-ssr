import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Globe } from 'lucide-react';
import { translations, messages, type Language } from './translations';
import knifeImage from './assets/knife.png';

const FOOD_ITEMS = [
  {
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&q=80&w=1000',
    name: 'tomato'
  },
  {
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1000',
    name: 'bread'
  },
  {
    image: 'https://images.unsplash.com/photo-1678007699401-170ec162b60c?auto=format&fit=crop&q=80&w=1000',
    name: 'pizza'
  }
];

type Version = 'medd' | 'dininghall' | 'tablet';

const DEVICE_IDS: Record<Version, number> = {
  medd: 1,
  dininghall: 2,
  tablet: 3
};

function App() {
  const [isSlicing, setIsSlicing] = useState(false);
  const [isCut, setIsCut] = useState(false);
  const [startY, setStartY] = useState(0);
  const [knifePosition, setKnifePosition] = useState(0);
  const [participants, setParticipants] = useState(0);
  const [fact, setFact] = useState('');
  const [language, setLanguage] = useState<Language>('fi');
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const [hasPledged, setHasPledged] = useState(false);
  const [showPledgeThankYou, setShowPledgeThankYou] = useState(false);
  const [version, setVersion] = useState<Version>('medd');
  const rightHalfControls = useAnimation();
  const messageControls = useAnimation();
  const knifeControls = useAnimation();
  const hintControls = useAnimation();
  const sliceAreaRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();
  const languageTimeoutRef = useRef<NodeJS.Timeout>();
  const participantCountIntervalRef = useRef<NodeJS.Timeout>();

  const fetchParticipantCount = async () => {
    try {
      const response = await fetch(''); // Replace with actual API endpoint
      // Example: const response = await fetch('https://api.example.com/experiment3-1');
      if (!response.ok) {
        console.error('Failed to fetch participant count');
        return;
      }
      const data = await response.json();
      setParticipants(data.length);
    } catch (error) {
      console.error('Error fetching participant count:', error);
    }
  };

  useEffect(() => {
    // Fetch initial count
    fetchParticipantCount();

    // Set up interval to fetch count every 5 minutes
    participantCountIntervalRef.current = setInterval(fetchParticipantCount, 5 * 60 * 1000);

    return () => {
      if (participantCountIntervalRef.current) {
        clearInterval(participantCountIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(2); // Remove '/#'
      if (hash === 'medd' || hash === 'dininghall' || hash === 'tablet') {
        setVersion(hash as Version);
      } else {
        window.location.hash = '/medd';
      }
    };

    // Handle initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const t = translations[language];
  const currentFood = FOOD_ITEMS[currentFoodIndex];
  const currentMessage = messages[currentFood.name as keyof typeof messages][language];
  const CUTTING_THRESHOLD = 25;

  useEffect(() => {
    if (language === 'en') {
      languageTimeoutRef.current = setTimeout(() => {
        setLanguage('fi');
      }, 30000);
    }

    return () => {
      if (languageTimeoutRef.current) {
        clearTimeout(languageTimeoutRef.current);
      }
    };
  }, [language]);

  useEffect(() => {
    if (!isSlicing) {
      const animation = {
        y: ["0%", "20%", "0%"],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1
        }
      };

      knifeControls.start(animation);
      hintControls.start(animation);
    }
  }, [isSlicing, knifeControls, hintControls, currentFoodIndex]);

  const saveSliceData = async () => {
    try {
      const data = {
        created: new Date().toISOString(),
        deviceid: DEVICE_IDS[version],
        dish: currentFood.name
      };

      const response = await fetch('', // Replace with actual API endpoint
        // Example: const response = await fetch('https://api.example.com/experiment3-2');
         {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.error('Failed to save slice data');
        return;
      }

      // Fetch updated count after successful slice
      await fetchParticipantCount();
    } catch (error) {
      console.error('Error saving slice data:', error);
    }
  };

  const savePledgeData = async () => {
    try {
      const data = {
        created: new Date().toISOString(),
        deviceid: DEVICE_IDS[version],
        dish: currentFood.name
      };

      const response = await fetch('https://dfapi.tt.utu.fi/study_2025_3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.error('Failed to save pledge data');
      }
    } catch (error) {
      console.error('Error saving pledge data:', error);
    }
  };

  useEffect(() => {
    if (isCut) {
      transitionTimeoutRef.current = setTimeout(() => {
        messageControls.start({ opacity: 0 }).then(() => {
          setCurrentFoodIndex((prev) => (prev + 1) % FOOD_ITEMS.length);
          setIsCut(false);
          setKnifePosition(0);
          setHasPledged(false);
          setShowPledgeThankYou(false);
          rightHalfControls.set({ x: 0, rotate: 0 });
          knifeControls.start({
            y: ["0%", "20%", "0%"],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1
            }
          });
        });
      }, 10000);
    }
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [isCut, rightHalfControls, messageControls, knifeControls]);

  const handleInteractionEnd = () => {
    if (isSlicing) {
      setIsSlicing(false);
      if (knifePosition > CUTTING_THRESHOLD) {
        setIsCut(true);
        setFact(t.facts[Math.floor(Math.random() * t.facts.length)]);
        rightHalfControls.start({
          x: '100%',
          rotate: 15,
          transition: { duration: 0.8, ease: "easeInOut" }
        });
        saveSliceData();
      } else {
        setKnifePosition(0);
        knifeControls.start({
          y: ["0%", "20%", "0%"],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1
          }
        });
      }
    }
  };

  useEffect(() => {
    const handleMouseUp = () => handleInteractionEnd();
    const handleTouchEnd = () => handleInteractionEnd();

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isSlicing, knifePosition, rightHalfControls, knifeControls, t.facts]);

  const handleInteractionStart = (clientY: number) => {
    if (isCut) return;
    setIsSlicing(true);
    setStartY(clientY);
    knifeControls.stop();
    hintControls.stop();
  };

  const handleInteractionMove = (clientY: number) => {
    if (!isSlicing || isCut) return;

    const rect = sliceAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const distance = clientY - startY;
    const percentage = Math.min(100, Math.max(0, (distance / rect.height) * 100));
    
    setKnifePosition(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleInteractionStart(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleInteractionMove(e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleInteractionStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleInteractionMove(e.touches[0].clientY);
  };

  const toggleLanguage = () => {
    if (languageTimeoutRef.current) {
      clearTimeout(languageTimeoutRef.current);
    }
    setLanguage(prev => prev === 'fi' ? 'en' : 'fi');
  };

  const handlePledge = async () => {
    setHasPledged(true);
    setShowPledgeThankYou(true);
    await savePledgeData();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-radial from-amber-50 via-amber-100 to-amber-200 flex flex-col items-center justify-between">
      <div className="w-full flex items-center justify-between px-6 py-4">
        <div className="relative text-center flex-1 max-w-[calc(100%-11rem)]">
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm -z-10 rounded-3xl transform -skew-y-2" />
          <h1 className="text-5xl font-black text-amber-800 mb-2">
            {t.title}
          </h1>
          <div className="text-2xl font-medium text-amber-700 whitespace-nowrap flex items-center justify-center gap-2">
            <Heart className="text-red-500 w-6 h-6" />
            <span>
              <strong>{participants.toLocaleString()}</strong> {t.participantsText}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="bg-white/90 hover:bg-white text-amber-800 px-6 py-2.5 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2 font-medium shrink-0"
          onClick={toggleLanguage}
        >
          <Globe className="w-4 h-4" />
          {t.switchLanguage}
        </Button>
      </div>

      <div className="flex-1 w-full flex items-center">
        <div 
          className="relative w-screen h-[80vh]"
          ref={sliceAreaRef}
        >
          <motion.div
            className="absolute left-0 top-0 w-1/2 h-full overflow-hidden"
            style={{
              borderTopRightRadius: '2rem',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
            }}
          >
            <motion.div 
              className="absolute top-0 left-0 w-[200%] h-full bg-cover"
              style={{ 
                backgroundImage: `url(${currentFood.image})`,
                backgroundPosition: "0% center",
                filter: 'brightness(1.1) contrast(1.1)'
              }}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          <motion.div
            className="absolute right-0 top-0 w-1/2 h-full overflow-hidden"
            animate={rightHalfControls}
            style={{
              borderTopLeftRadius: '2rem',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
            }}
          >
            <motion.div 
              className="absolute top-0 right-0 w-[200%] h-full bg-cover"
              style={{ 
                backgroundImage: `url(${currentFood.image})`,
                backgroundPosition: "100% center",
                filter: 'brightness(1.1) contrast(1.1)'
              }}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          {/* Thank you message */}
          <AnimatePresence>
            {isCut && (
              <motion.div
                className="fixed top-0 right-0 w-1/2 h-full flex items-center justify-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md mx-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="text-red-500 w-10 h-10 animate-pulse" />
                    <h2 className="text-4xl font-bold text-amber-800">{t.thankYou}</h2>
                  </div>
                  <div className="space-y-4">
                    <p className="text-2xl text-amber-700 font-medium">
                      {currentMessage.title}
                    </p>
                    <p className="text-lg text-amber-600">
                      {currentMessage.description}
                    </p>
                    {!hasPledged && (
                      <div className="mt-6 space-y-4">
                        <p className="text-lg text-amber-700 italic">
                          {t.takePledge}
                        </p>
                        <Button
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                          onClick={handlePledge}
                        >
                          {t.pledgeButton}
                        </Button>
                      </div>
                    )}
                    {showPledgeThankYou && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl text-amber-700 font-medium text-center mt-4"
                      >
                        {t.pledgeThankYou}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isCut && (
            <motion.div 
              className="absolute inset-0 z-20"
              initial={false}
              animate={{ 
                clipPath: `inset(${knifePosition}% 0 0 0)`
              }}
            >
              <div 
                className="absolute left-1/2 top-[48px] h-[calc(100%-48px)] -translate-x-[7.5px] w-[15px] group"
                style={{
                  backgroundImage: `repeating-linear-gradient(180deg, 
                    #000,
                    #000 8px,
                    transparent 8px,
                    transparent 16px
                  )`,
                  opacity: 0.5,
                  transition: 'opacity 0.3s ease'
                }}
              />
            </motion.div>
          )}

          {!isCut && (
            <>
              <motion.div
                className="absolute left-1/2 -ml-[162px] w-[324px] cursor-ns-resize z-30 group touch-none"
                style={{ 
                  top: isSlicing ? `${knifePosition}%` : "0%",
                  transform: 'translateY(-25%)'
                }}
                animate={knifeControls}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                {/* Slide down hint */}
                {!isSlicing && (
                  <motion.div
                    className="absolute left-[60%] -translate-x-1/2 -top-5 z-40 pointer-events-none"
                    animate={hintControls}
                  >
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                      <span className="text-2xl">👇</span>
                      <span className="text-amber-800 font-medium">{t.slideDown}</span>
                    </div>
                  </motion.div>
                )}
                <div className="relative">
                  <div className="absolute inset-0 blur-sm bg-amber-400/30 rounded-full transform scale-105" />
                  <img 
                    src={knifeImage}
                    alt="Knife"
                    className="w-[324px] h-[324px] transform rotate-[0.139626rad] relative transition-transform group-hover:scale-110"
                    style={{
                      filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1))'
                    }}
                    draggable="false"
                  />
                </div>
              </motion.div>
              <div
                className="absolute left-1/2 top-0 w-[324px] h-full -ml-[162px] cursor-ns-resize z-30 touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;