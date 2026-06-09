'use client';
import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', description: 'Order #ORD-001 Payment', amount: 1250, type: 'credit', date: '2026-06-01', status: 'Completed' },
  { id: 't2', description: 'Refund - Order #ORD-004', amount: 920, type: 'debit', date: '2026-06-02', status: 'Completed' },
  { id: 't3', description: 'Order #ORD-003 Payment', amount: 3100, type: 'credit', date: '2026-06-08', status: 'Pending' },
  { id: 't4', description: 'Platform Fee - May 2026', amount: 4500, type: 'debit', date: '2026-05-31', status: 'Completed' },
  { id: 't5', description: 'Order #ORD-002 Payment', amount: 440, type: 'credit', date: '2026-06-05', status: 'Completed' },
  { id: 't6', description: 'Vendor Payout - Batch #12', amount: 12000, type: 'debit', date: '2026-06-07', status: 'Pending' },
];

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: const res = await fetch('/api/finance/transactions'); setTransactions((await res.json()).data);
      await new Promise((r) => setTimeout(r, 400));
      setTransactions(MOCK_TRANSACTIONS);
    } catch {
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
  return { transactions, loading, error, refetch: fetchTransactions };
}
