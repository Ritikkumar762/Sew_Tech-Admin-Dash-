'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiClient, ENDPOINTS } from '@/lib';

// ─── Types ──────────────────────────────────────────────────────
export type MetricCard = { label: string; value: string; icon: string; iconColor: string };
export type FunnelStage = { name: string; value: number; rateLabel?: string; linkLabel?: string; onSchedule?: string; onScheduleColor?: string };
export type TrendPoint = { date: string; TotalRequests: number; Escalated: number; Cancelled: number };
export type PieSlice = { name: string; value: number; color: string };
export type BreakupPoint = { date: string; InstantSmart: number; Assisted: number; InviteQuotes: number; VideoAssist: number; DirectBooking: number };
export type CancellationReason = { label: string; count: number; percent: number };
export type RevenuePoint = { month: string; revenue: number; refunds: number; netRevenue: number };
export type PerformanceStat = { label: string; value: string; target: string; achieved: boolean };

// ─── Mock Data (replace fetch calls with real API) ───────────────

const MOCK_METRICS: MetricCard[] = [
  { label: 'Total Service Requests', value: '200', icon: '📋', iconColor: '#3b82f6' },
  { label: 'Active Service Requests', value: '₹15,000', icon: '🔵', iconColor: '#3b82f6' },
  { label: 'First-Visit Fix Rate (%)', value: '15', icon: '⚠️', iconColor: '#f59e0b' },
  { label: 'Repeat Service Rate (%)', value: '10', icon: '🔴', iconColor: '#ef4444' },
];

const MOCK_FUNNEL: FunnelStage[] = [
  { name: 'Requests Received', value: 1000, rateLabel: '▲5% (L7D)' },
  { name: 'Assigned', value: 200, linkLabel: 'View Unassigned ↗' },
  { name: 'In Progress', value: 150, onSchedule: '80%', onScheduleColor: '#10b981' },
  { name: 'Completed', value: 50, onSchedule: '70%', onScheduleColor: '#f59e0b' },
];

const MOCK_PIE: PieSlice[] = [
  { name: 'Completed', value: 240, color: '#10b981' },
  { name: 'Escalated', value: 80, color: '#ef4444' },
  { name: 'Cancelled', value: 80, color: '#111827' },
];

const MOCK_TREND: TrendPoint[] = [
  { date: '1 Feb', TotalRequests: 85, Escalated: 25, Cancelled: 5 },
  { date: '2 Feb', TotalRequests: 90, Escalated: 20, Cancelled: 8 },
  { date: '3 Feb', TotalRequests: 70, Escalated: 15, Cancelled: 6 },
  { date: '4 Feb', TotalRequests: 80, Escalated: 22, Cancelled: 4 },
  { date: '5 Feb', TotalRequests: 55, Escalated: 10, Cancelled: 3 },
  { date: '6 Feb', TotalRequests: 75, Escalated: 18, Cancelled: 5 },
  { date: '7 Feb', TotalRequests: 95, Escalated: 30, Cancelled: 7 },
];

const MOCK_BREAKUP: BreakupPoint[] = [
  { date: '1 Feb', InstantSmart: 70, Assisted: 25, InviteQuotes: 20, VideoAssist: 15, DirectBooking: 10 },
  { date: '2 Feb', InstantSmart: 65, Assisted: 30, InviteQuotes: 18, VideoAssist: 12, DirectBooking: 8 },
  { date: '3 Feb', InstantSmart: 80, Assisted: 20, InviteQuotes: 22, VideoAssist: 18, DirectBooking: 12 },
  { date: '4 Feb', InstantSmart: 75, Assisted: 28, InviteQuotes: 25, VideoAssist: 14, DirectBooking: 9 },
  { date: '5 Feb', InstantSmart: 60, Assisted: 22, InviteQuotes: 15, VideoAssist: 10, DirectBooking: 7 },
  { date: '6 Feb', InstantSmart: 85, Assisted: 35, InviteQuotes: 28, VideoAssist: 20, DirectBooking: 14 },
  { date: '7 Feb', InstantSmart: 90, Assisted: 32, InviteQuotes: 30, VideoAssist: 22, DirectBooking: 16 },
];

