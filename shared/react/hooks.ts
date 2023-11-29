import React from 'react';

/** Source: Dan Abramov @ overreacted.io */
export const useInterval = (callback: (...args: any[]) => void, delay: number): void => {
  const savedCallback = React.useRef<(...args: any[]) => void>();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (delay !== null) {
      let id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
