'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { apiClient, ENDPOINTS } from '@/lib';

const WauIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
  </svg>
);

const ClockIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6.5v5.5h5.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const NpsIcon = (
  <img src="/checkmark-badge-01.png" alt="NPS Badge" style={{ width: 20, height: 20, objectFit: 'contain' }} />
);

const LaptopIcon = (
  <img src="/laptop-issue.png" alt="Laptop Issue" style={{ width: 20, height: 20, objectFit: 'contain' }} />
);

const PackageIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 5.5V18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5.5l-10 5-10-5Z" />
    <path d="M2 5.5L12 2l10 3.5M12 10.5V20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const MoneyBagIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 6c0-1.66-1.34-3-3-3h-2c-1.66 0-3 1.34-3 3a3 3 0 0 0-1 2.2c0 .8.3 1.56.8 2.16C7.3 12.3 7 14.1 7 16c0 3.3 2.7 6 6 6s6-2.7 6-6c0-1.9-.3-3.7-.8-5.64.5-.6.8-1.36.8-2.16 0-.84-.36-1.63-1-2.2z" />
    <path d="M9.5 9h4M9.5 11h4M12.5 9a2.5 2.5 0 0 1-2.5 2.5h-1M9 14.5l3.5 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const WarningTriangleIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L1 21h22L12 2z" />
    <path d="M12 9v5M12 17h.01" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const LightningIcon = (
  <img src="/zap.png" alt="Zap" style={{ width: 20, height: 20, objectFit: 'contain' }} />
);

const WrenchIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M14.7 7.8a3 3 0 0 0-4.2 0l-4 4a1 1 0 0 0 0 1.4l1.5 1.5a1 1 0 0 0 1.4 0l4-4a3 3 0 0 0 1.3-2.9M13 11l-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const CalendarIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <rect x="6" y="8" width="12" height="10" rx="1.5" fill="none" stroke="white" strokeWidth="2" />
    <line x1="8" y1="6" x2="8" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="6" x2="16" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="12" x2="18" y2="12" stroke="white" strokeWidth="1.5" />
  </svg>
);

const AvatarIcon = (
  <img src="/mechnaics%20_online_logo.png" alt="Mechanics Online" style={{ width: 20, height: 20, objectFit: 'contain' }} />
);

// ─── Types ──────────────────────────────────────────────────────
export type TopMetric = { label: string; value: string; unit?: string; icon: React.ReactNode; iconColor: string };
export type KpiMetric = { label: string; value: string | number; subValue?: string; trendLabel?: string; trendUp?: boolean; icon: React.ReactNode; iconColor: string; iconBg: string };
export type DonutMetric = { label: string; centerValue: string; centerLabel: string; data: { name: string; value: number; color: string }[] };
export type LineChartData = { name: string; [key: string]: string | number };
export type BarChartData = { name: string; [key: string]: string | number | undefined; color?: string };

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

function toTopMetric(value: unknown): TopMetric | null {
  const item = asRecord(value);
  if (!item) return null;
  const label = String(item.label ?? item.name ?? item.title ?? 'Metric');
  const rawValue = item.value ?? item.amount ?? item.total ?? item.count ?? item.metric;
  const icon = String(item.icon ?? '📊');
  const iconColor = String(item.iconColor ?? item.color ?? '#3b82f6');
  return { label, value: rawValue == null ? '—' : String(rawValue), icon, iconColor };
}

function toKpiMetric(value: unknown): KpiMetric | null {
  const item = asRecord(value);
  if (!item) return null;
  const label = String(item.label ?? item.name ?? item.title ?? 'Metric');
  const rawValue = item.value ?? item.amount ?? item.total ?? item.count ?? item.metric;
  const icon = String(item.icon ?? '📊');
  const iconColor = String(item.iconColor ?? item.color ?? '#3b82f6');
  const iconBg = String(item.iconBg ?? `${iconColor}15`);
  return {
    label,
    value: rawValue == null ? '—' : String(rawValue),
    subValue: item.subValue != null ? String(item.subValue) : undefined,
    trendLabel: item.trendLabel != null ? String(item.trendLabel) : undefined,
    trendUp: typeof item.trendUp === 'boolean' ? item.trendUp : undefined,
    icon,
    iconColor,
    iconBg,
  };
}

