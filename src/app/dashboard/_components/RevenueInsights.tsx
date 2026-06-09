'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RevenuePoint } from '../_hooks/useDashboard';

type Props = { revenue: RevenuePoint[] };

export default function RevenueInsights({ revenue }: Props) {
  const totalRevenue = revenue.reduce((s, r) => s + r.revenue, 0);
  const totalRefunds = revenue.reduce((s, r) => s + r.refunds, 0);
  const totalNet = revenue.reduce((s, r) => s + r.netRevenue, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {[
          { label: 'Gross Revenue', value: `₹${(totalRevenue/1000).toFixed(0)}K`, color: '#3b82f6', icon: '📈' },
          { label: 'Total Refunds', value: `₹${(totalRefunds/1000).toFixed(0)}K`, color: '#ef4444', icon: '↩️' },
          { label: 'Net Revenue', value: `₹${(totalNet/1000).toFixed(0)}K`, color: '#10b981', icon: '💰' },
        ].map(s => (
          <div key={s.label} className="card" style={{ borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: s.color }}>{s.icon} {s.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Last 6 months</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.05rem' }}>Revenue Trend (Last 6 Months)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
            <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
            <Area type="monotone" dataKey="netRevenue" name="Net Revenue" stroke="#10b981" strokeWidth={2} fill="url(#netGrad)" />
            <Area type="monotone" dataKey="refunds" name="Refunds" stroke="#ef4444" strokeWidth={2} fill="none" strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', justifyContent: 'center' }}>
          {[{label:'Gross Revenue',color:'#3b82f6'},{label:'Net Revenue',color:'#10b981'},{label:'Refunds',color:'#ef4444'}].map(l => (
            <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#6b7280' }}>
              <span style={{ width: '20px', height: '3px', background: l.color, borderRadius: '2px' }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
