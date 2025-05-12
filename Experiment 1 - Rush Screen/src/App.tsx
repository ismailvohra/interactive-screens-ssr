import React, { useState, useEffect } from 'react';
import { Clock, Timer, Calendar } from 'lucide-react';

const translations = {
  en: {
    title: "Flavoria Lunch: Skip the Rush Hours",
    waitTime: "Current Wait Time",
    noWait: "No Wait",
    shortWait: "5 minutes",
    longWait: "10+ minutes",
    estimatedWait: "Estimated waiting period",
    bestTime: "Best Time for Lunch Today",
    earlyLunch: "Early Lunch",
    lateLunch: "Late Lunch",
    quiet: "Quiet",
    moderate: "Moderate",
    busy: "Busy",
    closed: "Lunch is served Monday to Friday 10:30 to 13:30",
    disclaimer: "Dining Flow is currently piloting various communication and feedback channels in Q1-Q2 of 2025."
  },
  fi: {
    title: "Flavoria-lounas: Vältä ruuhkat!",
    waitTime: "Nykyinen odotusaika",
    noWait: "Ei odottelua",
    shortWait: "5 minuuttia",
    longWait: "10+ minuuttia",
    estimatedWait: "Arvioitu odotusaika",
    bestTime: "Paras aika tulla lounaalle",
    earlyLunch: "aikainen lounas",
    lateLunch: "myöhäinen lounas",
    quiet: "rauhallista",
    moderate: "kohtalaista",
    busy: "kiireistä",
    closed: "Lounas tarjoillaan maanantaista perjantaihin klo 10:30-13:30",
    disclaimer: "Dining Flow pilotoi erilaisia viestintä- ja palautekanavia Q1-Q2 2025."
  }
};

