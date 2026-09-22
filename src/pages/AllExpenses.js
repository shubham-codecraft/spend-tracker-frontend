import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { fetchExpenses } from '../api';
import ExpenseTable from '../components/ui/ExpenseTable';

const emptyFilters = { category: '', startDate: '', endDate: '' };

export default function AllExpenses() {
  const { token } = useAuth();
  const { apiBase } = useConfig();

  const [filters, setFilters] = useState(emptyFilters);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (f) => {
      if (f.startDate && f.endDate && f.startDate > f.endDate) {
        setError('Start date must be on or before end date');
        return;
      }
      setError('');
      setLoading(true);
      try {
        const items = await fetchExpenses(apiBase, token, f);
        setExpenses(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [apiBase, token]
  );

  useEffect(() => {
    load(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(field, value) {
    setFilters((f) => ({ ...f, [field]: value }));
  }

  function handleApply(e) {
    e.preventDefault();
    load(filters);
  }

  function handleClear() {
    setFilters(emptyFilters);
    load(emptyFilters);
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <div className="content__header">
        <div>
          <h1>All expenses</h1>
          <p>Filter by category or a date range.</p>
        </div>
      </div>

      <form className="filter-bar" onSubmit={handleApply}>
        <div className="field">
          <label htmlFor="fCategory">Category</label>
          <input
            id="fCategory"
            type="text"
            value={filters.category}
            onChange={(e) => update('category', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="fStart">From</label>
          <input
            id="fStart"
            type="date"
            value={filters.startDate}
            onChange={(e) => update('startDate', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="fEnd">To</label>
          <input
            id="fEnd"
            type="date"
            value={filters.endDate}
            onChange={(e) => update('endDate', e.target.value)}
          />
        </div>
        <button className="btn" type="submit">
          Apply filters
        </button>
        <button className="btn btn--ghost" type="button" onClick={handleClear}>
          Clear
        </button>
      </form>

      <div className="panel">
        <div className="panel__title">
          <h2>{loading ? 'Loading…' : `${expenses.length} expense${expenses.length === 1 ? '' : 's'}`}</h2>
          {!loading && expenses.length > 0 && (
            <span className="hint numeral">Total {total.toFixed(2)}</span>
          )}
        </div>
        {error ? <p className="error-text">{error}</p> : <ExpenseTable expenses={expenses} />}
      </div>
    </div>
  );
}
