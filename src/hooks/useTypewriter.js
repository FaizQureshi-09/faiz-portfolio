import { useEffect, useState } from 'react';

/**
 * Produces a classic typewriter effect that cycles through a list of
 * phrases: typing each one out, pausing, deleting it, then moving to
 * the next. Used by the Hero section to rotate through role titles.
 *
 * @param {string[]} phrases - phrases to cycle through
 * @param {object} [options]
 * @param {number} [options.typingSpeedMs=70] - delay between typed characters
 * @param {number} [options.deletingSpeedMs=35] - delay between deleted characters
 * @param {number} [options.pauseMs=1600] - pause once a phrase is fully typed
 * @returns {string} the text currently displayed
 */
export function useTypewriter(
  phrases,
  { typingSpeedMs = 70, deletingSpeedMs = 35, pauseMs = 1600 } = {}
) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) {
      return undefined;
    }

    const currentPhrase = phrases[phraseIndex % phrases.length];
    const isPhraseComplete = displayedText === currentPhrase;
    const isPhraseCleared = displayedText === '';

    if (isPhraseComplete && !isDeleting) {
      const pauseTimeout = setTimeout(() => setIsDeleting(true), pauseMs);
      return () => clearTimeout(pauseTimeout);
    }

    if (isPhraseCleared && isDeleting) {
      setIsDeleting(false);
      setPhraseIndex((previousIndex) => (previousIndex + 1) % phrases.length);
      return undefined;
    }

    const stepTimeout = setTimeout(
      () => {
        const nextLength = displayedText.length + (isDeleting ? -1 : 1);
        setDisplayedText(currentPhrase.slice(0, nextLength));
      },
      isDeleting ? deletingSpeedMs : typingSpeedMs
    );

    return () => clearTimeout(stepTimeout);
  }, [displayedText, isDeleting, phraseIndex, phrases, typingSpeedMs, deletingSpeedMs, pauseMs]);

  return displayedText;
}
