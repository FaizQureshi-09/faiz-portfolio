import { useEffect, useState } from 'react';

/**
 * Reports whether the page has been scrolled past a given threshold.
 * Used by the navbar to switch to a condensed, blurred background once
 * the user leaves the hero section.
 *
 * @param {number} thresholdPx - scrollY value after which `true` is returned
 * @returns {boolean} whether the current scroll position exceeds the threshold
 */
export function useScrollPosition(thresholdPx = 40) {
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsPastThreshold(window.scrollY > thresholdPx);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [thresholdPx]);

  return isPastThreshold;
}
