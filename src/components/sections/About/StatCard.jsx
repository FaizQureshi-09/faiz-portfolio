import { useCountUp } from '../../../hooks/useCountUp';

/**
 * Single animated statistic tile (e.g. "90%+ API Latency Reduced").
 * Counts up from zero once scrolled into view via `useCountUp`.
 *
 * @param {object} props
 * @param {number} props.value - numeric target value
 * @param {string} props.suffix - unit/suffix appended after the number
 * @param {string} props.label - descriptive label under the number
 */
export function StatCard({ value, suffix, label }) {
  const decimalPlaces = Number.isInteger(value) ? 0 : 1;
  const { ref, value: animatedValue } = useCountUp(value, { decimalPlaces });

  return (
    <div className="stat-card" ref={ref}>
      <p className="stat-card__value">
        {animatedValue}
        {suffix}
      </p>
      <p className="stat-card__label">{label}</p>
    </div>
  );
}
