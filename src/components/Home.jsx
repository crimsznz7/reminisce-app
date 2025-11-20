import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentTime, getDayAndTimeOfDay, getNextTask } from '../utils/timeUtils';

export default function Home() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [dayAndTime, setDayAndTime] = useState(getDayAndTimeOfDay());
  const [nextTask, setNextTask] = useState(getNextTask());

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
      setDayAndTime(getDayAndTimeOfDay());
      setNextTask(getNextTask());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white" role="main" aria-label="Home screen">
      <div className="text-center space-y-12 w-full max-w-4xl">
        {/* Current Time */}
        <section aria-label="Current time and day" className="space-y-4">
          <div className="text-7xl font-bold text-gray-900" role="timer" aria-live="polite" aria-atomic="true">
            {currentTime}
          </div>
          <div className="text-5xl font-semibold text-gray-700" aria-label="Day and time of day">
            {dayAndTime}
          </div>
        </section>

        {/* Next Task */}
        <section aria-label="Next scheduled task" className="space-y-4">
          <div className="text-4xl font-semibold text-gray-600">
            Next:
          </div>
          <div className="text-5xl font-bold text-blue-700" aria-live="polite">
            {nextTask}
          </div>
        </section>

        {/* Navigation Buttons */}
        <nav aria-label="Main navigation" className="flex flex-col gap-6 mt-16">
          <button
            onClick={() => navigate('/memory-lane')}
            className="btn-large w-full"
            aria-label="View Photos - Go to Memory Lane"
          >
            Photos
          </button>
          <button
            onClick={() => navigate('/who-is-this')}
            className="btn-large w-full"
            aria-label="Play Game - Who is this?"
          >
            Game
          </button>
        </nav>
      </div>
    </main>
  );
}

