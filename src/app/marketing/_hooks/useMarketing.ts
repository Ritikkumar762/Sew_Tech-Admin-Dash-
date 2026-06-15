'use client';
import { useState, useEffect, useCallback } from 'react';
import { Campaign } from '@/types';

const MOCK_CAMPAIGNS: Campaign[] = Array.from({ length: 7 }).map((_, i) => ({
  id: `banner-${i + 1}`,
  name: `Banner ${i + 1}`,
  type: 'Banner',
  status: 'Active',
  reach: 150000,
  conversions: 20,
  startDate: '14 Jan\' 26',
  endDate: '28 Feb 26',
  spareName: `Banner ${i + 1}`,
  impressionsL30D: '1.5L',
  currentImpressions: '1.2L',
  currentClicks: '30,000',
  currentCTR: '20%',
  tabCategory: 'Home Screen'
}));

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
