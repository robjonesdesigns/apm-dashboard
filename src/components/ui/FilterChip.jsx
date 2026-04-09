export default function FilterChip({ label, onClear }) {
  return (
    <button
      className="filter-chip"
      onClick={onClear}
      aria-label={`Clear filter: ${label}`}
    >
      <span>{label}</span>
      <span className="text-14 leading-none">&times;</span>
    </button>
  )
}
