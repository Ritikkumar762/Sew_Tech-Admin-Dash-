'use client';
import { useState, useEffect, useCallback } from 'react';
import { Campaign } from '@/types';

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'cp1', name: 'Summer Sale Blast', type: 'Email', status: 'Active', reach: 12000, conversions: 480, startDate: '2026-06-01', endDate: '2026-06-30' },
  { id: 'cp2', name: 'New Mechanic Promo', type: 'SMS', status: 'Active', reach: 5000, conversions: 220, startDate: '2026-06-05', endDate: '2026-06-20' },
  { id: 'cp3', name: 'App Download Push', type: 'Push', status: 'Completed', reach: 20000, conversions: 1200, startDate: '2026-05-01', endDate: '2026-05-31' },
  { id: 'cp4', name: 'Spare Parts Banner', type: 'Banner', status: 'Draft', reach: 0, conversions: 0, startDate: '2026-07-01', endDate: '2026-07-15' },
];

export function useMarketing() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: const res = await fetch('/api/marketing/campaigns'); setCampaigns((await res.json()).data);
      await new Promise((r) => setTimeout(r, 400));
      setCampaigns(MOCK_CAMPAIGNS);
    } catch {
      setError('Failed to load campaigns.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);
  return { campaigns, loading, error, refetch: fetchCampaigns };
}
