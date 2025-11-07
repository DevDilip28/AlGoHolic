export const updateStreak = () => {
  const today = new Date().toDateString();
  const streakData = JSON.parse(localStorage.getItem("streakData")) || {
    lastActiveDate: null,
    streakCount: 0,
  };

  const lastActive = streakData.lastActiveDate;

  if (!lastActive) {
    streakData.streakCount = 1;
  } else {
    const last = new Date(lastActive);
    const diffInDays = Math.floor(
      (new Date(today) - last) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 1) streakData.streakCount += 1;
    else if (diffInDays > 1) streakData.streakCount = 1;
  }

  streakData.lastActiveDate = today;
  localStorage.setItem("streakData", JSON.stringify(streakData));

  window.dispatchEvent(new Event("streakUpdated"));
  return streakData;
};
