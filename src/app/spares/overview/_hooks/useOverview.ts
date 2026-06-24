import React, { useState, useCallback, useEffect } from 'react';
import { apiClient, ENDPOINTS } from '@/lib';

// --- Interfaces ---
export interface KpiMetric {
  label: string;
  value: string | number;
  icon?: any;
  iconBg?: string;
  iconColor?: string;
  link?: boolean;
}

export interface FunnelStage {
  name: string;
  value: number;
  subtitle: string;
  color: string;
  badge?: string;
}

export interface DonutData {
  name: string;
  value: number;
  color: string;
}

export interface BarChartData {
  name: string;
  [key: string]: string | number;
}

export interface LineChartData {
  name: string;
  [key: string]: string | number;
}

export interface ReasonChip {
  label: string;
  count: number;
  percentage: string;
}

export interface StockAlert {
  id: string;
  name: string;
  sku: string;
  status: 'Out of Stock' | 'Low Stock' | number;
}

export interface DeadStock {
  id: string;
  name: string;
  sku: string;
  idleDays: number;
}

export interface InsightCard {
  title: string;
  value: string;
  subtitle: string;
  tag: string;
}

type SmartViewPayload = Record<string, unknown>;

function asRecord(value: unknown): SmartViewPayload | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as SmartViewPayload) : null;
}

function getValue(root: SmartViewPayload | null, paths: string[]): unknown {
  if (!root) return null;
  for (const path of paths) {
    if (path in root && root[path] !== undefined && root[path] !== null) {
      return root[path];
    }
  }
  return null;
}

function getArray(root: SmartViewPayload | null, paths: string[]): unknown[] {
  const value = getValue(root, paths);
  return Array.isArray(value) ? value : [];
}

function toKpiMetric(value: unknown): KpiMetric | null {
  const item = asRecord(value);
  if (!item) return null;
  const label = String(item.label ?? item.name ?? item.title ?? 'Metric');
  const rawValue = item.value ?? item.amount ?? item.total ?? item.count ?? item.metric;
  
  let icon: any = '📊';
  if (label.includes('Total Orders')) {
    icon = React.createElement('img', { src: '/total order.svg', alt: 'Total Orders', style: { width: 20, height: 20, objectFit: 'contain' } });
  } else if (label.includes('Revenue')) {
    icon = React.createElement('img', { src: '/money-bag-02.svg', alt: 'Revenue', style: { width: 20, height: 20, objectFit: 'contain' } });
  } else if (label.includes('Refund')) {
    icon = React.createElement('img', { src: '/alert-02.svg', alt: 'Refund Rate', style: { width: 20, height: 20, objectFit: 'contain' } });
  } else if (label.includes('Open Issues')) {
    icon = React.createElement('img', { src: '/laptop-issue.svg', alt: 'Open Issues', style: { width: 20, height: 20, objectFit: 'contain' } });
  } else if (item.icon) {
    icon = String(item.icon);
  }
  
  const iconColor = String(item.iconColor ?? item.color ?? '#3b82f6');
  const link = !label.includes('Revenue');
  return { label, value: rawValue == null ? '—' : String(rawValue), icon, iconColor, link };
}

function toInsightCard(value: unknown): InsightCard | null {
  const item = asRecord(value);
  if (!item) return null;
  return {
    title: String(item.title ?? item.label ?? item.name ?? 'Insight'),
    value: String(item.value ?? item.amount ?? item.total ?? ''),
    subtitle: String(item.subtitle ?? item.extra ?? ''),
    tag: String(item.tag ?? item.badge ?? ''),
  };
}

function parseSmartViewPayload(payload: unknown) {
  const root = asRecord(payload);
  const dataRoot = asRecord(getValue(root, ['data', 'result', 'payload', 'response'])) ?? root;
  const topKpis = getArray(dataRoot, ['top_kpis', 'topKpis', 'kpis', 'metrics'])
    .map(toKpiMetric)
    .filter((item): item is KpiMetric => Boolean(item));
  const performanceInsights = getArray(asRecord(getValue(dataRoot, ['performance_insights', 'performanceInsights'])), ['insights', 'items', 'cards'])
    .map(toInsightCard)
    .filter((item): item is InsightCard => Boolean(item));
  return { topKpis, performanceInsights };
}

// --- Mock Data ---

