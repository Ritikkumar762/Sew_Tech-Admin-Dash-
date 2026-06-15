'use client';
import { useState, useEffect, useCallback } from 'react';
import { Campaign } from '@/types';
import { apiClient, ENDPOINTS } from '@/lib';

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

const MOCK_STATS = [
  { label: 'Impressions', value: '1500', trend: '▲ 5%', trendLabel: '(L7D)', color: '#10b981' },
  { label: 'Clicks', value: '500', trend: '▲ 5%', trendLabel: '(L7D)', color: '#10b981' },
  { label: 'CTR', value: '500', trend: '▲ 5%', trendLabel: '(L7D)', color: '#10b981' },
  { label: 'Conversions', value: '200', trend: '▲ 5%', trendLabel: '(L7D)', color: '#10b981' },
  { label: 'Banners Active', value: '15', trend: '', trendLabel: '', color: '' },
];

export function useMarketing() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState(MOCK_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch live banners from local backend API
      const response = await apiClient.get<{ success: boolean; data: Campaign[] }>(ENDPOINTS.marketing.banners);
      if (response && response.success && Array.isArray(response.data)) {
        setCampaigns(response.data);
      } else {
        setCampaigns(MOCK_CAMPAIGNS);
      }

      // 2. Fetch live metrics/stats summary
      try {
        const statsResponse = await apiClient.get<{ success: boolean; data: typeof MOCK_STATS }>(ENDPOINTS.marketing.stats);
        if (statsResponse && statsResponse.success && Array.isArray(statsResponse.data)) {
          setStats(statsResponse.data);
        }
      } catch (err) {
        // Fallback to mock stats if stats API is offline
        setStats(MOCK_STATS);
      }
    } catch {
      // Fallback to mock data on local network failures
      setCampaigns(MOCK_CAMPAIGNS);
      setStats(MOCK_STATS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);
  return { campaigns, stats, loading, error, refetch: fetchCampaigns };
}
