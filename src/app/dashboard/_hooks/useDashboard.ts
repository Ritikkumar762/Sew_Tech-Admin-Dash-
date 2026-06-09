'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiClient, ENDPOINTS } from '@/lib';

// ─── Types ──────────────────────────────────────────────────────
export type TopMetric = { label: string; value: string; icon: string; iconColor: string };
export type KpiMetric = { label: string; value: string | number; subValue?: string; trendLabel?: string; trendUp?: boolean; icon: string; iconColor: string; iconBg: string };
export type DonutMetric = { label: string; centerValue: string; centerLabel: string; data: { name: string; value: number; color: string }[] };
export type LineChartData = { name: string; [key: string]: string | number };
export type BarChartData = { name: string; [key: string]: string | number; color?: string };

// ─── Mock Data ──────────────────────────────────────────────────
const MOCK_TOP_METRICS: TopMetric[] = [
  { label: 'WAU', value: '200', icon: '👤', iconColor: '#3b82f6' },
  { label: 'Avg Time/ User', value: '20 min', icon: '⏱️', iconColor: '#3b82f6' },
  { label: 'Avg NPS', value: '9', icon: '✅', iconColor: '#10b981' },
  { label: 'Open Reports', value: '10', icon: '🚨', iconColor: '#ef4444' },
];

const MOCK_SPARES_KPIS: KpiMetric[] = [
  { label: 'Total Orders (Today)', value: '12', icon: '📦', iconColor: '#3b82f6', iconBg: '#eff6ff' },
  { label: 'Revenue (Today)', value: '₹15,000', icon: '💰', iconColor: '#3b82f6', iconBg: '#eff6ff' },
  { label: 'Refund Rate %', value: '15', icon: '⚠️', iconColor: '#f59e0b', iconBg: '#fffbeb' },
  { label: 'Open Issues', value: '10', icon: '🚨', iconColor: '#ef4444', iconBg: '#fef2f2' },
];

const MOCK_MECHANIC_KPIS: KpiMetric[] = [
  { label: 'New Requests', value: '140', subValue: '10 Assigned', trendLabel: '▲5% (L7D)', trendUp: true, icon: '⚡', iconColor: '#3b82f6', iconBg: '#eff6ff' },
  { label: 'Open Requests', value: '140', trendLabel: '▲5% (L7D)', trendUp: true, icon: '🔧', iconColor: '#3b82f6', iconBg: '#eff6ff' },
  { label: 'AMC Visits Due', value: '140', subValue: '110 Assigned', trendLabel: '▲5% (L7D)', trendUp: true, icon: '📅', iconColor: '#3b82f6', iconBg: '#eff6ff' },
  { label: 'Mechanics Online', value: '10 (10%)', trendLabel: '▼5% (L7D)', trendUp: false, icon: '👷', iconColor: '#3b82f6', iconBg: '#eff6ff' },
];

const MOCK_PERF_DONUTS: DonutMetric[] = [
  { label: 'Active Users', centerValue: '15,000', centerLabel: 'DAU', data: [{ name: 'A', value: 60, color: '#10b981' }, { name: 'B', value: 40, color: '#ef4444' }] },
  { label: 'Revenue Contribution', centerValue: '₹1.5 L', centerLabel: 'Total Revenue', data: [{ name: 'A', value: 60, color: '#10b981' }, { name: 'B', value: 40, color: '#ef4444' }] },
  { label: 'Disputes / Reports', centerValue: '400', centerLabel: 'Reports', data: [{ name: 'A', value: 60, color: '#10b981' }, { name: 'B', value: 40, color: '#ef4444' }] },
  { label: 'Avg Time spent by user', centerValue: '30', centerLabel: 'min', data: [{ name: 'A', value: 60, color: '#10b981' }, { name: 'B', value: 40, color: '#ef4444' }] },
];

const MOCK_TREND_MODULE: LineChartData[] = [
  { name: '1 Feb', Spares: 5000, Mechanic: 8000 },
  { name: '2 Feb', Spares: 4000, Mechanic: 7000 },
  { name: '3 Feb', Spares: 6000, Mechanic: 9000 },
  { name: '4 Feb', Spares: 6000, Mechanic: 9000 },
  { name: '5 Feb', Spares: 5000, Mechanic: 8000 },
  { name: '6 Feb', Spares: 4000, Mechanic: 6800 },
  { name: '7 Feb', Spares: 6000, Mechanic: 8800 },
];

const MOCK_TREND_USER_TYPE: LineChartData[] = [
  { name: '1 Feb', Customer: 5000, Mechanic: 7800 },
  { name: '2 Feb', Customer: 4000, Mechanic: 6000 },
  { name: '3 Feb', Customer: 6000, Mechanic: 8900 },
  { name: '4 Feb', Customer: 6000, Mechanic: 8900 },
  { name: '5 Feb', Customer: 5000, Mechanic: 7800 },
  { name: '6 Feb', Customer: 4000, Mechanic: 6800 },
  { name: '7 Feb', Customer: 6000, Mechanic: 8900 },
];

