export default function ExpenseTable({ expenses, emptyLabel = 'No expenses yet.' }) {
  if (!expenses || expenses.length === 0) {
    return <div className="empty">{emptyLabel}</div>;
  }

  return (
    <table className="ledger">
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Note</th>
          <th className="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((e) => (
          <tr key={e.id ?? `${e.date}-${e.category}-${e.amount}-${e.note}`}>
            <td data-label="date">{e.date}</td>
            <td data-label="category">
              <span className="category-tag">{e.category}</span>
            </td>
            <td data-label="note">{e.note || <span className="hint">—</span>}</td>
            <td data-label="amount" className="amount numeral">{e.amount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
