import React, { useState, useEffect } from 'react';

function CurrentDayAndTime() {
  const [currentDayAndTime, setCurrentDayAndTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      const formattedDate = now.toLocaleDateString('en-US', options);
      setCurrentDayAndTime(formattedDate);
    }, 1000); // Update every 1 second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>{currentDayAndTime}</p>
    </div>
  );
}

export default CurrentDayAndTime;