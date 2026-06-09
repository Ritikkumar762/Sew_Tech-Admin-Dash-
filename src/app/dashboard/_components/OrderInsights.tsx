'use client';
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, CartesianGrid, YAxis,
} from 'recharts';
import {
  FunnelStage, PieSlice, TrendPoint, BreakupPoint, CancellationReason,
} from '../_hooks/useDashboard';
import styles from './OrderInsights.module.css';

type Props = {
  funnel: FunnelStage[];
  pie: PieSlice[];
  trend: TrendPoint[];
  breakup: BreakupPoint[];
  cancellations: CancellationReason[];
};

/* ─── Custom Tooltip for bar charts ─────────────────────────── */
const BarTooltip = ({ active, payload, label }: { active?: boolean; payload?: {name: string; value: number; color: string}[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDate}>{label} 2026</div>
      {payload.map((p) => (
        <div key={p.name} className={styles.tooltipRow}>
          <span>{p.name}:</span>
          <strong>{p.value}</strong>
        </div>
      ))}
      <div className={styles.tooltipLink}>View Requests</div>
    </div>
  );
};

export default function OrderInsights({ funnel, pie, trend, breakup, cancellations }: Props) {
  const total = pie.reduce((s, p) => s + p.value, 0);

  return (
    <div className={styles.container}>

      {/* ── 1. Service Request Funnel ─────────────────────────── */}
      <div className={styles.funnelCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Service Request Funnel</h2>
          <select className={styles.select}><option>All Jobs</option></select>
        </div>

        <div className={styles.funnelLabels}>
          {funnel.map((stage) => (
            <div key={stage.name} className={styles.funnelLabel}>
              <div className={styles.funnelStageName}>{stage.name}</div>
              {stage.rateLabel && <span className={styles.rateLabel}>{stage.rateLabel}</span>}
              {stage.linkLabel && <span className={styles.linkLabel}>{stage.linkLabel}</span>}
              {stage.onSchedule && (
                <span className={styles.onSchedule} style={{ color: stage.onScheduleColor }}>
                  On-Schedule: {stage.onSchedule}
                </span>
              )}
              <div className={styles.funnelValue}>{stage.value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className={styles.funnelChart}>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={funnel} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="funnelGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#bfdbfe" />
                  <stop offset="25%" stopColor="#60a5fa" />
                  <stop offset="55%" stopColor="#2563eb" />
                  <stop offset="80%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="none" fill="url(#funnelGrad)" fillOpacity={1} />
              <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Requests']} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 2. Donut + Orders Trend ───────────────────────────── */}
      <div className={styles.bottomGrid}>
        {/* Donut */}
        <div className={styles.chartCard}>
          <h2 className={styles.cardTitle}>Order Outcome Overview</h2>
          <div className={styles.donutWrapper}>
            <PieChart width={200} height={200}>
              <Pie data={pie} cx={100} cy={100} innerRadius={60} outerRadius={82} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                {pie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div className={styles.donutCenter}>
              <div className={styles.donutTotal}>{total}</div>
              <div className={styles.donutLabel}>Request</div>
            </div>
          </div>

          <div className={styles.piePcts}>
            {pie.map(p => (
              <div key={p.name} style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                {p.name}
              </div>
            ))}
          </div>
          <div className={styles.returnRate}>Request Cancellation Rate - 20%</div>
          <div className={styles.returnLink}>View Cancellation Reasons</div>
        </div>

        {/* Orders Trend Bar */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader} style={{ marginBottom: '0.75rem' }}>
            <h2 className={styles.cardTitle}>Orders Trend</h2>
            <div className={styles.trendLegend}>
              {[{ label: 'Total Requests', color: '#3b82f6' }, { label: 'Escalated', color: '#ef4444' }, { label: 'Cancelled', color: '#9ca3af' }].map(l => (
                <span key={l.label} className={styles.trendLegendItem}>
                  <span className={styles.trendDot} style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={trend} margin={{ top: 5, right: 0, left: -25, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 100]} ticks={[0,20,40,60,80,100]} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="TotalRequests" name="Total Requests" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={10} />
              <Bar dataKey="Escalated" name="Escalated" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={10} />
              <Bar dataKey="Cancelled" name="Cancelled" fill="#9ca3af" radius={[3, 3, 0, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 3. Request Breakup Trend ──────────────────────────── */}
      <div className={styles.chartCard}>
        <div className={styles.cardHeader} style={{ marginBottom: '0.75rem' }}>
          <h2 className={styles.cardTitle}>Request Breakup Trend</h2>
          <div className={styles.trendLegend}>
            {[
              { label: 'Instant Smart Booking', color: '#3b82f6' },
              { label: 'Assisted Booking', color: '#ef4444' },
              { label: 'Invite Quotes', color: '#f59e0b' },
              { label: 'Video Assistance', color: '#8b5cf6' },
              { label: 'Direct Booking', color: '#ec4899' },
            ].map(l => (
              <span key={l.label} className={styles.trendLegendItem}>
                <span className={styles.trendDot} style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={breakup} margin={{ top: 5, right: 0, left: -25, bottom: 0 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 100]} ticks={[0,20,40,60,80,100]} />
            <Tooltip content={<BarTooltip />} />
            <Bar dataKey="InstantSmart" name="Instant Smart Booking" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={8} />
            <Bar dataKey="Assisted" name="Assisted Booking" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={8} />
            <Bar dataKey="InviteQuotes" name="Invite Quotes" fill="#f59e0b" radius={[3, 3, 0, 0]} barSize={8} />
            <Bar dataKey="VideoAssist" name="Video Assistance" fill="#8b5cf6" radius={[3, 3, 0, 0]} barSize={8} />
            <Bar dataKey="DirectBooking" name="Direct Booking" fill="#ec4899" radius={[3, 3, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── 4. Top Cancellation Reasons ──────────────────────── */}
      <div className={styles.chartCard}>
        <h2 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>
          Top Cancellation Reasons <span style={{ cursor: 'pointer', color: '#3b82f6', fontSize: '0.9rem' }}>↻</span>
        </h2>
        <div className={styles.reasonsRow}>
          {cancellations.map((r) => (
            <div key={r.label} className={styles.reasonChip}>
              <span className={styles.reasonLabel}>{r.label}</span>
              <span className={styles.reasonCount}>{r.count}</span>
              <span className={styles.reasonPct}>({r.percent}%)</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
