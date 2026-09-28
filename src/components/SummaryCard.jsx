export default function SummaryCard({ label, value, detail }) {
  return (
    <article className="summary-card">
      <div className="summary-top">
        <span>{label}</span>
      </div>
      <div className="summary-value">{value}</div>
      <div className="summary-detail">{detail}</div>
    </article>
  )
}
