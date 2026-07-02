import { useState, useEffect, useRef, useCallback } from 'react';

// Countdown timer hook. Calls onExpire once when it reaches zero.
export default function useTimer(initialSeconds, onExpire) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return undefined;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const reset = useCallback((seconds = initialSeconds) => {
    clearInterval(intervalRef.current);
    setSecondsLeft(seconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => setIsRunning(true), []);

  return { secondsLeft, isRunning, reset, pause, resume };
}
