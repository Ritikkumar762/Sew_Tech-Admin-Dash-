'use client';
import { useState, useEffect, useCallback } from 'react';
import { Campaign } from '@/types';
import { apiClient, ENDPOINTS } from '@/lib';

const MOCK_CAMPAIGNS: Campaign[] = [
  // ── Home Screen (5 banners) ──────────────────────────────────
  {
    id: 'banner-hs-1', name: 'Home Screen Hero Banner', type: 'Banner', status: 'Active',
    reach: 220000, conversions: 45,
    startDate: "01 Jun' 26", endDate: "30 Jun' 26",
    spareName: 'Hero Banner — Summer Sale',
    impressionsL30D: '2.2L', currentImpressions: '1.9L', currentClicks: '42,000', currentCTR: '22%',
    tabCategory: 'Home Screen'
  },
  {
    id: 'banner-hs-2', name: 'Home Screen Promo Strip', type: 'Banner', status: 'Active',
    reach: 185000, conversions: 38,
    startDate: "05 Jun' 26", endDate: "20 Jul' 26",
    spareName: 'Promo Strip — Flash Deals',
    impressionsL30D: '1.85L', currentImpressions: '1.6L', currentClicks: '35,000', currentCTR: '19%',
    tabCategory: 'Home Screen'
  },
  {
    id: 'banner-hs-3', name: 'Home Screen Mid Banner', type: 'Banner', status: 'Active',
    reach: 160000, conversions: 29,
    startDate: "10 Jun' 26", endDate: "10 Jul' 26",
    spareName: 'Mid Banner — New Arrivals',
    impressionsL30D: '1.6L', currentImpressions: '1.3L', currentClicks: '28,500', currentCTR: '18%',
    tabCategory: 'Home Screen'
  },
  {
    id: 'banner-hs-4', name: 'Home Screen Bottom CTA', type: 'Banner', status: 'Active',
    reach: 130000, conversions: 22,
    startDate: "15 Jun' 26", endDate: "15 Jul' 26",
    spareName: 'Bottom CTA — Refer & Earn',
    impressionsL30D: '1.3L', currentImpressions: '1.1L', currentClicks: '24,000', currentCTR: '17%',
    tabCategory: 'Home Screen'
  },
  {
    id: 'banner-hs-5', name: 'Home Screen Category Tile', type: 'Banner', status: 'Active',
    reach: 95000, conversions: 18,
    startDate: "20 Jun' 26", endDate: "31 Jul' 26",
    spareName: 'Category Tile — Trending Parts',
    impressionsL30D: '95,000', currentImpressions: '80,000', currentClicks: '18,000', currentCTR: '15%',
    tabCategory: 'Home Screen'
  },

  // ── ST Spares (4 banners) ────────────────────────────────────
  {
    id: 'banner-sp-1', name: 'Spares Top Banner', type: 'Banner', status: 'Active',
    reach: 175000, conversions: 34,
    startDate: "01 Jun' 26", endDate: "30 Jun' 26",
    spareName: 'Top Banner — Engine Spares',
    impressionsL30D: '1.75L', currentImpressions: '1.5L', currentClicks: '32,000', currentCTR: '21%',
    tabCategory: 'ST Spares'
  },
  {
    id: 'banner-sp-2', name: 'Spares Discount Banner', type: 'Banner', status: 'Active',
    reach: 140000, conversions: 27,
    startDate: "08 Jun' 26", endDate: "08 Jul' 26",
    spareName: 'Discount Banner — 30% Off Filters',
    impressionsL30D: '1.4L', currentImpressions: '1.2L', currentClicks: '26,000', currentCTR: '18%',
    tabCategory: 'ST Spares'
  },
  {
    id: 'banner-sp-3', name: 'Spares Brand Spotlight', type: 'Banner', status: 'Active',
    reach: 110000, conversions: 19,
    startDate: "12 Jun' 26", endDate: "12 Jul' 26",
    spareName: 'Brand Spotlight — Bosch OEM',
    impressionsL30D: '1.1L', currentImpressions: '92,000', currentClicks: '19,500', currentCTR: '16%',
    tabCategory: 'ST Spares'
  },
  {
    id: 'banner-sp-4', name: 'Spares Clearance Strip', type: 'Banner', status: 'Active',
    reach: 88000, conversions: 14,
    startDate: "20 Jun' 26", endDate: "31 Jul' 26",
    spareName: 'Clearance Strip — Last Stock',
    impressionsL30D: '88,000', currentImpressions: '72,000', currentClicks: '14,000', currentCTR: '13%',
    tabCategory: 'ST Spares'
  },

  // ── ST Mechanic (3 banners) ──────────────────────────────────
  {
    id: 'banner-mc-1', name: 'Mechanic Enroll Banner', type: 'Banner', status: 'Active',
    reach: 95000, conversions: 210,
    startDate: "01 Jun' 26", endDate: "31 Jul' 26",
    spareName: 'Enroll Banner — Join as Mechanic',
    impressionsL30D: '95,000', currentImpressions: '82,000', currentClicks: '17,000', currentCTR: '20%',
    tabCategory: 'ST Mechanic'
  },
  {
    id: 'banner-mc-2', name: 'Mechanic Training Promo', type: 'Banner', status: 'Active',
    reach: 72000, conversions: 155,
    startDate: "10 Jun' 26", endDate: "10 Aug' 26",
    spareName: 'Training Promo — Get Certified',
    impressionsL30D: '72,000', currentImpressions: '61,000', currentClicks: '12,500', currentCTR: '17%',
    tabCategory: 'ST Mechanic'
  },
  {
    id: 'banner-mc-3', name: 'Mechanic Kit Offer', type: 'Banner', status: 'Active',
    reach: 55000, conversions: 98,
    startDate: "15 Jun' 26", endDate: "15 Jul' 26",
    spareName: 'Kit Offer — Starter Tool Pack',
    impressionsL30D: '55,000', currentImpressions: '46,000', currentClicks: '9,200', currentCTR: '15%',
    tabCategory: 'ST Mechanic'
  },

  // ── ST Kaarigar (3 banners) ──────────────────────────────────
  {
    id: 'banner-kg-1', name: 'Kaarigar Welcome Banner', type: 'Banner', status: 'Active',
    reach: 68000, conversions: 180,
    startDate: "01 Jun' 26", endDate: "30 Jun' 26",
    spareName: 'Welcome Banner — Register Now',
    impressionsL30D: '68,000', currentImpressions: '58,000', currentClicks: '11,500', currentCTR: '19%',
    tabCategory: 'ST Kaarigar'
  },
  {
    id: 'banner-kg-2', name: 'Kaarigar Earnings Promo', type: 'Banner', status: 'Active',
    reach: 52000, conversions: 134,
    startDate: "05 Jun' 26", endDate: "05 Aug' 26",
    spareName: 'Earnings Promo — Earn ₹50K/mo',
    impressionsL30D: '52,000', currentImpressions: '44,000', currentClicks: '8,800', currentCTR: '16%',
    tabCategory: 'ST Kaarigar'
  },
  {
    id: 'banner-kg-3', name: 'Kaarigar Badge Campaign', type: 'Banner', status: 'Active',
    reach: 39000, conversions: 88,
    startDate: "15 Jun' 26", endDate: "31 Jul' 26",
    spareName: 'Badge Campaign — Top Kaarigar',
    impressionsL30D: '39,000', currentImpressions: '32,000', currentClicks: '6,400', currentCTR: '14%',
    tabCategory: 'ST Kaarigar'
  },

  // ── ST Exchange (3 banners) ──────────────────────────────────
  {
    id: 'banner-ex-1', name: 'Exchange Hero Banner', type: 'Banner', status: 'Active',
    reach: 120000, conversions: 56,
    startDate: "01 Jun' 26", endDate: "30 Jun' 26",
    spareName: 'Hero Banner — Sell Used Machinery',
    impressionsL30D: '1.2L', currentImpressions: '1.0L', currentClicks: '21,000', currentCTR: '20%',
    tabCategory: 'ST Exchange'
  },
  {
    id: 'banner-ex-2', name: 'Exchange Buyer Promo', type: 'Banner', status: 'Active',
    reach: 89000, conversions: 41,
    startDate: "08 Jun' 26", endDate: "08 Jul' 26",
    spareName: 'Buyer Promo — 0% Commission',
    impressionsL30D: '89,000', currentImpressions: '74,000', currentClicks: '15,500', currentCTR: '17%',
    tabCategory: 'ST Exchange'
  },
  {
    id: 'banner-ex-3', name: 'Exchange Valuation Strip', type: 'Banner', status: 'Active',
    reach: 64000, conversions: 28,
    startDate: "15 Jun' 26", endDate: "15 Aug' 26",
    spareName: 'Valuation Strip — Free Machine Check',
    impressionsL30D: '64,000', currentImpressions: '53,000', currentClicks: '10,200', currentCTR: '14%',
    tabCategory: 'ST Exchange'
  },

  // ── ST Academics (2 banners) ─────────────────────────────────
  {
    id: 'banner-ac-1', name: 'Academy Enrollment Banner', type: 'Banner', status: 'Active',
    reach: 48000, conversions: 320,
    startDate: "01 Jun' 26", endDate: "31 Aug' 26",
    spareName: 'Enrollment Banner — New Batch July',
    impressionsL30D: '48,000', currentImpressions: '40,000', currentClicks: '8,000', currentCTR: '20%',
    tabCategory: 'ST Academics'
  },
  {
    id: 'banner-ac-2', name: 'Academy Course Spotlight', type: 'Banner', status: 'Active',
    reach: 35000, conversions: 210,
    startDate: "15 Jun' 26", endDate: "15 Sep' 26",
    spareName: 'Course Spotlight — Advanced Stitching',
    impressionsL30D: '35,000', currentImpressions: '29,000', currentClicks: '5,800', currentCTR: '17%',
    tabCategory: 'ST Academics'
  },
];

