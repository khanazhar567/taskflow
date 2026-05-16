import { useState, useEffect, useRef } from 'react';

/**
 * Typewriter hook — cycles through an array of words with type/delete animation.
 * @param {string[]} words - phrases to cycle through
 * @param {number} typeSpeed - ms per character when typing
 * @param {number} deleteSpeed - ms per character when deleting
 * @param {number} pauseMs - ms to hold before deleting
 */
const useTypewriter = (words, typeSpeed = 80, deleteSpeed = 45, pauseMs = 2200) => {
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!words.length) return;
    const current = words[wordIndex % words.length];

    if (isPaused) {
      timeoutRef.current = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseMs);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (isDeleting) {
        setDisplayText((prev) => prev.slice(0, -1));
        if (displayText.length === 1) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setDisplayText(current.slice(0, displayText.length + 1));
        if (displayText.length + 1 === current.length) {
          setIsPaused(true);
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeoutRef.current);
  }, [displayText, isDeleting, isPaused, wordIndex, words, typeSpeed, deleteSpeed, pauseMs]);

  return displayText;
};

export default useTypewriter;
