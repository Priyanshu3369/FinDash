import { useState } from 'react';
import {
  Search, SlidersHorizontal, Plus, ArrowUpDown,
  Download, RotateCcw, Pencil, Trash2,
  ArrowUpRight, ArrowDownRight, FileText, FileJson,
} from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useApp } from '../context/AppContext';
import { allCategories, categoryColors } from '../data/transactions';
import { formatCurrency, formatDate, hexToRgba, exportToCSV, exportToJSON } from '../utils/helpers';
import TransactionModal from '../components/transactions/TransactionModal';

export default function TransactionsPage() {
  const { state } = useApp();
  const { role } = state;
  const isAdmin = role === 'admin';

  const {
    transactions, allTransactions, filters,
    addTransaction, updateTransaction, deleteTransaction,
    setFilter, resetFilters,
  } = useTransactions();

  const [modalOpen, setModalOpen]       = useState(false);
  const [editingTxn, setEditingTxn]     = useState(null);
  const [showFilters, setShowFilters]   = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleSave   = (txn) => { if (editingTxn) updateTransaction(txn); else addTransaction(txn); setEditingTxn(null); };
  const handleEdit   = (txn) => { setEditingTxn(txn); setModalOpen(true); };
  const handleDelete = (id)  => { deleteTransaction(id); setDeleteConfirm(null); };

  const toggleSort = (field) => {
    if (filters.sortBy === field) setFilter({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    else setFilter({ sortBy: field, sortOrder: 'desc' });
  };

  const activeFilterCount = [
    filters.type !== 'all',
    filters.category !== 'all',
    filters.search !== '',
  ].filter(Boolean).length;

  return (
    <>
      <div className="tp-page">

        {/* ── Header ── */}
        <div className="tp-header">
          <div>
            <p className="tp-eyebrow">Finance</p>
            <h1 className="tp-title">Transactions</h1>
          </div>
          <div className="tp-header-right">
            <p className="tp-count">
              <strong>{transactions.length}</strong> of {allTransactions.length} records
            </p>

            {/* Export */}
            <div className="tp-export-wrap">
              <button
                className="tp-btn-outline"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download size={13} /> Export
              </button>
              {showExportMenu && (
                <div className="tp-dropdown">
                  <button className="tp-dropdown-item" onClick={() => { exportToCSV(transactions); setShowExportMenu(false); }}>
                    <FileText size={12} style={{ color: 'var(--c-income)' }} /> CSV
                  </button>
                  <button className="tp-dropdown-item" onClick={() => { exportToJSON(transactions); setShowExportMenu(false); }}>
                    <FileJson size={12} style={{ color: 'var(--c-accent)' }} /> JSON
                  </button>
                </div>
              )}
            </div>

            {isAdmin && (
              <button
                className="tp-btn-primary"
                onClick={() => { setEditingTxn(null); setModalOpen(true); }}
              >
                <Plus size={13} /> Add Transaction
              </button>
            )}
          </div>
        </div>

        <div className="tp-rule" />

        {/* ── Search & Filters ── */}
        <div className="tp-toolbar">
          <div className="tp-search-row">
            <div className="tp-search-wrap">
              <Search size={13} className="tp-search-icon" />
              <input
                type="text"
                placeholder="Search transactions…"
                value={filters.search}
                onChange={(e) => setFilter({ search: e.target.value })}
                className="tp-input tp-search-input"
              />
            </div>

            <div className="tp-filter-btns">
              <button
                className={`tp-btn-outline ${showFilters ? 'tp-btn-active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={13} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="tp-filter-badge">{activeFilterCount}</span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button className="tp-btn-danger-ghost" onClick={resetFilters}>
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="tp-filter-row">
              <select
                className="tp-input tp-select"
                value={filters.type}
                onChange={(e) => setFilter({ type: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <select
                className="tp-input tp-select"
                value={filters.category}
                onChange={(e) => setFilter({ category: e.target.value })}
              >
                <option value="all">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div className="tp-table-wrap">

          {/* Column heads */}
          <div className={`tp-thead ${isAdmin ? 'tp-grid-admin' : 'tp-grid-viewer'}`}>
            <span>Description</span>
            <button className="tp-sort-btn" onClick={() => toggleSort('date')}>
              Date <ArrowUpDown size={10} />
            </button>
            <span>Category</span>
            <button className="tp-sort-btn" onClick={() => toggleSort('amount')}>
              Amount <ArrowUpDown size={10} />
            </button>
            {isAdmin && <span style={{ textAlign: 'right' }}>Actions</span>}
          </div>

          {/* Empty state */}
          {transactions.length === 0 && (
            <div className="tp-empty">
              <div className="tp-empty-icon">
                <Search size={18} />
              </div>
              <p className="tp-empty-title">No transactions found</p>
              <p className="tp-empty-sub">
                {activeFilterCount > 0
                  ? 'Try adjusting your filters'
                  : isAdmin
                    ? 'Add your first transaction above'
                    : 'No transactions available'}
              </p>
            </div>
          )}

          {/* Rows */}
          {transactions.map((txn, idx) => {
            const isIncome = txn.type === 'income';
            const catColor = categoryColors[txn.category] || '#64748b';
            const iconColor = isIncome ? 'var(--c-income)' : catColor;

            return (
              <div
                key={txn.id}
                className={`tp-row group ${isAdmin ? 'tp-grid-admin' : 'tp-grid-viewer'}`}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                {/* Description */}
                <div className="tp-row-desc">
                  <span className="tp-row-icon" style={{ color: iconColor, borderColor: hexToRgba(iconColor, 0.2), background: hexToRgba(iconColor, 0.07) }}>
                    {isIncome ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  </span>
                  <div className="tp-row-info">
                    <span className="tp-row-name">{txn.description}</span>
                    <span className="tp-row-type-mobile" style={{ color: isIncome ? 'var(--c-income)' : 'var(--c-expense)' }}>
                      {txn.type}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <span className="tp-row-date">{formatDate(txn.date)}</span>

                {/* Category */}
                <span
                  className="tp-row-cat"
                  style={{ color: catColor, borderColor: hexToRgba(catColor, 0.25) }}
                >
                  {txn.category}
                </span>

                {/* Amount */}
                <span
                  className="tp-row-amount"
                  style={{ color: isIncome ? 'var(--c-income)' : 'var(--c-expense)' }}
                >
                  {isIncome ? '+' : '−'}{formatCurrency(txn.amount)}
                </span>

                {/* Actions */}
                {isAdmin && (
                  <div className="tp-row-actions">
                    <button
                      className="tp-action-btn"
                      onClick={() => handleEdit(txn)}
                      aria-label="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      className="tp-action-btn tp-action-delete"
                      onClick={() => setDeleteConfirm(txn.id)}
                      aria-label="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTxn(null); }}
        onSave={handleSave}
        transaction={editingTxn}
      />

      {/* ── Delete Confirm ── */}
      {deleteConfirm !== null && (
        <div className="tp-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="tp-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="tp-dialog-icon">
              <Trash2 size={18} style={{ color: 'var(--c-expense)' }} />
            </div>
            <h3 className="tp-dialog-title">Delete transaction?</h3>
            <p className="tp-dialog-sub">This action cannot be undone.</p>
            <div className="tp-dialog-actions">
              <button className="tp-btn-outline tp-dialog-btn" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="tp-btn-delete tp-dialog-btn" onClick={() => handleDelete(deleteConfirm)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tp-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          font-family: var(--font-body);
          animation: tp-fade 0.4s ease both;
        }
        @keyframes tp-fade { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }

        /* ── Header ── */
        .tp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .tp-eyebrow {
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--c-text-3);
          margin-bottom: 5px;
        }
        .tp-title {
          font-family: var(--font-display);
          font-size: 2.1rem;
          font-weight: 400;
          letter-spacing: -0.025em;
          color: var(--c-text-1);
          line-height: 1;
          margin: 0;
        }
        .tp-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .tp-count {
          font-size: 12px;
          color: var(--c-text-3);
          margin-right: 4px;
        }
        .tp-count strong { color: var(--c-text-2); font-weight: 500; }

        .tp-rule {
          height: 1px;
          background: var(--c-border);
          margin-top: -0.75rem;
        }

        /* ── Buttons ── */
        .tp-btn-outline {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: none;
          border: 1px solid var(--c-border);
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          color: var(--c-text-2);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .tp-btn-outline:hover {
          border-color: var(--c-border-hi);
          color: var(--c-text-1);
          background: var(--c-hover-bg);
        }
        .tp-btn-active {
          background: rgba(99,102,241,0.1) !important;
          border-color: rgba(99,102,241,0.3) !important;
          color: var(--c-accent) !important;
        }

        .tp-btn-primary {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          background: var(--c-accent);
          border: 1px solid transparent;
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          transition: opacity 0.15s;
          white-space: nowrap;
        }
        .tp-btn-primary:hover { opacity: 0.88; }

        .tp-btn-danger-ghost {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          background: none;
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          color: var(--c-expense);
          cursor: pointer;
          transition: background 0.15s;
        }
        .tp-btn-danger-ghost:hover { background: rgba(248,113,113,0.07); }

        /* ── Filter badge ── */
        .tp-filter-badge {
          width: 16px; height: 16px;
          border-radius: 4px;
          background: var(--c-accent);
          color: #fff;
          font-size: 9.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Export dropdown ── */
        .tp-export-wrap { position: relative; }
        .tp-dropdown {
          position: absolute;
          right: 0; top: calc(100% + 6px);
          background: var(--c-surface);
          border: 1px solid var(--c-border-hi);
          border-radius: 8px;
          padding: 4px;
          min-width: 120px;
          z-index: 20;
          animation: tp-fade 0.15s ease;
          box-shadow: var(--c-shadow-lg);
        }
        .tp-dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 7px 10px;
          border: none;
          background: none;
          border-radius: 5px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          color: var(--c-text-2);
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }
        .tp-dropdown-item:hover {
          background: var(--c-hover-bg);
          color: var(--c-text-1);
        }

        /* ── Toolbar ── */
        .tp-toolbar {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .tp-search-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .tp-search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        .tp-search-icon {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--c-text-3);
          pointer-events: none;
        }
        .tp-input {
          width: 100%;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: 7px;
          font-family: var(--font-body);
          font-size: 12.5px;
          color: var(--c-text-1);
          transition: border-color 0.15s;
          outline: none;
        }
        .tp-input:focus { border-color: var(--c-accent); }
        .tp-input::placeholder { color: var(--c-text-3); }
        .tp-search-input { padding: 7px 11px 7px 32px; }
        .tp-select { padding: 7px 11px; cursor: pointer; appearance: auto; }

        .tp-filter-btns { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }

        .tp-filter-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 0.75rem;
          border-top: 1px solid var(--c-border);
          animation: tp-fade 0.2s ease;
        }
        .tp-filter-row .tp-select { flex: 1; min-width: 140px; }

        /* ── Table ── */
        .tp-table-wrap {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 12px;
          overflow: hidden;
        }

        /* Grid layouts */
        .tp-grid-viewer { grid-template-columns: 1fr 120px 130px 110px; }
        .tp-grid-admin  { grid-template-columns: 1fr 120px 130px 110px 72px; }

        .tp-thead {
          display: none;
        }
        @media (min-width: 768px) {
          .tp-thead {
            display: grid;
            gap: 0 1rem;
            padding: 10px 18px;
            border-bottom: 1px solid var(--c-border);
            background: var(--c-hover-bg);
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--c-text-3);
            align-items: center;
          }
        }
        .tp-sort-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--c-text-3);
          padding: 0;
          transition: color 0.15s;
        }
        .tp-sort-btn:hover { color: var(--c-text-1); }

        /* Rows */
        .tp-row {
          display: flex;
          flex-direction: column;
          padding: 12px 18px;
          border-bottom: 1px solid var(--c-border);
          transition: background 0.12s;
          cursor: default;
          animation: tp-row-in 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }
        .tp-row:last-child { border-bottom: none; }
        .tp-row:hover { background: var(--c-hover-bg); }
        @keyframes tp-row-in {
          from { opacity:0; transform:translateY(5px); }
          to   { opacity:1; transform:none; }
        }
        @media (min-width: 768px) {
          .tp-row {
            display: grid;
            gap: 0 1rem;
            align-items: center;
            padding: 13px 18px;
          }
        }

        .tp-row-desc {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .tp-row-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tp-row-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .tp-row-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--c-text-1);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tp-row-type-mobile {
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: capitalize;
        }
        @media (min-width: 768px) { .tp-row-type-mobile { display: none; } }

        .tp-row-date {
          font-size: 12px;
          color: var(--c-text-3);
          font-variant-numeric: tabular-nums;
          padding-left: 40px;
        }
        @media (min-width: 768px) { .tp-row-date { padding-left: 0; align-self: center; } }

        .tp-row-cat {
          font-size: 11px;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 5px;
          border: 1px solid;
          width: fit-content;
          letter-spacing: 0.02em;
          margin-left: 40px;
        }
        @media (min-width: 768px) { .tp-row-cat { margin-left: 0; align-self: center; } }

        .tp-row-amount {
          font-size: 13px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.01em;
          margin-left: 40px;
        }
        @media (min-width: 768px) { .tp-row-amount { margin-left: 0; align-self: center; } }

        .tp-row-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 2px;
          margin-left: 40px;
          margin-top: 4px;
        }
        @media (min-width: 768px) {
          .tp-row-actions {
            margin: 0;
            opacity: 0;
            transition: opacity 0.15s;
          }
          .tp-row:hover .tp-row-actions { opacity: 1; }
        }

        .tp-action-btn {
          width: 28px; height: 28px;
          border: none;
          background: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--c-text-3);
          transition: background 0.12s, color 0.12s;
        }
        .tp-action-btn:hover {
          background: var(--c-hover-bg-strong);
          color: var(--c-text-1);
        }
        .tp-action-delete:hover {
          background: rgba(248,113,113,0.1) !important;
          color: var(--c-expense) !important;
        }

        /* Empty state */
        .tp-empty {
          padding: 4rem 2rem;
          text-align: center;
        }
        .tp-empty-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: var(--c-hover-bg);
          border: 1px solid var(--c-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--c-text-3);
          margin: 0 auto 12px;
        }
        .tp-empty-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--c-text-1);
          margin-bottom: 4px;
        }
        .tp-empty-sub { font-size: 12px; color: var(--c-text-3); }

        /* Delete confirm overlay */
        .tp-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1rem;
        }
        .tp-dialog {
          background: var(--c-surface);
          border: 1px solid var(--c-border-hi);
          border-radius: 14px;
          padding: 2rem;
          width: 100%;
          max-width: 360px;
          text-align: center;
          animation: tp-fade 0.2s ease;
          box-shadow: var(--c-shadow-xl);
        }
        .tp-dialog-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .tp-dialog-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 400;
          color: var(--c-text-1);
          letter-spacing: -0.01em;
          margin-bottom: 6px;
        }
        .tp-dialog-sub { font-size: 12.5px; color: var(--c-text-3); margin-bottom: 1.5rem; }
        .tp-dialog-actions { display: flex; gap: 8px; }
        .tp-dialog-btn { flex: 1; padding: 9px 0; justify-content: center; }

        .tp-btn-delete {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 16px;
          background: var(--c-expense);
          border: 1px solid transparent;
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 12.5px;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .tp-btn-delete:hover { opacity: 0.88; }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .tp-title { font-size: 1.6rem; }
          .tp-header { gap: 0.75rem; }
          .tp-header-right { gap: 6px; }
        }
      `}</style>
    </>
  );
}