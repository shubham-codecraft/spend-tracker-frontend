import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ firstName, lastName, email });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand">
          <span className="brand__mark">Ledger</span>
          <span className="brand__tag">Spend Tracker</span>
        </div>
        <h1>Sign in</h1>
        <p className="hint">Enter your name and email to continue.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid form-grid--single">
            <div className="form-grid">
              <div className="field">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}

          <div className="form-actions">
            <button className="btn btn--block" type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