function toDonutMetric(value: unknown): DonutMetric | null {
  const item = asRecord(value);
  if (!item) return null;
  const label = String(item.label ?? item.name ?? item.title ?? 'Metric');
  const centerValue = String(item.centerValue ?? item.value ?? item.total ?? '');
  const centerLabel = String(item.centerLabel ?? item.unit ?? '');
  const series = Array.isArray(item.data) ? item.data : Array.isArray(item.items) ? item.items : [];
  const data = series
    .map((entry) => {
      const record = asRecord(entry);
      if (!record) return null;
      return {
        name: String(record.name ?? record.label ?? 'Item'),
        value: typeof record.value === 'number' ? record.value : Number(record.value ?? 0),
        color: String(record.color ?? '#3b82f6'),
      };
    })
    .filter(Boolean) as { name: string; value: number; color: string }[];

  return { label, centerValue, centerLabel, data };
}

function toLineChartData(value: unknown): LineChartData | null {
  const item = asRecord(value);
  if (!item) return null;
  const result: LineChartData = { name: String(item.name ?? item.label ?? item.period ?? 'Series') };
  Object.entries(item).forEach(([key, entry]) => {
    if (key !== 'name' && key !== 'label' && key !== 'period' && (typeof entry === 'string' || typeof entry === 'number')) {
      result[key] = entry;
    }
  });
  return result;
}

function toBarChartData(value: unknown): BarChartData | null {
  const item = asRecord(value);
  if (!item) return null;
  const result: BarChartData = { name: String(item.name ?? item.label ?? item.period ?? 'Series') };
  Object.entries(item).forEach(([key, entry]) => {
    if (key !== 'name' && key !== 'label' && key !== 'period' && (typeof entry === 'string' || typeof entry === 'number')) {
      result[key] = entry;
    }
  });
  return result;
}

function formatMetricValue(value: unknown): string {
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? value.toLocaleString('en-IN')
      : value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  if (typeof value === 'string') return value;
  return value == null ? '—' : String(value);
}

function formatCurrencyValue(value: unknown): string {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
  }

  return formatMetricValue(value);
}

