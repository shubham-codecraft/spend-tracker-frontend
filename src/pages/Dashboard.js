import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { fetchExpenses, fetchSummary } from '../api';
import StatDelta from '../components/ui/StatDelta';
import ExpenseTable from '../components/ui/ExpenseTable';

export default function Dashboard() {
  const { user, token } = useAuth();
  const { apiBase } = useConfig();

  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState('');
  const [recent, setRecent] = useState([]);
  const [recentError, setRecentError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setSummaryError('');
    setRecentError('');

    try {
      const s = await fetchSummary(apiBase, token, {});
      setSummary(s);
    } catch (err) {
      setSummaryError(err.message);
    }

    try {
      const items = await fetchExpenses(apiBase, token, {});
      const sorted = [...items].sort((a, b) => (a.date < b.date ? 1 : -1));
      setRecent(sorted.slice(0, 5));
    } catch (err) {
      setRecentError(err.message);
    }

    setLoading(false);
  }, [apiBase, token]);

  useEffect(() => {
    load();
  }, [load]);

  const maxCategory = summary
    ? Math.max(...summary.spend_by_category.map((c) => c.total), 1)
    : 1;

  return (
    <div>
      <div className="content__header">
        <div>
          <h1>Good to see you, {user?.first_name || 'there'}</h1>
          <p>Here's where your spending stands.</p>
        </div>
        <Link className="btn" to="/expenses/new">
          Add expense
        </Link>
      </div>

      {summaryError && <p className="banner-error" style={{ marginBottom: 20 }}>{summaryError}</p>}

      {!loading && summary && (
        <div className="grid-2">
          <div className="panel">
            <div className="hero-figure">
              <div className="hero-figure__main">
                <span className="hero-label">Spent this month</span>
                <span className="hero-figure__amount numeral">
                  {summary.current_month_total.toFixed(2)}
                </span>
              </div>
              <StatDelta value={summary.month_over_month_percent_change} />
            </div>
            <div className="hero-baseline">
              <span>Previous month</span>
              <span className="numeral">{summary.previous_month_total.toFixed(2)}</span>
            </div>

            {summary.insights.length > 0 && (
              <ul className="insight-list" style={{ marginTop: 18 }}>
                {summary.insights.map((i) => (
                  <li key={i.category}>
                    <span>{i.category} is up {i.percent_change}% vs last month</span>
                    <span className="numeral">
                      {i.previous_month_total.toFixed(2)} → {i.current_month_total.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="panel">
            <div className="panel__title">
              <h2>By category</h2>
            </div>
            {summary.spend_by_category.length === 0 ? (
              <div className="empty">No spend recorded yet.</div>
            ) : (
              <div className="bars">
                {summary.spend_by_category.map((c) => (
                  <div className="bar-row" key={c.category}>
                    <span className="bar-row__label">{c.category}</span>
                    <span className="bar-row__track">
                      <span
                        className="bar-row__fill"
                        style={{ width: `${(c.total / maxCategory) * 100}%` }}
                      />
                    </span>
                    <span className="bar-row__value numeral">{c.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel__title">
          <h2>Recent expenses</h2>
          <Link className="text-link" to="/expenses">
            View all
          </Link>
        </div>
        {recentError ? (
          <p className="error-text">{recentError}</p>
        ) : (
          <ExpenseTable expenses={recent} />
        )}
      </div>
    </div>
  );
}
