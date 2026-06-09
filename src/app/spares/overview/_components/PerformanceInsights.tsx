'use client';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { InsightCard, LineChartData } from '../_hooks/useOverview';
import styles from '../Overview.module.css';

type Props = {
  perfInsights: InsightCard[];
};

const MOCK_PERF_TREND: LineChartData[] = [
  { name: '1 Feb', Orders: 7800 },
  { name: '2 Feb', Orders: 6500 },
  { name: '3 Feb', Orders: 8800 },
  { name: '4 Feb', Orders: 7900 },
  { name: '5 Feb', Orders: 6500 },
  { name: '6 Feb', Orders: 7800 },
  { name: '7 Feb', Orders: 8900 },
  { name: '8 Feb', Orders: 6800 },
  { name: '9 Feb', Orders: 5900 },
  { name: '10 Feb', Orders: 8800 },
];

export default function PerformanceInsights({ perfInsights }: Props) {
  
  const CustomDot = (props: any) => {
    const { cx, cy } = props;
    return (
      <circle cx={cx} cy={cy} r={4} stroke="#f59e0b" strokeWidth={2} fill="white" />
    );
  };

  const TopCard = ({ num }: { num: number }) => (
    <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', position: 'relative', overflow: 'hidden', minWidth: '220px', flex: 1 }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>Industrial Sewing Needle</div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>₹5,00,000 <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>(500 Units)</span></div>
      <div style={{ position: 'absolute', right: '-10px', bottom: '-20px', fontSize: '6rem', fontWeight: 900, color: '#3b82f6', opacity: 0.05, lineHeight: 1 }}>{num}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ── Key Insights Row ───────────────────────────────────── */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Key Insights</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {perfInsights.map((card, i) => {
            const bgColors = ['#eff6ff', '#eff6ff', '#fef2f2', '#fef2f2'];
            const textColors = ['#1d4ed8', '#1d4ed8', '#b91c1c', '#b91c1c'];
            return (
              <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ background: bgColors[i], color: textColors[i], padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1rem' }}>{i < 2 ? '↗' : '⚠️'}</span> {card.title}
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>{card.value}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
                    {card.subtitle} <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>{card.tag}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Performance Trend ──────────────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.cardHeaderRow}>
          <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Performance Trend</h2>
          <div className={styles.actions}>
            <button style={{ background: '#111827', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>Compare <span>⇄</span></button>
            <select className={styles.select}><option>By Category</option></select>
            <select className={styles.select}><option>Demo Category</option></select>
          </div>
        </div>
        <div style={{ height: 280, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #fef3c720, transparent)', pointerEvents: 'none' }} />
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_PERF_TREND} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[0, 10000]} />
              <Tooltip cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="linear" dataKey="Orders" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={<CustomDot />} activeDot={{ r: 6, fill: '#f59e0b' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Top Categories & SKUs ────────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.cardHeaderRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Top Categories</h2>
            <select className={styles.select} style={{ padding: '0.25rem 0.5rem' }}><option>By Revenue</option></select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af' }}>←</button>
            <button style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111827' }}>→</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {[1, 2, 3, 4].map(num => <TopCard key={num} num={num} />)}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeaderRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Top SKUs</h2>
            <select className={styles.select} style={{ padding: '0.25rem 0.5rem' }}><option>By Revenue</option></select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af' }}>←</button>
            <button style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111827' }}>→</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {[1, 2, 3, 4].map(num => <TopCard key={num} num={num} />)}
        </div>
      </div>

    </div>
  );
}