const MOCK_STATS = [
  { label: 'Impressions', value: '1500', trend: '▲ 5%', trendLabel: '(L7D)', color: '#10b981' },
  { label: 'Clicks', value: '500', trend: '▲ 5%', trendLabel: '(L7D)', color: '#10b981' },
  { label: 'CTR', value: '500', trend: '▲ 5%', trendLabel: '(L7D)', color: '#10b981' },
  { label: 'Conversions', value: '200', trend: '▲ 5%', trendLabel: '(L7D)', color: '#10b981' },
  { label: 'Banners Active', value: '15', trend: '', trendLabel: '', color: '' },
];

export function useMarketing() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [stats, setStats] = useState(MOCK_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    // Don't show loading spinner — mock data is already in state, 
    // this is a background refresh to get live data from backend
    try {
      // 1. Fetch live banners from backend API
      // Only replace mock data if backend actually returns records (non-empty)
      const response = await apiClient.get<{ success: boolean; data: Campaign[] }>(ENDPOINTS.marketing.banners);
      if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
        setCampaigns(response.data);
      }
      // If API returns empty [] or success:false → keep mock data silently

      // 2. Fetch live metrics/stats summary
      try {
        const statsResponse = await apiClient.get<{ success: boolean; data: typeof MOCK_STATS }>(ENDPOINTS.marketing.stats);
        if (statsResponse && statsResponse.success && Array.isArray(statsResponse.data) && statsResponse.data.length > 0) {
          setStats(statsResponse.data);
        }
        // If API returns empty [] → keep mock stats silently
      } catch {
        // Silently keep mock stats
      }
    } catch {
      // API offline — mock data stays as-is, no flash
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);
  return { campaigns, stats, loading, error, refetch: fetchCampaigns };
}
