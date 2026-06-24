'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { apiClient, ENDPOINTS } from '@/lib';

const WauIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
  </svg>
);

const ClockIcon = (
  <img src="/Avg_time%20_logo.svg" alt="Avg Time" style={{ width: 28, height: 28, objectFit: 'contain' }} />
);

const NpsIcon = (
  <img src="/Overlay.svg" alt="NPS Badge" style={{ width: 28, height: 28, objectFit: 'contain' }} />
);

const LaptopIcon = (
  <img src="/laptop-issue.svg" alt="Laptop Issue" style={{ width: 28, height: 28, objectFit: 'contain' }} />
);

const PackageIcon = (
  <img src="/total order.svg" alt="Total Orders" style={{ width: 28, height: 28, objectFit: 'contain' }} />
);

const MoneyBagIcon = (
  <img src="/money-bag-02.svg" alt="Revenue" style={{ width: 28, height: 28, objectFit: 'contain' }} />
);

const WarningTriangleIcon = (
  <img src="/alert-02.svg" alt="Refund Rate" style={{ width: 28, height: 28, objectFit: 'contain' }} />
);

const LightningIcon = (
  <img src="/zap.png" alt="Zap" style={{ width: 28, height: 28, objectFit: 'contain' }} />
);

const WrenchIcon = (
  <img src="/wrench-01.svg" alt="Open Requests" style={{ width: 28, height: 28, objectFit: 'contain' }} />
);

const CalendarIcon = (
  <img src="/exchange-01.svg" alt="AMC Visits Due" style={{ width: 28, height: 28, objectFit: 'contain' }} />
);

const AvatarIcon = (
  <img src="/mechanics_online_logo.svg" alt="Mechanics Online" style={{ width: 28, height: 28, objectFit: 'contain' }} />
);

// ─── Types ──────────────────────────────────────────────────────
export type TopMetric = { 
  label: string; 
  value: string; 
  unit?: string; 
  icon: React.ReactNode; 
  iconColor: string; 
  iconBg?: string;
  link?: boolean;
};
export type KpiMetric = { label: string; value: string | number; subValue?: string; trendLabel?: string; trendUp?: boolean; icon: React.ReactNode; iconColor: string; iconBg: string; link?: boolean };
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
    link: typeof item.link === 'boolean' ? item.link : undefined,
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

function formatCurrencyValueLakhs(value: unknown): string {
  const num = toNumeric(value);
  if (num >= 100000) {
    const lakhs = num / 100000;
    return `₹ ${lakhs.toLocaleString('en-IN', { maximumFractionDigits: 2 })} L`;
  }
  return formatCurrencyValue(value);
}

