import { useCountUp } from '../../../hooks/useCountUp';

/**
 * Single animated statistic tile (e.g. "90%+ API Latency Reduced").
 * Counts up from zero once scrolled into view via `useCountUp`.
 *
 * @param {object} props
 * @param {number} props.value - numeric target value
 * @param {string} props.suffix - unit/suffix appended after the number
 * @param {string} props.label - descriptive label under the number
 * @param {number} [props.decimalPlaces] - override the auto-detected decimal
 *   places; needed for the experience stat, whose "<years>.<months>" value
 *   would otherwise get rounded to 1 decimal place and silently truncate a
 *   2-digit month count (e.g. 2.11 -> "2.1").
 */
export function StatCard({ value, suffix, label, decimalPlaces }) {
  const resolvedDecimalPlaces = decimalPlaces ?? (Number.isInteger(value) ? 0 : 1);
  const { ref, value: animatedValue } = useCountUp(value, { decimalPlaces: resolvedDecimalPlaces });

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
