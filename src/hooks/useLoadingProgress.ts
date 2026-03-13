import { useEffect, useState } from 'react';

export function useLoadingProgress(isLoading: boolean) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((p) => (p < 85 ? p + 7 : p));
      }, 100);
      return () => clearInterval(timer);
    } else {
      setProgress(100);
      const reset = setTimeout(() => setProgress(0), 400);
      return () => clearTimeout(reset);
    }
  }, [isLoading]);

  return progress;
}
