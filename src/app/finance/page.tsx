'use client';
import { useFinance } from './_hooks/useFinance';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import DataTable, { Column } from '@/components/ui/DataTable';
import { Transaction } from '@/types';

const columns: Column<Transaction>[] = [
  { key: 'description', label: 'Description', render: (r) => <span style={{ fontWeight: 500 }}>{r.description}</span> },
  { key: 'amount', label: 'Amount', render: (r) => (
    <span style={{ fontWeight: 700, color: r.type === 'credit' ? '#10b981' : '#ef4444' }}>
      {r.type === 'credit' ? '+' : '-'}₹{r.amount.toLocaleString('en-IN')}
    </span>
  )},
  { key: 'type', label: 'Type', render: (r) => <Badge label={r.type === 'credit' ? 'success' : 'danger'} /> },
  { key: 'status', label: 'Status', render: (r) => <Badge label={r.status} /> },
  { key: 'date', label: 'Date' },
];

export default function FinancePage() {
  const { transactions, loading, error } = useFinance();
  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <PageHeader title="Finance" subtitle="Track all financial transactions and payouts" actions={<button className="btn btn-dark">Export Report</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card"><div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>💰 Total Credits</div><div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>₹{totalCredit.toLocaleString('en-IN')}</div></div>
        <div className="card"><div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>💸 Total Debits</div><div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ef4444' }}>₹{totalDebit.toLocaleString('en-IN')}</div></div>
        <div className="card"><div style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 600 }}>📊 Net Balance</div><div style={{ fontSize: '1.75rem', fontWeight: 700, color: totalCredit - totalDebit >= 0 ? '#10b981' : '#ef4444' }}>₹{(totalCredit - totalDebit).toLocaleString('en-IN')}</div></div>
      </div>
      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Recent Transactions</h2>
        {loading && <p className="text-muted">Loading transactions...</p>}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {!loading && <DataTable columns={columns} data={transactions} />}
      </div>
    </div>
  );
}
