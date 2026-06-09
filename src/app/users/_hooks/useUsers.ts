'use client';
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Customer', status: 'Active', joinedAt: '2025-12-01' },
  { id: 'u2', name: 'Priya Singh', email: 'priya@example.com', role: 'Mechanic', status: 'Active', joinedAt: '2026-01-10' },
  { id: 'u3', name: 'Arjun Patel', email: 'arjun@example.com', role: 'Customer', status: 'Inactive', joinedAt: '2026-02-14' },
  { id: 'u4', name: 'Sneha Verma', email: 'sneha@example.com', role: 'Admin', status: 'Active', joinedAt: '2025-11-20' },
  { id: 'u5', name: 'Kiran Mehta', email: 'kiran@example.com', role: 'Customer', status: 'Suspended', joinedAt: '2026-03-05' },
  { id: 'u6', name: 'Dev Kumar', email: 'dev@example.com', role: 'Vendor', status: 'Active', joinedAt: '2026-04-18' },
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: const res = await fetch('/api/users'); const json = await res.json(); setUsers(json.data);
      await new Promise((r) => setTimeout(r, 400));
      setUsers(MOCK_USERS);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: User['status']) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    // TODO: await fetch(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  return { users, loading, error, refetch: fetchUsers, updateStatus };
}