const recommendedTimes = {
  1: { // Monday
    early: "10:30 - 10:45",
    late: "12:30 - 12:45"
  },
  2: { // Tuesday
    early: "10:35 - 10:50",
    late: "12:45 - 13:00"
  },
  3: { // Wednesday
    early: "10:40 - 10:55",
    late: "12:40 - 12:55"
  },
  4: { // Thursday
    early: "10:45 - 11:00",
    late: "12:45 - 13:00"
  },
  5: { // Friday
    early: "10:30 - 10:45",
    late: "12:30 - 12:45"
  }
};

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rushLevel, setRushLevel] = useState(0);
  const [language, setLanguage] = useState('en');
  const [flicker, setFlicker] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const timeInMinutes = hours * 60 + minutes;
      
      // Restaurant is open 10:30 - 13:30
      if (timeInMinutes >= 10 * 60 + 30 && timeInMinutes <= 13 * 60 + 30) {
        if (
          (timeInMinutes >= 10 * 60 + 30 && timeInMinutes < 11 * 60) || // 10:30-11:00
          (timeInMinutes >= 12 * 60 + 15 && timeInMinutes < 12 * 60 + 30) // 12:15-12:30
        ) {
          setRushLevel(50); // Moderate
        } else if (timeInMinutes >= 11 * 60 && timeInMinutes < 12 * 60 + 15) { // 11:00-12:15
          setRushLevel(100); // Busy
        } else { // 12:30-13:30
          setRushLevel(20); // Quiet
        }
      } else {
        setRushLevel(0); // Outside lunch hours
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const languageTimer = setInterval(() => {
      setLanguage(prev => prev === 'en' ? 'fi' : 'en');
    }, 60000);

    return () => clearInterval(languageTimer);
  }, []);

  // Simple flicker effect
  useEffect(() => {
    const flickerTimer = setInterval(() => {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 1000); // Stay dim for 1 second
    }, 3000); // Flicker every 3 seconds

    return () => clearInterval(flickerTimer);
  }, []);

  const getWaitTime = () => {
    const t = translations[language];
    if (rushLevel <= 20) return t.noWait;
    if (rushLevel <= 50) return t.shortWait;
    return t.longWait;
  };

  const getRushStatus = () => {
    const t = translations[language];
    if (rushLevel <= 20) return t.quiet;
    if (rushLevel <= 50) return t.moderate;
    return t.busy;
  };

  const isLunchHours = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    return timeInMinutes >= 10 * 60 + 30 && timeInMinutes <= 13 * 60 + 30;
  };

  const getCurrentDayTimes = () => {
    const day = currentTime.getDay(); // 0 is Sunday, 1 is Monday, etc.
    return recommendedTimes[day as keyof typeof recommendedTimes] || null;
  };

  const t = translations[language];
  const dayTimes = getCurrentDayTimes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-[90vw] min-h-[90vh] bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10">
        {/* Header with Title and Clock */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">{t.title}</h1>
          <div className="flex items-center space-x-3 text-gray-600">
            <Clock className="w-8 h-8" />
            <span className="text-2xl">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          </div>
        </div>

        {isLunchHours() && dayTimes ? (
          <>
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
              {/* Wait Time */}
              <div className="bg-gray-50/90 backdrop-blur-sm rounded-xl p-10 shadow-sm">
                <div className="flex items-center space-x-4 mb-8">
                  <Timer className="w-10 h-10 text-gray-600" />
                  <h2 className="text-3xl font-semibold text-gray-800">{t.waitTime}</h2>
                </div>
                <p className="text-5xl font-bold text-gray-800">{getWaitTime()}</p>
                <p className="text-gray-600 mt-4 text-xl">{t.estimatedWait}</p>
              </div>

              {/* Best Times */}
              <div className="bg-gray-50/90 backdrop-blur-sm rounded-xl p-10 shadow-sm">
                <div className="flex items-center space-x-4 mb-8">
                  <Calendar className="w-10 h-10 text-gray-600" />
                  <h2 className="text-3xl font-semibold text-gray-800">{t.bestTime}</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center bg-gray-100/90 backdrop-blur-sm rounded-lg p-5">
                    <span className="text-3xl font-bold text-gray-900">{dayTimes.early}</span>
                    <span className="ml-6 px-6 py-3 bg-green-100 text-green-800 rounded-md font-medium text-xl">
                      ({t.earlyLunch})
                    </span>
                  </div>
                  <div className="flex items-center bg-gray-100/90 backdrop-blur-sm rounded-lg p-5">
                    <span className="text-3xl font-bold text-gray-900">{dayTimes.late}</span>
                    <span className="ml-6 px-6 py-3 bg-green-100 text-green-800 rounded-md font-medium text-xl">
                      ({t.lateLunch})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rush Level Gauge */}
            <div className="mb-12">
              <div className="h-36 bg-gray-200 rounded-2xl overflow-hidden relative">
                <div
                  className="h-full transition-all duration-1000 ease-in-out flex items-center justify-center"
                  style={{
                    width: `${rushLevel}%`,
                    backgroundColor: rushLevel <= 20
                      ? '#22c55e'
                      : rushLevel <= 50
                      ? '#eab308'
                      : '#ef4444',
                    opacity: flicker ? 0.5 : 1
                  }}
                >
                  <span 
                    className="text-black font-semibold text-4xl z-10 absolute left-1/2 transform -translate-x-1/2"
                  >
                    {getRushStatus()}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Closed Message */}
            <div className="text-4xl font-bold text-center text-gray-800 mb-16">
              {t.closed}
            </div>

            {/* Best Times */}
            {dayTimes && (
              <div className="bg-gray-50/90 backdrop-blur-sm rounded-xl p-10 shadow-sm mb-12">
                <div className="flex items-center space-x-4 mb-8">
                  <Calendar className="w-10 h-10 text-gray-600" />
                  <h2 className="text-3xl font-semibold text-gray-800">{t.bestTime}</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center bg-gray-100/90 backdrop-blur-sm rounded-lg p-5">
                    <span className="text-3xl font-bold text-gray-900">{dayTimes.early}</span>
                    <span className="ml-6 px-6 py-3 bg-green-100 text-green-800 rounded-md font-medium text-xl">
                      ({t.earlyLunch})
                    </span>
                  </div>
                  <div className="flex items-center bg-gray-100/90 backdrop-blur-sm rounded-lg p-5">
                    <span className="text-3xl font-bold text-gray-900">{dayTimes.late}</span>
                    <span className="ml-6 px-6 py-3 bg-green-100 text-green-800 rounded-md font-medium text-xl">
                      ({t.lateLunch})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Logos Footer */}
        <div className="mt-12 border-t pt-10">
          <div className="text-lg text-gray-600 mb-8 text-center">{t.disclaimer}</div>
          <div className="flex justify-center items-center space-x-20">
            <img 
              src="https://apps.utu.fi/media/logo/UTU_logo_EN_RGB.png" 
              alt="University of Turku"
              className="h-24 object-contain"
            />
            <img 
              src="https://sites.utu.fi/diningflow/wp-content/uploads/sites/1272/2023/08/cropped-cropped-diningFlow_logo_02-e1692566496656.png" 
              alt="DiningFlow"
              className="h-24 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;