'use client';
import { useState, useEffect, useCallback } from 'react';
import { Campaign } from '@/types';
import { apiClient, ENDPOINTS } from '@/lib';

// ── Mock fallback data ─────────────────────────────────────────────────────
const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'banner-hs-1', name: 'Hero Banner — Summer Sale', type: 'Banner', status: 'Active', reach: 220000, conversions: 45, startDate: "01 Jun' 26", endDate: "30 Jun' 26", spareName: 'Hero Banner — Summer Sale', impressionsL30D: '2.2L', currentImpressions: '1.9L', currentClicks: '42,000', currentCTR: '22%', tabCategory: 'Home Screen' },
  { id: 'banner-hs-2', name: 'Promo Strip — Flash Deals', type: 'Banner', status: 'Active', reach: 185000, conversions: 38, startDate: "05 Jun' 26", endDate: "20 Jul' 26", spareName: 'Promo Strip — Flash Deals', impressionsL30D: '1.85L', currentImpressions: '1.6L', currentClicks: '35,000', currentCTR: '19%', tabCategory: 'Home Screen' },
  { id: 'banner-hs-3', name: 'Mid Banner — New Arrivals', type: 'Banner', status: 'Active', reach: 160000, conversions: 29, startDate: "10 Jun' 26", endDate: "10 Jul' 26", spareName: 'Mid Banner — New Arrivals', impressionsL30D: '1.6L', currentImpressions: '1.3L', currentClicks: '28,500', currentCTR: '18%', tabCategory: 'Home Screen' },
  { id: 'banner-sp-1', name: 'Top Banner — Engine Spares', type: 'Banner', status: 'Active', reach: 175000, conversions: 34, startDate: "01 Jun' 26", endDate: "30 Jun' 26", spareName: 'Top Banner — Engine Spares', impressionsL30D: '1.75L', currentImpressions: '1.5L', currentClicks: '32,000', currentCTR: '21%', tabCategory: 'ST Spares' },
  { id: 'banner-sp-2', name: 'Discount Banner — 30% Off', type: 'Banner', status: 'Active', reach: 140000, conversions: 27, startDate: "08 Jun' 26", endDate: "08 Jul' 26", spareName: 'Discount Banner — 30% Off', impressionsL30D: '1.4L', currentImpressions: '1.2L', currentClicks: '26,000', currentCTR: '18%', tabCategory: 'ST Spares' },
  { id: 'banner-mc-1', name: 'Enroll Banner — Join as Mechanic', type: 'Banner', status: 'Active', reach: 95000, conversions: 210, startDate: "01 Jun' 26", endDate: "31 Jul' 26", spareName: 'Enroll Banner — Join as Mechanic', impressionsL30D: '95,000', currentImpressions: '82,000', currentClicks: '17,000', currentCTR: '20%', tabCategory: 'ST Mechanic' },
  { id: 'banner-mc-2', name: 'Training Promo — Get Certified', type: 'Banner', status: 'Active', reach: 72000, conversions: 155, startDate: "10 Jun' 26", endDate: "10 Aug' 26", spareName: 'Training Promo — Get Certified', impressionsL30D: '72,000', currentImpressions: '61,000', currentClicks: '12,500', currentCTR: '17%', tabCategory: 'ST Mechanic' },
  { id: 'banner-kg-1', name: 'Welcome Banner — Register Now', type: 'Banner', status: 'Active', reach: 68000, conversions: 180, startDate: "01 Jun' 26", endDate: "30 Jun' 26", spareName: 'Welcome Banner — Register Now', impressionsL30D: '68,000', currentImpressions: '58,000', currentClicks: '11,500', currentCTR: '19%', tabCategory: 'ST Kaarigar' },
  { id: 'banner-ex-1', name: 'Hero Banner — Sell Used Machinery', type: 'Banner', status: 'Active', reach: 120000, conversions: 56, startDate: "01 Jun' 26", endDate: "30 Jun' 26", spareName: 'Hero Banner — Sell Used Machinery', impressionsL30D: '1.2L', currentImpressions: '1.0L', currentClicks: '21,000', currentCTR: '20%', tabCategory: 'ST Exchange' },
  { id: 'banner-ac-1', name: 'Enrollment Banner — New Batch', type: 'Banner', status: 'Active', reach: 48000, conversions: 320, startDate: "01 Jun' 26", endDate: "31 Aug' 26", spareName: 'Enrollment Banner — New Batch', impressionsL30D: '48,000', currentImpressions: '40,000', currentClicks: '8,000', currentCTR: '20%', tabCategory: 'ST Academics' },
];

