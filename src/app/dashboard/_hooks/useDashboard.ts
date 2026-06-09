'use client';
import { useState, useEffect, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────
export type MetricCard = { label: string; value: string; icon: string; iconColor: string };
export type FunnelStage = { name: string; value: number; rateLabel?: string; onSchedule?: string; onScheduleColor?: string };
export type TrendPoint = { date: string; TotalOrders: number; Return: number; Replacement: number; Cancellation: number };
export type PieSlice = { name: string; value: number; color: string };
export type InventoryItem = { id: string; name: string; sku: string; stock: number; reorderLevel: number; status: string };
export type RevenuePoint = { month: string; revenue: number; refunds: number; netRevenue: number };
export type PerformanceStat = { label: string; value: string; target: string; achieved: boolean };

// ─── Mock Data (replace fetch calls with real API) ───────────────

const MOCK_METRICS: MetricCard[] = [
  { label: 'Total Orders (Today)', value: '12', icon: '📦', iconColor: '#3b82f6' },
  { label: 'Revenue (Today)', value: '₹15,000', icon: '💰', iconColor: '#3b82f6' },
  { label: 'Refund Rate %', value: '15', icon: '⚠️', iconColor: '#f59e0b' },
  { label: 'Open Issues', value: '10', icon: '🎫', iconColor: '#ef4444' },
];

const MOCK_FUNNEL: FunnelStage[] = [
  { name: 'Order Confirmed', value: 1000, rateLabel: '+5% (L7D)', onSchedule: '80%', onScheduleColor: '#10b981' },
  { name: 'Packed', value: 200, onSchedule: '80%', onScheduleColor: '#10b981' },
  { name: 'Shipped', value: 150, onSchedule: '80%', onScheduleColor: '#10b981' },
  { name: 'Out for Delivery', value: 50, onSchedule: '70%', onScheduleColor: '#10b981' },
  { name: 'Delivered', value: 25, onSchedule: '10%', onScheduleColor: '#ef4444' },
];

const MOCK_PIE: PieSlice[] = [
  { name: 'Completed', value: 240, color: '#10b981' },
  { name: 'Return', value: 80, color: '#ef4444' },
  { name: 'Replacement', value: 40, color: '#f59e0b' },
  { name: 'Cancelled', value: 40, color: '#9ca3af' },
];

const MOCK_TREND: TrendPoint[] = [
  { date: '1 Feb', TotalOrders: 85, Return: 35, Replacement: 25, Cancellation: 15 },
  { date: '2 Feb', TotalOrders: 90, Return: 20, Replacement: 10, Cancellation: 5 },
  { date: '3 Feb', TotalOrders: 70, Return: 15, Replacement: 20, Cancellation: 10 },
  { date: '4 Feb', TotalOrders: 80, Return: 25, Replacement: 15, Cancellation: 10 },
  { date: '5 Feb', TotalOrders: 55, Return: 10, Replacement: 20, Cancellation: 5 },
  { date: '6 Feb', TotalOrders: 75, Return: 15, Replacement: 25, Cancellation: 5 },
  { date: '7 Feb', TotalOrders: 95, Return: 30, Replacement: 20, Cancellation: 15 },
];

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Motor Brush Set', sku: 'SKU-101', stock: 45, reorderLevel: 10, status: 'In Stock' },
  { id: 'i2', name: 'Needle Plate (Universal)', sku: 'SKU-102', stock: 4, reorderLevel: 10, status: 'Low Stock' },
  { id: 'i3', name: 'Bobbin Case Assembly', sku: 'SKU-103', stock: 0, reorderLevel: 5, status: 'Out of Stock' },
  { id: 'i4', name: 'Presser Foot - Zipper', sku: 'SKU-104', stock: 30, reorderLevel: 8, status: 'In Stock' },
  { id: 'i5', name: 'Feed Dog Mechanism', sku: 'SKU-105', stock: 12, reorderLevel: 15, status: 'Low Stock' },
  { id: 'i6', name: 'Tension Spring Kit', sku: 'SKU-106', stock: 8, reorderLevel: 20, status: 'Low Stock' },
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
  { label: 'Order Fulfillment Rate', value: '87%', target: '90%', achieved: false },
  { label: 'On-time Delivery Rate', value: '92%', target: '90%', achieved: true },
  { label: 'Customer Satisfaction Score', value: '4.6/5', target: '4.5/5', achieved: true },
  { label: 'Return Rate', value: '20%', target: '15%', achieved: false },
  { label: 'Mechanic Response Time', value: '2.4 hrs', target: '3 hrs', achieved: true },
  { label: 'Support Resolution Rate', value: '78%', target: '85%', achieved: false },
];

// ─── Hook ────────────────────────────────────────────────────────
export function useDashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [pie, setPie] = useState<PieSlice[]>([]);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [performance, setPerformance] = useState<PerformanceStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace each block with a real fetch call:
      // const [metricsRes, funnelRes] = await Promise.all([fetch('/api/dashboard/metrics'), fetch('/api/dashboard/funnel')]);
      await new Promise((r) => setTimeout(r, 500));
      setMetrics(MOCK_METRICS);
      setFunnel(MOCK_FUNNEL);
      setPie(MOCK_PIE);
      setTrend(MOCK_TREND);
      setInventory(MOCK_INVENTORY);
      setRevenue(MOCK_REVENUE);
      setPerformance(MOCK_PERFORMANCE);
    } catch {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { metrics, funnel, pie, trend, inventory, revenue, performance, loading, error, refetch: fetchAll };
}
