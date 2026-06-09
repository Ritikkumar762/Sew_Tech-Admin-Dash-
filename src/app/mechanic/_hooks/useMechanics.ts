'use client';
import { useState, useEffect, useCallback } from 'react';
import { Mechanic } from '@/types';

const MOCK_MECHANICS: Mechanic[] = [
  { id: 'm1', name: 'Ramesh Kumar', phone: '9876543210', location: 'Delhi', expertise: 'Industrial Sewing Machine', status: 'Available', rating: 4.8, totalJobs: 145 },
  { id: 'm2', name: 'Suresh Yadav', phone: '9765432109', location: 'Mumbai', expertise: 'Domestic Sewing Machine', status: 'Busy', rating: 4.5, totalJobs: 98 },
  { id: 'm3', name: 'Ajay Nair', phone: '9654321098', location: 'Bangalore', expertise: 'Overlock Machines', status: 'Offline', rating: 4.2, totalJobs: 62 },
  { id: 'm4', name: 'Vijay Pandey', phone: '9543210987', location: 'Pune', expertise: 'Embroidery Machines', status: 'Available', rating: 4.9, totalJobs: 210 },
];

export function useMechanics() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMechanics = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: const res = await fetch('/api/mechanics'); setMechanics((await res.json()).data);
      await new Promise((r) => setTimeout(r, 400));
      setMechanics(MOCK_MECHANICS);
    } catch {
      setError('Failed to load mechanics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMechanics(); }, [fetchMechanics]);
  return { mechanics, loading, error, refetch: fetchMechanics };
}