const MOCK_STATS = [
  { label: 'Impressions', value: '1,500', trend: '▲ 5%', trendLabel: '(L7D)', color: '#10b981' },
  { label: 'Clicks',      value: '500',   trend: '▲ 5%', trendLabel: '(L7D)', color: '#10b981' },
  { label: 'CTR',         value: '33.3%', trend: '▲ 5%', trendLabel: '(L7D)', color: '#10b981' },
  { label: 'Conversions', value: '200',   trend: '▲ 5%', trendLabel: '(L7D)', color: '#10b981' },
  { label: 'Banners Active', value: '15', trend: '', trendLabel: '', color: '' },
];

// ── Real backend GET /marketing/banners item shape ─────────────────────────
// { id, spareName, startDate, endDate, impressionsL30D, currentImpressions,
//   currentClicks, currentCTR, tabCategory }
export function mapBackendBannerToCampaign(b: any): Campaign {
  return {
    id:                 b.id || b._id || `banner-${Math.random()}`,
    name:               b.spareName || b.name || b.title || 'Banner',
    type:               'Banner',
    status:             b.status || 'Active',
    reach:              b.reach       ?? 0,
    conversions:        b.conversions ?? 0,
    startDate:          b.startDate   || '—',
    endDate:            b.endDate     || '—',
    spareName:          b.spareName   || b.name || '—',
    impressionsL30D:    b.impressionsL30D    || '—',
    currentImpressions: b.currentImpressions || '—',
    currentClicks:      b.currentClicks      || '—',
    currentCTR:         b.currentCTR         || '—',
    tabCategory:        b.tabCategory        || 'Home Screen',
    imageUrl:           b.imageUrl           || undefined,
    creative:           b.creative           || undefined,
  };
}

// ── Real backend GET /marketing/stats shape ────────────────────────────────
// data is an OBJECT: { impressions:{value,trend,trendLabel}, clicks:{...},
//                      ctr:{...}, conversions:{...}, bannersActive:{value} }
function mapBackendStats(data: any) {
  if (!data || typeof data !== 'object') return MOCK_STATS;
  const fmt = (v: number) => v >= 100000 ? `${(v / 100000).toFixed(1)}L` : v?.toLocaleString() ?? '—';
  const arrow = (t: number) => t > 0 ? `▲ ${t}%` : t < 0 ? `▼ ${Math.abs(t)}%` : '';
  return [
    {
      label: 'Impressions',
      value: fmt(data.impressions?.value),
      trend: arrow(data.impressions?.trend),
      trendLabel: data.impressions?.trendLabel || '(L7D)',
      color: '#10b981',
    },
    {
      label: 'Clicks',
      value: fmt(data.clicks?.value),
      trend: arrow(data.clicks?.trend),
      trendLabel: data.clicks?.trendLabel || '(L7D)',
      color: '#10b981',
    },
    {
      label: 'CTR',
      value: data.ctr?.value != null ? `${data.ctr.value}%` : '—',
      trend: arrow(data.ctr?.trend),
      trendLabel: data.ctr?.trendLabel || '(L7D)',
      color: '#10b981',
    },
    {
      label: 'Conversions',
      value: fmt(data.conversions?.value),
      trend: arrow(data.conversions?.trend),
      trendLabel: data.conversions?.trendLabel || '(L7D)',
      color: '#10b981',
    },
    {
      label: 'Banners Active',
      value: String(data.bannersActive?.value ?? '—'),
      trend: '',
      trendLabel: '',
      color: '',
    },
  ];
}

export function useMarketing() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [stats, setStats]         = useState(MOCK_STATS);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);

    // ── 1. Fetch live banners ────────────────────────────────────────────
    try {
      const res = await apiClient.get<{ success: boolean; data: any[] }>(ENDPOINTS.marketing.banners);
      if (res?.success && Array.isArray(res.data)) {
        setCampaigns(res.data.map(mapBackendBannerToCampaign));
      } else {
        setCampaigns(MOCK_CAMPAIGNS);
      }
    } catch {
      console.warn('Banners API offline — using mock data.');
      setCampaigns(MOCK_CAMPAIGNS);
      setError('Banners API unavailable');
    } finally {
      setLoading(false);
    }

    // ── 2. Fetch stats (backend returns an object, not an array) ─────────
    try {
      const sRes = await apiClient.get<{ success: boolean; data: any }>(ENDPOINTS.marketing.stats);
      if (sRes?.success && sRes.data && typeof sRes.data === 'object') {
        setStats(mapBackendStats(sRes.data));
      }
    } catch {
      // keep MOCK_STATS silently
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  return { campaigns, stats, loading, error, refetch: fetchCampaigns };
}