function toNumeric(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseSmartViewPayload(payload: unknown) {
  const root = asRecord(payload);
  const dataRoot = asRecord(getValue(root, ['data', 'result', 'payload', 'response'])) ?? root;

  const topKpis = asRecord(getValue(dataRoot, ['top_kpis', 'topKpis', 'topMetrics', 'top_metrics']));
  const topMetrics: TopMetric[] = [
    { label: 'WAU', value: formatMetricValue(getValue(topKpis, ['wau', 'active_users', 'activeUsers'])), icon: WauIcon, iconColor: '#3b82f6' },
    { label: 'Avg Time/ User', value: formatMetricValue(getValue(topKpis, ['avg_time_per_user', 'avgTimePerUser', 'averageTimePerUser'])), unit: 'min', icon: ClockIcon, iconColor: '#3b82f6' },
    { label: 'Avg NPS', value: formatMetricValue(getValue(topKpis, ['avg_nps', 'avgNps'])), icon: NpsIcon, iconColor: '#10b981' },
    { label: 'Open Reports', value: formatMetricValue(getValue(topKpis, ['open_reports', 'openReports'])), icon: LaptopIcon, iconColor: '#ef4444' },
  ];

  const moduleHealth = asRecord(getValue(dataRoot, ['module_health_kpis', 'moduleHealthKpis', 'module_health', 'moduleHealth']));
  const sparesData = asRecord(getValue(moduleHealth, ['st_spares', 'stSpares', 'spares']));
  const mechanicData = asRecord(getValue(moduleHealth, ['st_mechanic', 'stMechanic', 'mechanic']));

  const sparesKpis: KpiMetric[] = sparesData
    ? [
        { label: 'Total Orders (Today)', value: formatMetricValue(getValue(sparesData, ['total_orders_today', 'totalOrdersToday'])), icon: PackageIcon, iconColor: '#3b82f6', iconBg: '#eff6ff' },
        { label: 'Revenue (Today)', value: formatCurrencyValue(getValue(sparesData, ['revenue_today', 'revenueToday'])), icon: MoneyBagIcon, iconColor: '#3b82f6', iconBg: '#eff6ff' },
        { label: 'Refund Rate %', value: formatMetricValue(getValue(sparesData, ['refund_rate', 'refundRate'])), icon: WarningTriangleIcon, iconColor: '#f59e0b', iconBg: '#fffbeb' },
        { label: 'Open Issues', value: formatMetricValue(getValue(sparesData, ['open_issues', 'openIssues'])), icon: LaptopIcon, iconColor: '#ef4444', iconBg: '#fef2f2' },
      ]
    : [];

  const mechanicKpis: KpiMetric[] = mechanicData
    ? [
        { label: 'New Requests', value: formatMetricValue(getValue(mechanicData, ['new_requests', 'newRequests'])), icon: LightningIcon, iconColor: '#3b82f6', iconBg: '#eff6ff' },
        { label: 'Open Requests', value: formatMetricValue(getValue(mechanicData, ['open_requests', 'openRequests'])), icon: WrenchIcon, iconColor: '#3b82f6', iconBg: '#eff6ff' },
        { label: 'AMC Visits Due', value: formatMetricValue(getValue(mechanicData, ['amc_visits_due', 'amcVisitsDue'])), icon: CalendarIcon, iconColor: '#3b82f6', iconBg: '#eff6ff' },
        { label: 'Mechanics Online', value: formatMetricValue(getValue(mechanicData, ['mechanics_online', 'mechanicsOnline'])), icon: AvatarIcon, iconColor: '#3b82f6', iconBg: '#eff6ff' },
      ]
    : [];

  const performance = asRecord(getValue(dataRoot, ['performance_insights', 'performanceInsights', 'performance']));
  const perfDonuts: DonutMetric[] = performance
    ? [
        {
          label: 'Active Users',
          centerValue: formatMetricValue(getValue(performance, ['active_users_dau', 'activeUsersDau'])),
          centerLabel: 'DAU',
          data: [{ name: 'Users', value: Math.max(toNumeric(getValue(performance, ['active_users_dau', 'activeUsersDau'])), 1), color: '#10b981' }],
        },
        {
          label: 'Revenue Contribution',
          centerValue: formatCurrencyValue(getValue(performance, ['revenue_contribution', 'revenueContribution'])),
          centerLabel: 'Total Revenue',
          data: [{ name: 'Revenue', value: Math.max(toNumeric(getValue(performance, ['revenue_contribution', 'revenueContribution'])), 1), color: '#3b82f6' }],
        },
        {
          label: 'Disputes / Reports',
          centerValue: formatMetricValue(getValue(performance, ['disputes_reports', 'disputesReports'])),
          centerLabel: 'Reports',
          data: [{ name: 'Reports', value: Math.max(toNumeric(getValue(performance, ['disputes_reports', 'disputesReports'])), 1), color: '#ef4444' }],
        },
        {
          label: 'Avg Time spent by user',
          centerValue: formatMetricValue(getValue(performance, ['avg_time_spent_by_user', 'avgTimeSpentByUser'])),
          centerLabel: 'min',
          data: [{ name: 'Time', value: Math.max(toNumeric(getValue(performance, ['avg_time_spent_by_user', 'avgTimeSpentByUser'])), 1), color: '#f59e0b' }],
        },
      ]
    : [];

  const revenueTrendEntries = Array.isArray(getValue(performance, ['revenue_trend', 'revenueTrend']))
    ? (getValue(performance, ['revenue_trend', 'revenueTrend']) as unknown[])
    : [];

  const trendModule: LineChartData[] = revenueTrendEntries.reduce<LineChartData[]>((acc, entry) => {
    const record = asRecord(entry);
    if (!record) return acc;

    const revenue = toNumeric(getValue(record, ['revenue', 'value', 'amount']));
    acc.push({ name: String(record.date ?? record.name ?? record.label ?? 'Series'), Spares: revenue, Mechanic: revenue });
    return acc;
  }, []);

  const trendUserType: LineChartData[] = revenueTrendEntries.reduce<LineChartData[]>((acc, entry) => {
    const record = asRecord(entry);
    if (!record) return acc;

    const revenue = toNumeric(getValue(record, ['revenue', 'value', 'amount']));
    acc.push({ name: String(record.date ?? record.name ?? record.label ?? 'Series'), Customer: revenue, Mechanic: revenue });
    return acc;
  }, []);

  const trendCity: BarChartData[] = [];

  const userInsights = asRecord(getValue(dataRoot, ['user_insights', 'userInsights', 'user']));
  const userTypeDistribution = asRecord(getValue(userInsights, ['user_type_distribution', 'userTypeDistribution']));
  const mechanicExperience = asRecord(getValue(userInsights, ['mechanic_experience', 'mechanicExperience']));
  const businessSize = asRecord(getValue(userInsights, ['business_size', 'businessSize']));

  const userDonuts: DonutMetric[] = [
    userTypeDistribution
      ? {
          label: 'User Type',
          centerValue: formatMetricValue(Object.values(userTypeDistribution).reduce<number>((total, value) => total + toNumeric(value), 0)),
          centerLabel: 'Users',
          data: Object.entries(userTypeDistribution).map(([name, value], index) => ({
            name,
            value: Math.max(toNumeric(value), 1),
            color: ['#10b981', '#3b82f6', '#6366f1', '#ec4899'][index] ?? '#3b82f6',
          })),
        }
      : null,
    mechanicExperience
      ? {
          label: 'Mechanic Experience Level',
          centerValue: formatMetricValue(Object.values(mechanicExperience).reduce<number>((total, value) => total + toNumeric(value), 0)),
          centerLabel: 'Mechanics',
          data: Object.entries(mechanicExperience).map(([name, value], index) => ({
            name,
            value: Math.max(toNumeric(value), 1),
            color: ['#3b82f6', '#10b981', '#8b5cf6'][index] ?? '#3b82f6',
          })),
        }
      : null,
    businessSize
      ? {
          label: 'Business size',
          centerValue: formatMetricValue(Object.values(businessSize).reduce<number>((total, value) => total + toNumeric(value), 0)),
          centerLabel: 'Businesses',
          data: Object.entries(businessSize).map(([name, value], index) => ({
            name,
            value: Math.max(toNumeric(value), 1),
            color: ['#3b82f6', '#10b981', '#8b5cf6'][index] ?? '#3b82f6',
          })),
        }
      : null,
  ].filter((item): item is DonutMetric => Boolean(item));

  const newRepeatEntries = Array.isArray(getValue(userInsights, ['new_vs_repeat_trend', 'newVsRepeatTrend']))
    ? (getValue(userInsights, ['new_vs_repeat_trend', 'newVsRepeatTrend']) as unknown[])
    : [];
  const newRepeat: LineChartData[] = newRepeatEntries.reduce<LineChartData[]>((acc, entry) => {
    const record = asRecord(entry);
    if (!record) return acc;

    acc.push({
      name: String(record.date ?? record.name ?? record.label ?? 'Series'),
      New: toNumeric(getValue(record, ['new', 'New'])),
      Repeat: toNumeric(getValue(record, ['repeat', 'Repeat'])),
    });
    return acc;
  }, []);

  return { topMetrics, sparesKpis, mechanicKpis, perfDonuts, trendModule, trendUserType, trendCity, userDonuts, newRepeat };
}

// ─── Mock Data ──────────────────────────────────────────────────
const MOCK_TOP_METRICS: TopMetric[] = [
  { label: 'WAU', value: '200', icon: WauIcon, iconColor: '#3b82f6' },
  { label: 'Avg Time/ User', value: '20', unit: 'min', icon: ClockIcon, iconColor: '#3b82f6' },
  { label: 'Avg NPS', value: '9', icon: NpsIcon, iconColor: '#10b981' },
  { label: 'Open Reports', value: '10', icon: LaptopIcon, iconColor: '#ef4444' },
];

const MOCK_SPARES_KPIS: KpiMetric[] = [
  { label: 'Total Orders (Today)', value: '12', icon: PackageIcon, iconColor: '#3b82f6', iconBg: '#eff6ff' },
  { label: 'Revenue (Today)', value: '₹15,000', icon: MoneyBagIcon, iconColor: '#3b82f6', iconBg: '#eff6ff' },
  { label: 'Refund Rate %', value: '15', icon: WarningTriangleIcon, iconColor: '#f59e0b', iconBg: '#fffbeb' },
  { label: 'Open Issues', value: '10', icon: LaptopIcon, iconColor: '#ef4444', iconBg: '#fef2f2' },
];

const MOCK_MECHANIC_KPIS: KpiMetric[] = [
  { label: 'New Requests', value: '140', subValue: '10 Assigned', trendLabel: '▲5% (L7D)', trendUp: true, icon: LightningIcon, iconColor: '#3b82f6', iconBg: '#eff6ff' },
  { label: 'Open Requests', value: '140', trendLabel: '▲5% (L7D)', trendUp: true, icon: WrenchIcon, iconColor: '#3b82f6', iconBg: '#eff6ff' },
  { label: 'AMC Visits Due', value: '140', subValue: '110 Assigned', trendLabel: '▲5% (L7D)', trendUp: true, icon: CalendarIcon, iconColor: '#3b82f6', iconBg: '#eff6ff' },
  { label: 'Mechanics Online', value: '10 (10%)', trendLabel: '▼5% (L7D)', trendUp: false, icon: AvatarIcon, iconColor: '#3b82f6', iconBg: '#eff6ff' },
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

  const applyMockState = useCallback(() => {
    setTopMetrics(MOCK_TOP_METRICS);
    setSparesKpis(MOCK_SPARES_KPIS);
    setMechanicKpis(MOCK_MECHANIC_KPIS);

    setPerfDonuts(MOCK_PERF_DONUTS);
    setTrendModule(MOCK_TREND_MODULE);
    setTrendUserType(MOCK_TREND_USER_TYPE);
    setTrendCity(MOCK_TREND_CITY);

    setUserDonuts(MOCK_USER_DONUTS);
    setNewRepeat(MOCK_NEW_REPEAT);
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500));
        applyMockState();
      } else {
        const response = await apiClient.get<unknown>(ENDPOINTS.admin.dashboard.smartView);
        const parsed = parseSmartViewPayload(response);

        setTopMetrics(parsed.topMetrics);
        setSparesKpis(parsed.sparesKpis);
        setMechanicKpis(parsed.mechanicKpis);
        setPerfDonuts(parsed.perfDonuts);
        setTrendModule(parsed.trendModule);
        setTrendUserType(parsed.trendUserType);
        setTrendCity(parsed.trendCity);
        setUserDonuts(parsed.userDonuts);
        setNewRepeat(parsed.newRepeat);
      }
    } catch (err) {
      setTopMetrics([]);
      setSparesKpis([]);
      setMechanicKpis([]);
      setPerfDonuts([]);
      setTrendModule([]);
      setTrendUserType([]);
      setTrendCity([]);
      setUserDonuts([]);
      setNewRepeat([]);
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data from the API response.');
    } finally {
      setLoading(false);
    }
  }, [applyMockState]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { 
    topMetrics, sparesKpis, mechanicKpis, 
    perfDonuts, trendModule, trendUserType, trendCity,
    userDonuts, newRepeat,
    loading, error, refetch: fetchAll 
  };
}
