
import { useState, useEffect } from 'react';

const Clock = () => {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  return (
    <div className="flex flex-col items-center animate-slide-in">
      <p className="text-lg font-medium font-lora">{formattedDate}</p>
      <p className="text-xl font-bold font-lora">{formattedTime}</p>
    </div>
  );
};

export default Clock;