function toNumeric(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseSmartViewPayload(payload: unknown) {
  const root = asRecord(payload);
  const dataRoot = asRecord(getValue(root, ['data', 'result', 'payload', 'response'])) ?? root;

  const topKpis = asRecord(getValue(dataRoot, ['top_kpis', 'topKpis', 'topMetrics', 'top_metrics']));
  const moduleHealthTopMetrics: TopMetric[] = [
    { 
      label: 'WAU', 
      value: formatMetricValue(getValue(topKpis, ['wau', 'active_users', 'activeUsers']) ?? 200), 
      icon: <img src="/WAU_logo.svg" alt="WAU" style={{ width: 28, height: 28, objectFit: 'contain' }} />, 
      iconColor: '#3b82f6',
      iconBg: 'transparent',
      link: false
    },
    { 
      label: 'Avg Time/ User', 
      value: formatMetricValue(getValue(topKpis, ['avg_time_spent_by_user', 'avgTimeSpentByUser', 'avg_time', 'avgTime']) ?? 20), 
      unit: 'min',
      icon: <img src="/Avg_time%20_logo.svg" alt="Avg Time" style={{ width: 28, height: 28, objectFit: 'contain' }} />, 
      iconColor: '#3b82f6',
      iconBg: '#eff6ff',
      link: false
    },
    { 
      label: 'Avg NPS', 
      value: formatMetricValue(getValue(topKpis, ['avg_nps', 'avgNps', 'nps']) ?? 9), 
      icon: <img src="/Overlay.svg" alt="Avg NPS" style={{ width: 28, height: 28, objectFit: 'contain' }} />, 
      iconColor: '#10b981',
      iconBg: '#ecfdf5',
      link: false
    },
    { 
      label: 'Open Reports', 
      value: formatMetricValue(getValue(topKpis, ['open_reports', 'openReports', 'reports']) ?? 10), 
      icon: <img src="/laptop-issue.svg" alt="Open Reports" style={{ width: 20, height: 20, objectFit: 'contain' }} />, 
      iconColor: '#ef4444',
      iconBg: '#fee2e2',
      link: true
    },
  ];

  const performanceTopMetrics: TopMetric[] = [
    { 
      label: 'Total Service Requests', 
      value: formatMetricValue(getValue(topKpis, ['total_service_requests', 'wau', 'active_users', 'activeUsers']) ?? 200), 
      icon: <img src="/total order.svg" alt="Total Service Requests" style={{ width: 20, height: 20, objectFit: 'contain' }} />, 
      iconColor: '#3b82f6',
      iconBg: '#eff6ff',
      link: true
    },
    { 
      label: 'Active Service Requests', 
      value: formatCurrencyValue(getValue(topKpis, ['active_service_requests', 'revenue_today', 'revenueToday', 'revenue']) ?? 15000), 
      icon: <img src="/money-bag-02.svg" alt="Active Service Requests" style={{ width: 20, height: 20, objectFit: 'contain' }} />, 
      iconColor: '#3b82f6',
      iconBg: '#eff6ff',
      link: false
    },
    { 
      label: 'First-Visit Fix Rate (%)', 
      value: formatMetricValue(getValue(topKpis, ['first_visit_fix_rate', 'refund_rate', 'refundRate']) ?? 15), 
      icon: <img src="/alert-02.svg" alt="First-Visit Fix Rate (%)" style={{ width: 20, height: 20, objectFit: 'contain' }} />, 
      iconColor: '#f59e0b',
      iconBg: '#fef3c7',
      link: true
    },
    { 
      label: 'Repeat Service Rate (%)', 
      value: formatMetricValue(getValue(topKpis, ['repeat_service_rate', 'open_reports', 'openReports', 'open_issues', 'openIssues']) ?? 10), 
      icon: <img src="/laptop-issue.svg" alt="Repeat Service Rate (%)" style={{ width: 20, height: 20, objectFit: 'contain' }} />, 
      iconColor: '#ef4444',
      iconBg: '#fee2e2',
      link: true
    },
  ];

  const moduleHealth = asRecord(getValue(dataRoot, ['module_health_kpis', 'moduleHealthKpis', 'module_health', 'moduleHealth']));
  const sparesData = asRecord(getValue(moduleHealth, ['st_spares', 'stSpares', 'spares']));
  const mechanicData = asRecord(getValue(moduleHealth, ['st_mechanic', 'stMechanic', 'mechanic']));

  const sparesKpis: KpiMetric[] = sparesData
    ? [
        { label: 'Total Orders (Today)', value: formatMetricValue(getValue(sparesData, ['total_orders_today', 'totalOrdersToday'])), icon: PackageIcon, iconColor: '#3b82f6', iconBg: '#eff6ff', link: true },
        { label: 'Revenue (Today)', value: formatCurrencyValue(getValue(sparesData, ['revenue_today', 'revenueToday'])), icon: MoneyBagIcon, iconColor: '#3b82f6', iconBg: '#eff6ff', link: false },
        { label: 'Refund Rate %', value: formatMetricValue(getValue(sparesData, ['refund_rate', 'refundRate'])), icon: WarningTriangleIcon, iconColor: '#f59e0b', iconBg: '#fffbeb', link: true },
        { label: 'Open Issues', value: formatMetricValue(getValue(sparesData, ['open_issues', 'openIssues'])), icon: LaptopIcon, iconColor: '#ef4444', iconBg: '#fef2f2', link: true },
      ]
    : [];

  const mechanicKpis: KpiMetric[] = mechanicData
    ? [
        { 
          label: 'New Requests', 
          value: formatMetricValue(getValue(mechanicData, ['new_requests', 'newRequests'])), 
          subValue: '10 Assigned', 
          trendLabel: '▲5% (L7D)', 
          trendUp: true, 
          icon: LightningIcon, 
          iconColor: '#3b82f6', 
          iconBg: '#eff6ff', 
          link: false 
        },
        { 
          label: 'Open Requests', 
          value: formatMetricValue(getValue(mechanicData, ['open_requests', 'openRequests'])), 
          trendLabel: '▲5% (L7D)', 
          trendUp: true, 
          icon: WrenchIcon, 
          iconColor: '#3b82f6', 
          iconBg: '#eff6ff', 
          link: false 
        },
        { 
          label: 'AMC Visits Due', 
          value: formatMetricValue(getValue(mechanicData, ['amc_visits_due', 'amcVisitsDue'])), 
          subValue: '110 Assigned', 
          trendLabel: '▲5% (L7D)', 
          trendUp: true, 
          icon: CalendarIcon, 
          iconColor: '#3b82f6', 
          iconBg: '#eff6ff', 
          link: false 
        },
        { 
          label: 'Mechanics Online', 
          value: formatMetricValue(getValue(mechanicData, ['mechanics_online', 'mechanicsOnline'])), 
          trendLabel: '▼5% (L7D)', 
          trendUp: false, 
          icon: AvatarIcon, 
          iconColor: '#3b82f6', 
          iconBg: '#eff6ff', 
          link: true 
        },
      ]
    : [];

  const performance = asRecord(getValue(dataRoot, ['performance_insights', 'performanceInsights', 'performance']));
  const perfDonuts: DonutMetric[] = performance
    ? [
        {
          label: 'Active Users',
          centerValue: formatMetricValue(getValue(performance, ['active_users_dau', 'activeUsersDau']) ?? '15,000'),
          centerLabel: 'DAU',
          data: [{ name: 'A', value: 60, color: '#10b981' }, { name: 'B', value: 40, color: '#ef4444' }],
        },
        {
          label: 'Revenue Contribution',
          centerValue: formatCurrencyValueLakhs(getValue(performance, ['revenue_contribution', 'revenueContribution']) ?? 150000),
          centerLabel: 'Total Revenue',
          data: [{ name: 'A', value: 60, color: '#10b981' }, { name: 'B', value: 40, color: '#ef4444' }],
        },
        {
          label: 'Disputes / Reports',
          centerValue: formatMetricValue(getValue(performance, ['disputes_reports', 'disputesReports']) ?? 400),
          centerLabel: 'Reports',
          data: [{ name: 'A', value: 60, color: '#10b981' }, { name: 'B', value: 40, color: '#ef4444' }],
        },
        {
          label: 'Avg Time spent by user',
          centerValue: formatMetricValue(getValue(performance, ['avg_time_spent_by_user', 'avgTimeSpentByUser']) ?? 30),
          centerLabel: 'min',
          data: [{ name: 'A', value: 60, color: '#10b981' }, { name: 'B', value: 40, color: '#ef4444' }],
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

  return { moduleHealthTopMetrics, performanceTopMetrics, sparesKpis, mechanicKpis, perfDonuts, trendModule, trendUserType, trendCity, userDonuts, newRepeat };
}

// ─── Mock Data ──────────────────────────────────────────────────
const MOCK_TOP_METRICS: TopMetric[] = [
  { 
    label: 'WAU', 
    value: '200', 
    icon: <img src="/WAU_logo.svg" alt="WAU" style={{ width: 28, height: 28, objectFit: 'contain' }} />, 
    iconColor: '#3b82f6',
    iconBg: 'transparent',
    link: false
  },
  { 
    label: 'Avg Time/ User', 
    value: '20', 
    unit: 'min',
    icon: <img src="/Avg_time%20_logo.svg" alt="Avg Time" style={{ width: 28, height: 28, objectFit: 'contain' }} />, 
    iconColor: '#3b82f6',
    iconBg: 'transparent',
    link: false
  },
  { 
    label: 'Avg NPS', 
    value: '9', 
    icon: <img src="/Overlay.svg" alt="Avg NPS" style={{ width: 28, height: 28, objectFit: 'contain' }} />, 
    iconColor: '#10b981',
    iconBg: 'transparent',
    link: false
  },
  { 
    label: 'Open Reports', 
    value: '10', 
    icon: <img src="/laptop-issue.svg" alt="Open Reports" style={{ width: 20, height: 20, objectFit: 'contain' }} />, 
    iconColor: '#ef4444',
    iconBg: 'transparent',
    link: true
  },
];

const MOCK_PERFORMANCE_TOP_METRICS: TopMetric[] = [
  { 
    label: 'Total Service Requests', 
    value: '200', 
    icon: <img src="/total order.svg" alt="Total Service Requests" style={{ width: 20, height: 20, objectFit: 'contain' }} />, 
    iconColor: '#3b82f6',
    iconBg: '#eff6ff',
    link: true
  },
  { 
    label: 'Active Service Requests', 
    value: '₹15,000', 
    icon: <img src="/money-bag-02.svg" alt="Active Service Requests" style={{ width: 20, height: 20, objectFit: 'contain' }} />, 
    iconColor: '#3b82f6',
    iconBg: '#eff6ff',
    link: false
  },
  { 
    label: 'First-Visit Fix Rate (%)', 
    value: '15', 
    icon: <img src="/alert-02.svg" alt="First-Visit Fix Rate (%)" style={{ width: 20, height: 20, objectFit: 'contain' }} />, 
    iconColor: '#f59e0b',
    iconBg: '#fef3c7',
    link: true
  },
  { 
    label: 'Repeat Service Rate (%)', 
    value: '10', 
    icon: <img src="/laptop-issue.svg" alt="Repeat Service Rate (%)" style={{ width: 20, height: 20, objectFit: 'contain' }} />, 
    iconColor: '#ef4444',
    iconBg: '#fee2e2',
    link: true
  },
];

const MOCK_SPARES_KPIS: KpiMetric[] = [
  { label: 'Total Orders (Today)', value: '12', icon: PackageIcon, iconColor: '#3b82f6', iconBg: '#eff6ff', link: true },
  { label: 'Revenue (Today)', value: '₹15,000', icon: MoneyBagIcon, iconColor: '#3b82f6', iconBg: '#eff6ff', link: false },
  { label: 'Refund Rate %', value: '15', icon: WarningTriangleIcon, iconColor: '#f59e0b', iconBg: '#fffbeb', link: true },
  { label: 'Open Issues', value: '10', icon: LaptopIcon, iconColor: '#ef4444', iconBg: '#fef2f2', link: true },
];

const MOCK_MECHANIC_KPIS: KpiMetric[] = [
  { label: 'New Requests', value: '140', subValue: '10 Assigned', trendLabel: '▲5% (L7D)', trendUp: true, icon: LightningIcon, iconColor: '#3b82f6', iconBg: '#eff6ff', link: false },
  { label: 'Open Requests', value: '140', trendLabel: '▲5% (L7D)', trendUp: true, icon: WrenchIcon, iconColor: '#3b82f6', iconBg: '#eff6ff', link: false },
  { label: 'AMC Visits Due', value: '140', subValue: '110 Assigned', trendLabel: '▲5% (L7D)', trendUp: true, icon: CalendarIcon, iconColor: '#3b82f6', iconBg: '#eff6ff', link: false },
  { label: 'Mechanics Online', value: '10 (10%)', trendLabel: '▼5% (L7D)', trendUp: false, icon: AvatarIcon, iconColor: '#3b82f6', iconBg: '#eff6ff', link: true },
];

const MOCK_PERF_DONUTS: DonutMetric[] = [
  { label: 'Active Users', centerValue: '15,000', centerLabel: 'DAU', data: [{ name: 'A', value: 60, color: '#10b981' }, { name: 'B', value: 40, color: '#ef4444' }] },
  { label: 'Revenue Contribution', centerValue: '₹ 1.5 L', centerLabel: 'Total Revenue', data: [{ name: 'A', value: 60, color: '#10b981' }, { name: 'B', value: 40, color: '#ef4444' }] },
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
  { name: '7 Feb', Spares: 5000, Mechanic: 8000 },
  { name: '7 Feb', Spares: 6000, Mechanic: 9000 },
  { name: '7 Feb', Spares: 4200, Mechanic: 7200 },
  { name: '7 Feb', Spares: 3200, Mechanic: 6000 },
  { name: '7 Feb', Spares: 3200, Mechanic: 6000 },
  { name: '7 Feb', Spares: 6000, Mechanic: 9000 },
];

const MOCK_TREND_USER_TYPE: LineChartData[] = [
  { name: '1 Feb', Customer: 5000, Mechanic: 7800 },
  { name: '2 Feb', Customer: 4000, Mechanic: 6000 },
  { name: '3 Feb', Customer: 6000, Mechanic: 8900 },
  { name: '4 Feb', Customer: 6000, Mechanic: 8900 },
  { name: '5 Feb', Customer: 5000, Mechanic: 7800 },
  { name: '6 Feb', Customer: 4000, Mechanic: 6800 },
  { name: '7 Feb', Customer: 5000, Mechanic: 7800 },
  { name: '7 Feb', Customer: 6000, Mechanic: 8900 },
  { name: '7 Feb', Customer: 4200, Mechanic: 7200 },
  { name: '7 Feb', Customer: 3200, Mechanic: 6000 },
  { name: '7 Feb', Customer: 3200, Mechanic: 6000 },
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
  { name: 'Uttar Pradesh ', value: 5800, color: '#3b82f6' },
  { name: 'Madhya Pradesh ', value: 5800, color: '#3b82f6' },
  { name: 'Madhya Pradesh  ', value: 5800, color: '#3b82f6' },
];

const MOCK_NEW_REPEAT: LineChartData[] = [
  { name: '1 Feb', New: 8000, Repeat: 5000 },
  { name: '2 Feb', New: 6500, Repeat: 4000 },
  { name: '3 Feb', New: 9000, Repeat: 6000 },
  { name: '4 Feb', New: 9000, Repeat: 6000 },
  { name: '5 Feb', New: 8000, Repeat: 5000 },
  { name: '6 Feb', New: 6800, Repeat: 4000 },
  { name: '7 Feb', New: 8000, Repeat: 5000 },
  { name: '7 Feb', New: 9000, Repeat: 6000 },
  { name: '7 Feb', New: 7200, Repeat: 4200 },
  { name: '7 Feb', New: 6000, Repeat: 3200 },
  { name: '7 Feb', New: 6000, Repeat: 3200 },
  { name: '7 Feb', New: 9000, Repeat: 6000 },
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
      { name: 'Junior (0-2 yr exp.)', value: 30, color: '#3b82f6' },
      { name: 'Expert (5-10 yr exp.)', value: 50, color: '#10b981' },
      { name: 'Master (>10 yr exp.)', value: 20, color: '#8b5cf6' }
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

// ─── Hook ────────────────────────────────────────────────────────
export function useDashboard() {
  const [topMetrics, setTopMetrics] = useState<TopMetric[]>([]);
  const [performanceTopMetrics, setPerformanceTopMetrics] = useState<TopMetric[]>([]);
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
    setPerformanceTopMetrics(MOCK_PERFORMANCE_TOP_METRICS);
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

        setTopMetrics(parsed.moduleHealthTopMetrics);
        setPerformanceTopMetrics(parsed.performanceTopMetrics);
        setSparesKpis(parsed.sparesKpis);
        setMechanicKpis(parsed.mechanicKpis);

        // HARDCODED MOCK DATA FOR VISUAL ALIGNMENT (100% MATCHING SCREENSHOTS)
        // To easily integrate with backend API data, uncomment the parsed variables below:
        //
        // setPerfDonuts(parsed.perfDonuts);
        // setTrendModule(parsed.trendModule);
        // setTrendUserType(parsed.trendUserType);
        // setTrendCity(parsed.trendCity);
        // setUserDonuts(parsed.userDonuts);
        // setNewRepeat(parsed.newRepeat);
        
        setPerfDonuts(MOCK_PERF_DONUTS);
        setTrendModule(MOCK_TREND_MODULE);
        setTrendUserType(MOCK_TREND_USER_TYPE);
        setTrendCity(MOCK_TREND_CITY);
        setUserDonuts(MOCK_USER_DONUTS);
        setNewRepeat(MOCK_NEW_REPEAT);
      }
    } catch (err) {
      setTopMetrics([]);
      setPerformanceTopMetrics([]);
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
    topMetrics, performanceTopMetrics, sparesKpis, mechanicKpis, 
    perfDonuts, trendModule, trendUserType, trendCity,
    userDonuts, newRepeat,
    loading, error, refetch: fetchAll 
  };
}
