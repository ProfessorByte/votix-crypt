import { useState, useEffect, useRef } from "react";

export const Countdown = ({ secondsLeft = 0 }) => {
  const [seconds, setSeconds] = useState(secondsLeft);
  const intervalRef = useRef();

  useEffect(() => {
    const decreaseSeconds = () => setSeconds((prev) => prev - 1);
    intervalRef.current = setInterval(decreaseSeconds, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      clearInterval(intervalRef.current);
    }
  }, [seconds]);

  const formatTime = () => {
    let hours = Math.floor(seconds / (60 * 60));
    let minutes = Math.floor((seconds % (60 * 60)) / 60);
    let secondsLeft = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
  };

  return (
    <h2 className={seconds < 3600 ? "text-danger" : "text-warning"}>
      {formatTime()}
    </h2>
  );
};
