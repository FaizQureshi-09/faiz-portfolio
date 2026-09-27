import { useEffect, useState } from 'react';
import { env } from '../config/env';

const EXPERIENCE_ENDPOINT = `${env.apiBaseUrl}/experience`;

/** Shown until the API resolves (or if it fails), so nothing renders blank/broken. */
const FALLBACK_EXPERIENCE = { years: 3, months: 2 };

/** Module-level cache: every caller shares one fetch per page load. */
let cachedExperience = null;
let inFlightRequest = null;

function formatExperience({ years, months }) {
  const yearPart = `${years} ${years === 1 ? 'Year' : 'Years'}`;
  if (months === 0) return yearPart;
  return `${yearPart} ${months} ${months === 1 ? 'Month' : 'Months'}`;
}

function toDisplayShape({ years, months }) {
  return {
    years,
    months,
    formatted: formatExperience({ years, months }),
    // Matches the site's existing "<years>.<months>" stat convention (e.g. 3.2 = 3y 2mo).
    statValue: Number(`${years}.${months}`),
    statDecimalPlaces: months >= 10 ? 2 : 1,
  };
}

function fetchExperience() {
  if (cachedExperience) return Promise.resolve(cachedExperience);
  if (!inFlightRequest) {
    inFlightRequest = fetch(EXPERIENCE_ENDPOINT)
      .then((response) => response.json())
      .then((result) => {
        if (!result?.success) throw new Error(result?.message || 'Failed to load experience.');
        cachedExperience = toDisplayShape(result.data);
        return cachedExperience;
      })
      .finally(() => {
        inFlightRequest = null;
      });
  }
  return inFlightRequest;
}

/**
 * Fetches total professional experience from the /experience API once and
 * shares the result across every component that calls this hook — the
 * network request only ever happens a single time per page load. Falls
 * back to a static value if the API hasn't resolved yet or fails.
 *
 * @returns {{
 *   years: number,
 *   months: number,
 *   formatted: string,
 *   statValue: number,
 *   statDecimalPlaces: number,
 * }}
 */
export function useExperience() {
  const [experience, setExperience] = useState(cachedExperience ?? toDisplayShape(FALLBACK_EXPERIENCE));

  useEffect(() => {
    if (cachedExperience) return undefined;

    let isMounted = true;
    fetchExperience()
      .then((data) => {
        if (isMounted) setExperience(data);
      })
      .catch(() => {
        // Swallowed deliberately — keep showing the fallback rather than an
        // error state for a passive, non-critical display value.
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return experience;
}
