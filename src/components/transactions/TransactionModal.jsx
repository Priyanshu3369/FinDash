import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { allCategories } from '../../data/transactions';

export default function TransactionModal({ isOpen, onClose, onSave, transaction }) {
  const isEditing = !!transaction;

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense',
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
      });
    } else {
      setForm({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        category: 'Food',
        type: 'expense',
      });
    }
  }, [transaction, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;
    onSave({ ...form, amount: parseFloat(form.amount), ...(transaction && { id: transaction.id }) });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="tm-overlay" onClick={onClose}>
        <div className="tm-panel" onClick={(e) => e.stopPropagation()}>

          {/* ── Header ── */}
          <div className="tm-header">
            <div>
              <p className="tm-eyebrow">{isEditing ? 'Editing' : 'New Entry'}</p>
              <h2 className="tm-title">
                {isEditing ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
            </div>
            <button className="tm-close" onClick={onClose} aria-label="Close">
              <X size={15} />
            </button>
          </div>

          <div className="tm-rule" />

          {/* ── Form ── */}
          <form className="tm-form" onSubmit={handleSubmit}>

            {/* Type toggle */}
            <div className="tm-field">
              <label className="tm-label">Type</label>
              <div className="tm-type-toggle">
                <button
                  type="button"
                  className={`tm-type-btn ${form.type === 'income' ? 'tm-type-income' : ''}`}
                  onClick={() => setForm({ ...form, type: 'income' })}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={`tm-type-btn ${form.type === 'expense' ? 'tm-type-expense' : ''}`}
                  onClick={() => setForm({ ...form, type: 'expense' })}
                >
                  Expense
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="tm-field">
              <label className="tm-label" htmlFor="tm-desc">Description</label>
              <input
                id="tm-desc"
                type="text"
                className="tm-input"
                placeholder="e.g., Grocery shopping"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            {/* Amount + Category side by side */}
            <div className="tm-row-2">
              <div className="tm-field">
                <label className="tm-label" htmlFor="tm-amount">Amount ($)</label>
                <input
                  id="tm-amount"
                  type="number"
                  className="tm-input"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
              <div className="tm-field">
                <label className="tm-label" htmlFor="tm-cat">Category</label>
                <select
                  id="tm-cat"
                  className="tm-input tm-select"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="tm-field">
              <label className="tm-label" htmlFor="tm-date">Date</label>
              <input
                id="tm-date"
                type="date"
                className="tm-input"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>

            <div className="tm-rule" style={{ margin: '0.25rem 0' }} />

            {/* Actions */}
            <div className="tm-actions">
              <button type="button" className="tm-btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="tm-btn-submit">
                {isEditing ? 'Save Changes' : 'Add Transaction'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .tm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 60;
          padding: 1rem;
          animation: tm-bg 0.2s ease;
        }
        @keyframes tm-bg { from { opacity:0; } to { opacity:1; } }

        .tm-panel {
          background: var(--c-surface);
          border: 1px solid var(--c-border-hi);
          border-radius: 16px;
          width: 100%;
          max-width: 440px;
          padding: 1.75rem;
          animation: tm-in 0.25s cubic-bezier(0.22,1,0.36,1);
          box-shadow: var(--c-shadow-xl);
        }
        @keyframes tm-in {
          from { opacity:0; transform:translateY(16px) scale(0.98); }
          to   { opacity:1; transform:none; }
        }

        /* Header */
        .tm-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.1rem;
          gap: 1rem;
        }
        .tm-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--c-text-3);
          margin-bottom: 4px;
        }
        .tm-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 400;
          letter-spacing: -0.02em;
          color: var(--c-text-1);
          margin: 0;
          line-height: 1.1;
        }
        .tm-close {
          width: 30px; height: 30px;
          border: 1px solid var(--c-border);
          background: none;
          border-radius: 7px;
          cursor: pointer;
          color: var(--c-text-3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .tm-close:hover {
          border-color: var(--c-border-hi);
          color: var(--c-text-1);
          background: var(--c-hover-bg);
        }

        .tm-rule {
          height: 1px;
          background: var(--c-border);
          margin-bottom: 1.25rem;
        }

        /* Form */
        .tm-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .tm-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .tm-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--c-text-3);
        }
        .tm-input {
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: 8px;
          padding: 8px 12px;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--c-text-1);
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
        }
        .tm-input::placeholder { color: var(--c-text-3); }
        .tm-input:focus { border-color: var(--c-accent); }
        .tm-select { cursor: pointer; appearance: auto; }

        .tm-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        @media (max-width: 480px) {
          .tm-row-2 { grid-template-columns: 1fr; }
        }

        /* Type toggle */
        .tm-type-toggle {
          display: flex;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: 8px;
          padding: 3px;
          gap: 3px;
        }
        .tm-type-btn {
          flex: 1;
          padding: 7px;
          border: 1px solid transparent;
          border-radius: 6px;
          background: none;
          font-family: var(--font-body);
          font-size: 12.5px;
          font-weight: 500;
          color: var(--c-text-3);
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .tm-type-btn:hover { color: var(--c-text-2); }
        .tm-type-income {
          background: rgba(74,222,128,0.1) !important;
          color: var(--c-income) !important;
          border-color: rgba(74,222,128,0.25) !important;
        }
        .tm-type-expense {
          background: rgba(248,113,113,0.1) !important;
          color: var(--c-expense) !important;
          border-color: rgba(248,113,113,0.25) !important;
        }

        /* Actions */
        .tm-actions {
          display: flex;
          gap: 8px;
          margin-top: 0.25rem;
        }
        .tm-btn-cancel {
          flex: 1;
          padding: 9px;
          background: none;
          border: 1px solid var(--c-border);
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--c-text-2);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .tm-btn-cancel:hover {
          border-color: var(--c-border-hi);
          color: var(--c-text-1);
          background: var(--c-hover-bg);
        }
        .tm-btn-submit {
          flex: 1;
          padding: 9px;
          background: var(--c-accent);
          border: 1px solid transparent;
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .tm-btn-submit:hover { opacity: 0.88; }
      `}</style>
    </>
  );
}