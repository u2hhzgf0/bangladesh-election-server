/**
 * Get election end time: Today at 5 PM Bangladesh Time (GMT+6)
 * If 5 PM has passed, it will be set to tomorrow at 5 PM
 */
const getElectionEndTime = () => {
  // Get current time in Bangladesh (GMT+6)
  const now = new Date();
  const bdTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));

  // Set to today at 5 PM (17:00)
  const electionEnd = new Date(bdTime);
  electionEnd.setHours(17, 0, 0, 0);

  // If 5 PM has passed, set to tomorrow at 5 PM
  if (bdTime >= electionEnd) {
    electionEnd.setDate(electionEnd.getDate() + 1);
  }

  return electionEnd;
};

export const getCountdown = () => {
  const now = new Date();
  const bdNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
  const electionEnd = getElectionEndTime();
  const difference = electionEnd - bdNow;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      message: 'Election has ended!',
      isElectionDay: true
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    message: `Time until election ends: ${days}d ${hours}h ${minutes}m ${seconds}s`,
    isElectionDay: false,
    electionDate: electionEnd.toISOString()
  };
};
