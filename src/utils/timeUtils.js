/**
 * Format current time as HH:MM
 */
export function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Get day of week and time of day
 * Returns: "Tuesday Morning" or "Wednesday Afternoon"
 */
export function getDayAndTimeOfDay() {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = days[now.getDay()];
  
  const hour = now.getHours();
  let timeOfDay;
  if (hour < 12) {
    timeOfDay = 'Morning';
  } else if (hour < 17) {
    timeOfDay = 'Afternoon';
  } else {
    timeOfDay = 'Evening';
  }
  
  return `${day} ${timeOfDay}`;
}

/**
 * Get the next immediate task based on current time
 * Hardcoded schedule for now
 */
export function getNextTask() {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hour * 60 + minutes; // minutes since midnight
  
  // Hardcoded schedule
  const schedule = [
    { time: 8 * 60, task: 'Breakfast at 8:00 AM' },
    { time: 12 * 60, task: 'Lunch at 12:00 PM' },
    { time: 15 * 60, task: 'Afternoon Tea at 3:00 PM' },
    { time: 18 * 60, task: 'Dinner at 6:00 PM' },
    { time: 21 * 60, task: 'Bedtime at 9:00 PM' },
  ];
  
  // Find next task
  for (const item of schedule) {
    if (currentTime < item.time) {
      return item.task;
    }
  }
  
  // If no task found for today, return first task of next day
  return schedule[0].task;
}

