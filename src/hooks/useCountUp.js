import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Animates a number counting up from 0 to `targetValue` once the element
 * bound to the returned ref scrolls into view. Used to animate the
 * headline statistics in the About section.
 *
 * @param {number} targetValue - final number to count up to
 * @param {object} [options]
 * @param {number} [options.durationMs=1400] - total animation duration
 * @param {number} [options.decimalPlaces=0] - decimal places to round to
 * @returns {{ ref: import('react').RefObject, value: number }}
 */
export function useCountUp(targetValue, { durationMs = 1400, decimalPlaces = 0 } = {}) {
  const elementRef = useRef(null);
  const isInView = useInView(elementRef, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    const startTimestamp = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTimestamp) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      const nextValue = Number((eased * targetValue).toFixed(decimalPlaces));
      setValue(nextValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, targetValue, durationMs, decimalPlaces]);

  return { ref: elementRef, value };
}
