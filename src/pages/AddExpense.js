import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { createExpense } from '../api';

const today = () => new Date().toISOString().slice(0, 10);

export default function AddExpense() {
  const { token } = useAuth();
  const { apiBase } = useConfig();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(today());
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setJustAdded(false);
    setSubmitting(true);
    try {
      await createExpense(apiBase, token, {
        amount: parseFloat(amount),
        category,
        note,
        date,
      });
      setAmount('');
      setCategory('');
      setNote('');
      setDate(today());
      setJustAdded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="content__header">
        <div>
          <h1>Add expense</h1>
          <p>Log a purchase so it shows up in your summary.</p>
        </div>
      </div>

      <div className="panel expense-form-panel" style={{ maxWidth: 480 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                max={today()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="note">Note (optional)</label>
              <input id="note" type="text" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>

          {error && <p className="error-text" style={{ marginTop: 14 }}>{error}</p>}
          {justAdded && !error && (
            <p className="hint" style={{ marginTop: 14, color: 'var(--accent-ink)' }}>
              Added. Log another, or head to{' '}
              <button
                type="button"
                className="text-link"
                style={{ display: 'inline', color: 'var(--accent-ink)' }}
                onClick={() => navigate('/dashboard')}
              >
                your dashboard
              </button>
              .
            </p>
          )}

          <div className="form-actions">
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