const MOCK_GLOBAL_KPIS: KpiMetric[] = [
  { label: 'Total Orders (Today)', value: '12', icon: React.createElement('img', { src: '/total order.svg', alt: 'Total Orders', style: { width: 20, height: 20, objectFit: 'contain' } }), iconColor: '#3b82f6', link: true },
  { label: 'Revenue (Today)', value: '₹15,000', icon: React.createElement('img', { src: '/money-bag-02.svg', alt: 'Revenue', style: { width: 20, height: 20, objectFit: 'contain' } }), iconColor: '#3b82f6', link: false },
  { label: 'Refund Rate %', value: '15', icon: React.createElement('img', { src: '/alert-02.svg', alt: 'Refund Rate', style: { width: 20, height: 20, objectFit: 'contain' } }), iconColor: '#f59e0b', link: true },
  { label: 'Open Issues', value: '10', icon: React.createElement('img', { src: '/laptop-issue.svg', alt: 'Open Issues', style: { width: 20, height: 20, objectFit: 'contain' } }), iconColor: '#ef4444', link: true },
];

const MOCK_FUNNEL: FunnelStage[] = [
  { name: 'Order Confirmed', value: 1000, subtitle: '▲ 5% (L7D)', color: '#8CBAF0' },
  { name: 'Packed', value: 200, subtitle: 'On-Schedule: 80%', color: '#0460CA', badge: '#10b981' },
  { name: 'Shipped', value: 150, subtitle: 'On-Schedule: 80%', color: '#034B9E', badge: '#10b981' },
  { name: 'Out for Delivery', value: 50, subtitle: 'On-Schedule: 70%', color: '#023A7A', badge: '#f59e0b' },
  { name: 'Delivered', value: 25, subtitle: 'On-Schedule: 10%', color: '#001B3B', badge: '#ef4444' },
];

const MOCK_ORDER_OUTCOME: DonutData[] = [
  { name: 'Completed', value: 60, color: '#10b981' },
  { name: 'Return', value: 20, color: '#ef4444' },
  { name: 'Replacement', value: 10, color: '#f59e0b' },
  { name: 'Cancelled', value: 10, color: '#6b7280' },
];

const MOCK_ORDER_TREND: BarChartData[] = [
  { name: '1 Feb', 'Total Orders': 80, Return: 45, Replacement: 35, Cancellation: 10 },
  { name: '2 Feb', 'Total Orders': 50, Return: 20, Replacement: 15, Cancellation: 5 },
  { name: '3 Feb', 'Total Orders': 70, Return: 30, Replacement: 20, Cancellation: 8 },
  { name: '4 Feb', 'Total Orders': 90, Return: 40, Replacement: 30, Cancellation: 12 },
  { name: '5 Feb', 'Total Orders': 60, Return: 25, Replacement: 15, Cancellation: 6 },
  { name: '6 Feb', 'Total Orders': 75, Return: 35, Replacement: 25, Cancellation: 9 },
  { name: '7 Feb', 'Total Orders': 85, Return: 45, Replacement: 35, Cancellation: 11 },
];

const MOCK_CANCELLATION_REASONS: ReasonChip[] = [
  { label: 'Product quality', count: 25, percentage: '30%' },
  { label: 'Wrong size ordered', count: 25, percentage: '30%' },
  { label: 'Received wrong item', count: 25, percentage: '30%' },
];

const MOCK_INVENTORY_DONUT: DonutData[] = [
  { name: 'Fast-Moving', value: 60, color: '#3b82f6' },
  { name: 'Slow-Moving', value: 40, color: '#93c5fd' },
];

const MOCK_STOCK_CATEGORY: BarChartData[] = [
  { name: 'Category 1', 'In Stock': 78, 'Low-Stock': 0 },
  { name: 'Category 2', 'In Stock': 50, 'Low-Stock': 0 },
  { name: 'Category 3', 'In Stock': 0, 'Low-Stock': 10 },
  { name: 'Category 4', 'In Stock': 78, 'Low-Stock': 0 },
  { name: 'Category 5', 'In Stock': 78, 'Low-Stock': 0 },
  { name: 'Category 6', 'In Stock': 78, 'Low-Stock': 0 },
  { name: 'Category 7', 'In Stock': 50, 'Low-Stock': 0 },
];

const MOCK_STOCK_ALERTS: StockAlert[] = [
  { id: '1', name: 'Industrial Sewing Needle', sku: 'HC3000', status: 'Out of Stock' },
  { id: '2', name: 'Industrial Sewing Needle', sku: 'HC3000', status: 'Out of Stock' },
  { id: '3', name: 'High-Speed Rotary Hook Assembly', sku: 'HC3000', status: 2 },
  { id: '4', name: 'High-Speed Rotary Hook Assembly', sku: 'HC3000', status: 2 },
];

const MOCK_DEAD_STOCK: DeadStock[] = [
  { id: '1', name: 'High-Speed Rotary Hook Assembly', sku: 'HC3000', idleDays: 380 },
  { id: '2', name: 'High-Speed Rotary Hook Assembly', sku: 'HC3000', idleDays: 280 },
  { id: '3', name: 'Industrial Sewing Needle', sku: 'HC3000', idleDays: 240 },
  { id: '4', name: 'Industrial Sewing Needle', sku: 'HC3000', idleDays: 180 },
];