const MOCK_TREND_CITY: BarChartData[] = [
  { name: 'Delhi', value: 7800, color: '#3b82f6' },
  { name: 'Bangalore', value: 5500, color: '#3b82f6' },
  { name: 'Hyderabad', value: 1000, color: '#ef4444' },
  { name: 'Uttar Pradesh', value: 7800, color: '#3b82f6' },
  { name: 'Madhya Pradesh', value: 7800, color: '#3b82f6' },
  { name: 'Delhi ', value: 5800, color: '#3b82f6' },
  { name: 'Bangalore ', value: 5800, color: '#3b82f6' },
  { name: 'Hyderabad ', value: 5800, color: '#3b82f6' },
];

const MOCK_USER_DONUTS: DonutMetric[] = [
  {
    label: 'User Type', centerValue: '15,000', centerLabel: 'DAU',
    data: [
      { name: 'Mechanic', value: 30, color: '#10b981' },
      { name: 'Customer (Individual)', value: 40, color: '#3b82f6' },
      { name: 'Customer (Business Owner)', value: 25, color: '#6366f1' },
      { name: 'Admin', value: 5, color: '#ec4899' }
    ]
  },
  {
    label: 'Mechanic Experience Level', centerValue: '400', centerLabel: 'Reports',
    data: [
      { name: 'Junior (0-2 yr exp.)', value: 40, color: '#3b82f6' },
      { name: 'Expert (5-10 yr exp.)', value: 60, color: '#10b981' },
      { name: 'Master (>10 yr exp.)', value: 0, color: '#8b5cf6' }
    ]
  },
  {
    label: 'Business size', centerValue: '400', centerLabel: 'Reports',
    data: [
      { name: '<100 employees', value: 40, color: '#3b82f6' },
      { name: '100-1,500 employees', value: 60, color: '#10b981' },
      { name: '500-1,500 employees', value: 0, color: '#8b5cf6' }
    ]
  },
];

const MOCK_NEW_REPEAT: LineChartData[] = [
  { name: '1 Feb', New: 8000, Repeat: 5000 },
  { name: '2 Feb', New: 6500, Repeat: 4000 },
  { name: '3 Feb', New: 9000, Repeat: 6000 },
  { name: '4 Feb', New: 9000, Repeat: 6000 },
  { name: '5 Feb', New: 8000, Repeat: 5000 },
  { name: '6 Feb', New: 6800, Repeat: 4000 },
  { name: '7 Feb', New: 9000, Repeat: 6000 },
];

// ─── Hook ────────────────────────────────────────────────────────
export function useDashboard() {
  const [topMetrics, setTopMetrics] = useState<TopMetric[]>([]);
  const [sparesKpis, setSparesKpis] = useState<KpiMetric[]>([]);
  const [mechanicKpis, setMechanicKpis] = useState<KpiMetric[]>([]);
  
  const [perfDonuts, setPerfDonuts] = useState<DonutMetric[]>([]);
  const [trendModule, setTrendModule] = useState<LineChartData[]>([]);
  const [trendUserType, setTrendUserType] = useState<LineChartData[]>([]);
  const [trendCity, setTrendCity] = useState<BarChartData[]>([]);
  
  const [userDonuts, setUserDonuts] = useState<DonutMetric[]>([]);
  const [newRepeat, setNewRepeat] = useState<LineChartData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const USE_MOCK = true;

    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500));
        setTopMetrics(MOCK_TOP_METRICS);
        setSparesKpis(MOCK_SPARES_KPIS);
        setMechanicKpis(MOCK_MECHANIC_KPIS);
        
        setPerfDonuts(MOCK_PERF_DONUTS);
        setTrendModule(MOCK_TREND_MODULE);
        setTrendUserType(MOCK_TREND_USER_TYPE);
        setTrendCity(MOCK_TREND_CITY);

        setUserDonuts(MOCK_USER_DONUTS);
        setNewRepeat(MOCK_NEW_REPEAT);
      } else {
        // Example real API fetching structure
        const [tm, sk, mk, pd, trm, tru, trc, ud, nr] = await Promise.all([
          apiClient.get<TopMetric[]>(ENDPOINTS.dashboard.metrics),
          apiClient.get<KpiMetric[]>(`${ENDPOINTS.dashboard.metrics}/spares`),
          apiClient.get<KpiMetric[]>(`${ENDPOINTS.dashboard.metrics}/mechanic`),
          apiClient.get<DonutMetric[]>(`${ENDPOINTS.dashboard.performance}/donuts`),
          apiClient.get<LineChartData[]>(`${ENDPOINTS.dashboard.performance}/trend-module`),
          apiClient.get<LineChartData[]>(`${ENDPOINTS.dashboard.performance}/trend-user`),
          apiClient.get<BarChartData[]>(`${ENDPOINTS.dashboard.performance}/trend-city`),
          apiClient.get<DonutMetric[]>(`${ENDPOINTS.dashboard.performance}/user-donuts`),
          apiClient.get<LineChartData[]>(`${ENDPOINTS.dashboard.performance}/new-repeat`),
        ]);
        setTopMetrics(tm); setSparesKpis(sk); setMechanicKpis(mk);
        setPerfDonuts(pd); setTrendModule(trm); setTrendUserType(tru); setTrendCity(trc);
        setUserDonuts(ud); setNewRepeat(nr);
      }
    } catch {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { 
    topMetrics, sparesKpis, mechanicKpis, 
    perfDonuts, trendModule, trendUserType, trendCity,
    userDonuts, newRepeat,
    loading, error, refetch: fetchAll 
  };
}
