import { useState, useCallback, useEffect } from 'react';

// --- Interfaces ---
export interface KpiMetric {
  label: string;
  value: string | number;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
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

// --- Mock Data ---

const MOCK_GLOBAL_KPIS: KpiMetric[] = [
  { label: 'Total Orders (Today)', value: '12', icon: '🛍️', iconColor: '#3b82f6' },
  { label: 'Revenue (Today)', value: '₹15,000', icon: '💰', iconColor: '#3b82f6' },
  { label: 'Refund Rate %', value: '15', icon: '⚠️', iconColor: '#f59e0b' },
  { label: 'Open Issues', value: '10', icon: '🚨', iconColor: '#ef4444' },
];

const MOCK_FUNNEL: FunnelStage[] = [
  { name: 'Order Confirmed', value: 1000, subtitle: '▲ 5% (L7D)', color: '#93c5fd' },
  { name: 'Packed', value: 200, subtitle: 'On-Schedule: 80%', color: '#3b82f6', badge: '#10b981' },
  { name: 'Shipped', value: 150, subtitle: 'On-Schedule: 80%', color: '#1d4ed8', badge: '#10b981' },
  { name: 'Out for Delivery', value: 50, subtitle: 'On-Schedule: 70%', color: '#1e3a8a', badge: '#f59e0b' },
  { name: 'Delivered', value: 25, subtitle: 'On-Schedule: 10%', color: '#0f172a', badge: '#ef4444' },
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


const USE_MOCK = true; // Toggle to false to use backend APIs

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600)); // Simulate API lag
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
      } else {
        // TODO: Map to actual backend API responses
        // const [resOrder, resInv, resRev, resPerf] = await Promise.all([
        //   apiClient.get('/api/overview/order'),
        //   apiClient.get('/api/overview/inventory'),
        //   apiClient.get('/api/overview/revenue'),
        //   apiClient.get('/api/overview/performance'),
        // ]);
        // ... set state from responses ...
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch overview data.');
    } finally {
      setLoading(false);
    }
  }, []);

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