const MOCK_REVENUE_TREND: LineChartData[] = [
  { name: '1 Feb', Revenue: 7800 },
  { name: '2 Feb', Revenue: 6500 },
  { name: '3 Feb', Revenue: 8800 },
  { name: '4 Feb', Revenue: 8900 },
  { name: '5 Feb', Revenue: 8100 },
  { name: '6 Feb', Revenue: 6800 },
  { name: '7 Feb', Revenue: 7800 },
];

const MOCK_REVENUE_RISK: DonutData[] = [
  { name: 'Replacement', value: 20, color: '#ef4444' },
  { name: 'Return', value: 20, color: '#fca5a5' },
  { name: 'Cancelled', value: 60, color: '#fecaca' },
];

const MOCK_TRANSACTION_INSIGHTS: DonutData[] = [
  { name: 'Completed', value: 60, color: '#10b981' },
  { name: 'Failed', value: 20, color: '#f59e0b' },
  { name: 'Pending', value: 20, color: '#fbbf24' },
];

const MOCK_PERFORMANCE_INSIGHTS: InsightCard[] = [
  { title: 'Top Selling Spare', value: 'Industrial Sewing Needle', subtitle: '₹5,00,000', tag: '(500 Units)' },
  { title: 'Top-Selling Category', value: 'Industrial Sewing Needle', subtitle: '₹5,00,000', tag: '(38% Revenue)' },
  { title: 'High-Cancellation SKUs', value: 'Needle Bar Assembly', subtitle: '22%', tag: 'cancellation' },
  { title: 'Revenue at Risk', value: '₹5,00,000', subtitle: '(Cancellation/ Return/ Replacement)', tag: '' },
];


const USE_MOCK = true; // Toggle to true to force the local mock dataset

export function useOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [globalKpis, setGlobalKpis] = useState<KpiMetric[]>([]);
  
  // Order
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [orderOutcome, setOrderOutcome] = useState<DonutData[]>([]);
  const [orderTrend, setOrderTrend] = useState<BarChartData[]>([]);
  const [cancelReasons, setCancelReasons] = useState<ReasonChip[]>([]);
  
  // Inventory
  const [invDonut, setInvDonut] = useState<DonutData[]>([]);
  const [stockCategory, setStockCategory] = useState<BarChartData[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [deadStock, setDeadStock] = useState<DeadStock[]>([]);
  
  // Revenue
  const [revenueTrend, setRevenueTrend] = useState<LineChartData[]>([]);
  const [revenueRisk, setRevenueRisk] = useState<DonutData[]>([]);
  const [transactions, setTransactions] = useState<DonutData[]>([]);
  
  // Performance
  const [perfInsights, setPerfInsights] = useState<InsightCard[]>([]);

  const applyMockState = useCallback(() => {
    setGlobalKpis(MOCK_GLOBAL_KPIS);

    setFunnel(MOCK_FUNNEL);
    setOrderOutcome(MOCK_ORDER_OUTCOME);
    setOrderTrend(MOCK_ORDER_TREND);
    setCancelReasons(MOCK_CANCELLATION_REASONS);

    setInvDonut(MOCK_INVENTORY_DONUT);
    setStockCategory(MOCK_STOCK_CATEGORY);
    setStockAlerts(MOCK_STOCK_ALERTS);
    setDeadStock(MOCK_DEAD_STOCK);

    setRevenueTrend(MOCK_REVENUE_TREND);
    setRevenueRisk(MOCK_REVENUE_RISK);
    setTransactions(MOCK_TRANSACTION_INSIGHTS);

    setPerfInsights(MOCK_PERFORMANCE_INSIGHTS);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600)); // Simulate API lag
        applyMockState();
      } else {
        const response = await apiClient.get<unknown>(ENDPOINTS.admin.dashboard.smartView);
        const parsed = parseSmartViewPayload(response);

        setGlobalKpis(parsed.topKpis.length ? parsed.topKpis : MOCK_GLOBAL_KPIS);
        setPerfInsights(parsed.performanceInsights.length ? parsed.performanceInsights : MOCK_PERFORMANCE_INSIGHTS);
      }
    } catch {
      applyMockState();
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [applyMockState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    error,
    refetch: fetchData,
    
    globalKpis,
    
    funnel,
    orderOutcome,
    orderTrend,
    cancelReasons,
    
    invDonut,
    stockCategory,
    stockAlerts,
    deadStock,
    
    revenueTrend,
    revenueRisk,
    transactions,
    
    perfInsights,
  };
}
