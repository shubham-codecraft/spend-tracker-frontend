export default function StatDelta({ value }) {
  if (value === null || value === undefined) {
    return <span className="stat-delta stat-delta--flat">No prior month data</span>;
  }
  const isUp = value > 0;
  const isFlat = value === 0;
  const cls = isFlat ? 'stat-delta--flat' : isUp ? 'stat-delta--up' : 'stat-delta--down';
  const sign = isUp ? '+' : '';
  return (
    <span className={`stat-delta ${cls}`}>
      {sign}
      {value}% vs last month
    </span>
  );
}
