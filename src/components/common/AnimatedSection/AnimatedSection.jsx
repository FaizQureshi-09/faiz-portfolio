import { motion } from 'framer-motion';

/**
 * Wraps its children in a Framer Motion element that fades and slides
 * into view the first time it enters the viewport. Centralizes the
 * scroll-reveal animation so every section shares identical motion
 * timing instead of re-declaring variants inline.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - content to reveal on scroll
 * @param {'div'|'section'|'article'} [props.as] - element tag to render
 * @param {number} [props.delay] - additional delay in seconds before animating
 * @param {'up'|'left'|'right'|'none'} [props.direction] - slide-in direction
 * @param {string} [props.className] - optional class names to merge in
 */
export function AnimatedSection({
  children,
  as = 'div',
  delay = 0,
  direction = 'up',
  className = '',
  ...rest
}) {
  const MotionTag = motion[as];

  const directionOffsets = {
    up: { y: 32, x: 0 },
    left: { y: 0, x: -32 },
    right: { y: 0, x: 32 },
    none: { y: 0, x: 0 },
  };

  const offset = directionOffsets[direction] ?? directionOffsets.up;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
