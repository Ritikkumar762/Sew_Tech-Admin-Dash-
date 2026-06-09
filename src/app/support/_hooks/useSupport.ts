'use client';
import { useState, useEffect, useCallback } from 'react';
import { SupportTicket } from '@/types';

const MOCK_TICKETS: SupportTicket[] = [
  { id: 'tk1', subject: 'Order not delivered', raisedBy: 'Rahul Sharma', status: 'Open', priority: 'High', createdAt: '2026-06-08' },
  { id: 'tk2', subject: 'Wrong item received', raisedBy: 'Priya Singh', status: 'In Progress', priority: 'Medium', createdAt: '2026-06-07' },
  { id: 'tk3', subject: 'Refund not processed', raisedBy: 'Arjun Patel', status: 'Resolved', priority: 'High', createdAt: '2026-06-05' },
  { id: 'tk4', subject: 'App login issue', raisedBy: 'Sneha Verma', status: 'Open', priority: 'Low', createdAt: '2026-06-09' },
  { id: 'tk5', subject: 'Mechanic misbehavior complaint', raisedBy: 'Kiran Mehta', status: 'Open', priority: 'Critical', createdAt: '2026-06-09' },
];

export function useSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: const res = await fetch('/api/support/tickets'); setTickets((await res.json()).data);
      await new Promise((r) => setTimeout(r, 400));
      setTickets(MOCK_TICKETS);
    } catch {
      setError('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);
  return { tickets, loading, error, refetch: fetchTickets };
}
