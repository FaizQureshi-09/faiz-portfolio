import { useEffect, useState } from 'react';

/**
 * Tracks which in-page section is currently most visible in the viewport
 * using an IntersectionObserver, so the navbar can highlight the active
 * link as the user scrolls.
 *
 * @param {string[]} sectionIds - ordered list of section element ids to watch
 * @returns {string} id of the currently active section
 */
export function useActiveSection(sectionIds) {
  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sectionElements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) {
          return;
        }

        const mostVisibleEntry = visibleEntries.reduce((topEntry, entry) =>
          entry.intersectionRatio > topEntry.intersectionRatio ? entry : topEntry
        );

        setActiveSectionId(mostVisibleEntry.target.id);
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSectionId;
}
