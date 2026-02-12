// Election date: January 5, 2026
const ELECTION_DATE = new Date('2026-01-05T00:00:00');

export const getCountdown = () => {
  const now = new Date();
  const difference = ELECTION_DATE - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      message: 'Election day has arrived!',
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
    message: `Time until election: ${days}d ${hours}h ${minutes}m ${seconds}s`,
    isElectionDay: false,
    electionDate: ELECTION_DATE.toISOString()
  };
};
