import { useEffect } from 'react';

export default function ScrollOptimizer() {
  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      document.documentElement.classList.add('is-scrolling');
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
      }, 180);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(timeoutId);
      document.documentElement.classList.remove('is-scrolling');
    };
  }, []);

  return null;
}