const MOCK_CANCELLATIONS: CancellationReason[] = [
  { label: 'Requested by mistake', count: 25, percent: 30 },
  { label: 'Change in schedule / plans', count: 25, percent: 30 },
  { label: 'Found a better deal', count: 25, percent: 30 },
  { label: 'Need to reschedule', count: 25, percent: 30 },
];

const MOCK_REVENUE: RevenuePoint[] = [
  { month: 'Jan', revenue: 82000, refunds: 8000, netRevenue: 74000 },
  { month: 'Feb', revenue: 95000, refunds: 5000, netRevenue: 90000 },
  { month: 'Mar', revenue: 110000, refunds: 12000, netRevenue: 98000 },
  { month: 'Apr', revenue: 88000, refunds: 7000, netRevenue: 81000 },
  { month: 'May', revenue: 130000, refunds: 10000, netRevenue: 120000 },
  { month: 'Jun', revenue: 105000, refunds: 6000, netRevenue: 99000 },
];

const MOCK_PERFORMANCE: PerformanceStat[] = [
  { label: 'First-Visit Fix Rate', value: '87%', target: '90%', achieved: false },
  { label: 'On-time Completion Rate', value: '92%', target: '90%', achieved: true },
  { label: 'Customer Satisfaction Score', value: '4.6/5', target: '4.5/5', achieved: true },
  { label: 'Repeat Service Rate', value: '20%', target: '15%', achieved: false },
  { label: 'Mechanic Response Time', value: '2.4 hrs', target: '3 hrs', achieved: true },
  { label: 'Escalation Rate', value: '18%', target: '10%', achieved: false },
];

// ─── Hook ────────────────────────────────────────────────────────
export function useDashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [pie, setPie] = useState<PieSlice[]>([]);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [breakup, setBreakup] = useState<BreakupPoint[]>([]);
  const [cancellations, setCancellations] = useState<CancellationReason[]>([]);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [performance, setPerformance] = useState<PerformanceStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    // ── Toggle this flag to switch between mock and real API ──────
    const USE_MOCK = true;
    // Set USE_MOCK = false when your backend is ready.
    // Make sure NEXT_PUBLIC_API_URL is set in .env.local
    // ─────────────────────────────────────────────────────────────

    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500));
        setMetrics(MOCK_METRICS);
        setFunnel(MOCK_FUNNEL);
        setPie(MOCK_PIE);
        setTrend(MOCK_TREND);
        setBreakup(MOCK_BREAKUP);
        setCancellations(MOCK_CANCELLATIONS);
        setRevenue(MOCK_REVENUE);
        setPerformance(MOCK_PERFORMANCE);
      } else {
        // ── Real API calls — all run in parallel ────────────────
        const [m, f, p, t, br, ca, rev, perf] = await Promise.all([
          apiClient.get<MetricCard[]>(ENDPOINTS.dashboard.metrics),
          apiClient.get<FunnelStage[]>(ENDPOINTS.dashboard.funnel),
          apiClient.get<PieSlice[]>(ENDPOINTS.dashboard.pie),
          apiClient.get<TrendPoint[]>(ENDPOINTS.dashboard.trend),
          apiClient.get<BreakupPoint[]>(ENDPOINTS.dashboard.inventory),
          apiClient.get<CancellationReason[]>(ENDPOINTS.dashboard.inventory),
          apiClient.get<RevenuePoint[]>(ENDPOINTS.dashboard.revenue),
          apiClient.get<PerformanceStat[]>(ENDPOINTS.dashboard.performance),
        ]);
        setMetrics(m); setFunnel(f); setPie(p); setTrend(t);
        setBreakup(br); setCancellations(ca); setRevenue(rev); setPerformance(perf);
      }
    } catch {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { metrics, funnel, pie, trend, breakup, cancellations, revenue, performance, loading, error, refetch: fetchAll };
}
