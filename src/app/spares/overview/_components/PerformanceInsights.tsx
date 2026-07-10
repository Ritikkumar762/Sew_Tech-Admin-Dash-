'use client';

import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { InsightCard, LineChartData } from '../_hooks/useOverview';
import styles from '../Overview.module.css';

type Props = {
  perfInsights: InsightCard[];
};

// Exact dates and values matching the Figma mockup (6 repeated 7 Feb ticks at the end)
const MOCK_PERF_TREND: LineChartData[] = [
  { name: '1 Feb', Orders: 7800 },
  { name: '2 Feb', Orders: 6700 },
  { name: '3 Feb', Orders: 8800 },
  { name: '4 Feb', Orders: 8800 },
  { name: '5 Feb', Orders: 8000 },
  { name: '6 Feb', Orders: 6700 },
  { name: '7 Feb', Orders: 7800 },
  { name: '7 Feb', Orders: 8800 },
  { name: '7 Feb', Orders: 7000 },
  { name: '7 Feb', Orders: 6000 },
  { name: '7 Feb', Orders: 6000 },
  { name: '7 Feb', Orders: 8800 },
];

const MOCK_PERF_TREND_COMPARE = [
  { name: '1 Feb', 'Category 1': 5000, 'Category 2': 7800 },
  { name: '2 Feb', 'Category 1': 4000, 'Category 2': 6700 },
  { name: '3 Feb', 'Category 1': 6000, 'Category 2': 8800 },
  { name: '4 Feb', 'Category 1': 6000, 'Category 2': 8800 },
  { name: '5 Feb', 'Category 1': 5000, 'Category 2': 8000 },
  { name: '6 Feb', 'Category 1': 4000, 'Category 2': 6700 },
  { name: '7 Feb', 'Category 1': 5000, 'Category 2': 7800 },
  { name: '7 Feb', 'Category 1': 6000, 'Category 2': 8800 },
  { name: '7 Feb', 'Category 1': 4300, 'Category 2': 7000 },
  { name: '7 Feb', 'Category 1': 3200, 'Category 2': 6000 },
  { name: '7 Feb', 'Category 1': 3200, 'Category 2': 6000 },
  { name: '7 Feb', 'Category 1': 6000, 'Category 2': 8800 },
];

// Custom Tooltip to display currency in ₹ formatted amount
const ChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '10px 16px',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        fontSize: '12px',
        color: '#1f2937',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{ fontWeight: 500, color: '#6b7280', marginBottom: '2px' }}>
          {payload[0].payload.name} 2026
        </div>
        {payload.map((item: any, idx: number) => {
          const val = item.value;
          const formatted = typeof val === 'number' ? `₹ ${val.toLocaleString('en-IN')}` : val;
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
              <span style={{ fontWeight: 700, color: '#111827' }}>
                {item.name}: {formatted}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function PerformanceInsights({ perfInsights }: Props) {
  const [isComparing, setIsComparing] = useState(false);

  const CustomDot = ({ cx, cy, strokeColor = '#f59e0b' }: any) => {
    return (
      <circle cx={cx} cy={cy} r={4} stroke={strokeColor} strokeWidth={2} fill="white" />
    );
  };

  const TopCard = ({ num }: { num: number }) => (
    <div style={{ 
      background: '#eff6ff', 
      border: '1px solid rgba(211, 208, 255, 0.4)', 
      borderRadius: '12px', 
      padding: '20px', 
      position: 'relative', 
      overflow: 'hidden', 
      minWidth: '220px', 
      flex: 1,
      boxSizing: 'border-box'
    }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
        Industrial Sewing Needle
      </div>
      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        ₹5,00,000 
        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>(500 Units)</span>
      </div>
      <div style={{ 
        position: 'absolute', 
        right: '-10px', 
        bottom: '-25px', 
        fontSize: '7.5rem', 
        fontWeight: 900, 
        color: '#3b82f6', 
        opacity: 0.08, 
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none'
      }}>
        {num}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ── Key Insights Row ───────────────────────────────────── */}
      <div className={styles.card} style={{ padding: '20px' }}>
        <h2 className={styles.cardTitle} style={{ margin: '0 0 16px 0' }}>Key Insights</h2>
        <div className={styles.keyInsightsGrid}>
          {perfInsights.map((card, i) => {
            const bgColors = ['#E8F0FE', '#E8F0FE', '#FCE8E6', '#FCE8E6'];
            const titleColors = ['#1a73e8', '#1a73e8', '#d93025', '#d93025'];
            
            // Render specific icon
            let icon = (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            );
            if (i >= 2) {
              icon = (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              );
            }

            return (
              <div 
                key={i} 
                style={{ 
                  backgroundColor: bgColors[i], 
                  borderRadius: '12px', 
                  padding: '16px 20px', 
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: '1px solid rgba(211, 208, 255, 0.2)'
                }}
              >
                {/* Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: titleColors[i] }}>
                  {icon}
                  {card.title}
                </div>

                {/* Big Value */}
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  {card.value}
                </div>

                {/* Subtitle Pill / Text */}
                {i === 3 ? (
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 500, marginTop: 'auto' }}>
                    {card.subtitle}
                  </div>
                ) : (
                  <div style={{ marginTop: 'auto', display: 'flex' }}>
                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '9999px', 
                      padding: '4px 12px', 
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                      <span style={{ fontWeight: 700, color: '#111827' }}>{card.subtitle}</span>
                      <span style={{ color: '#6b7280', fontWeight: 500 }}>{card.tag}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Performance Trend ──────────────────────────────────── */}
      <div className={styles.card} style={{ padding: '20px' }}>
        <div className={styles.cardHeaderRow} style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Performance Trend</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setIsComparing(!isComparing)}
              style={{ 
                backgroundColor: isComparing ? '#3b82f6' : '#111827', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                fontSize: '12px', 
                fontWeight: 600, 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                transition: 'background-color 0.2s'
              }}
            >
              Compare
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/>
              </svg>
            </button>
            <select style={{ 
              backgroundColor: '#f3f4f6', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '8px 16px', 
              fontSize: '12px', 
              fontWeight: 600, 
              color: '#1f2937', 
              outline: 'none',
              cursor: 'pointer'
            }}>
              <option>By Category</option>
            </select>
            {isComparing ? (
              <>
                <select style={{ 
                  backgroundColor: '#E8F0FE', 
                  border: '1px solid #3b82f6', 
                  borderRadius: '8px', 
                  padding: '8px 16px', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#3b82f6', 
                  outline: 'none',
                  cursor: 'pointer'
                }}>
                  <option>Select Category 1</option>
                </select>
                <select style={{ 
                  backgroundColor: '#FFF3E0', 
                  border: '1px solid #f59e0b', 
                  borderRadius: '8px', 
                  padding: '8px 16px', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#f59e0b', 
                  outline: 'none',
                  cursor: 'pointer'
                }}>
                  <option>Select Category 2</option>
                </select>
              </>
            ) : (
              <select style={{ 
                backgroundColor: '#f3f4f6', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '8px 16px', 
                fontSize: '12px', 
                fontWeight: 600, 
                color: '#1f2937', 
                outline: 'none',
                cursor: 'pointer'
              }}>
                <option>Demo Category</option>
              </select>
            )}
          </div>
        </div>
        <div style={{ height: '257px', width: '100%', position: 'relative' }}>
          <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height="100%">
            <LineChart 
              data={isComparing ? MOCK_PERF_TREND_COMPARE : MOCK_PERF_TREND} 
              margin={{ top: 53, right: 14, left: 30, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#9ca3af' }} 
                width={40}
                domain={[0, 10000]}
                tickCount={11}
                tickFormatter={(value) => value.toLocaleString('en-IN')}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#f3f4f6', strokeWidth: 1.5 }} />
              {isComparing ? (
                <>
                  <Line 
                    type="linear" 
                    dataKey="Category 1" 
                    name="Category 1"
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={<CustomDot strokeColor="#3b82f6" />} 
                    activeDot={{ r: 6, fill: '#3b82f6' }} 
                  />
                  <Line 
                    type="linear" 
                    dataKey="Category 2" 
                    name="Category 2"
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={<CustomDot strokeColor="#f59e0b" />} 
                    activeDot={{ r: 6, fill: '#f59e0b' }} 
                  />
                </>
              ) : (
                <Line 
                  type="linear" 
                  dataKey="Orders" 
                  name="Orders"
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={<CustomDot strokeColor="#f59e0b" />} 
                  activeDot={{ r: 6, fill: '#f59e0b' }} 
                />
              )}
              <text x={12} y={128} transform="rotate(-90 12 128)" textAnchor="middle" fill="#9ca3af" fontSize="10px" fontWeight="500">
                Orders
              </text>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Top Categories ────────────────────────────── */}
      <div className={styles.card} style={{ padding: '20px' }}>
        <div className={styles.cardHeaderRow} style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Top Categories</h2>
            <select style={{ 
              backgroundColor: '#f3f4f6', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '6px 12px', 
              fontSize: '12px', 
              fontWeight: 600, 
              color: '#1f2937', 
              outline: 'none',
              cursor: 'pointer'
            }}>
              <option>By Revenue</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ 
              background: 'none', 
              border: '1px solid #e5e7eb', 
              borderRadius: '50%', 
              width: 32, 
              height: 32, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              color: '#9ca3af',
              transition: 'all 0.2s'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <button style={{ 
              background: 'none', 
              border: '1px solid #e5e7eb', 
              borderRadius: '50%', 
              width: 32, 
              height: 32, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              color: '#111827',
              transition: 'all 0.2s'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map(num => <TopCard key={num} num={num} />)}
        </div>
      </div>

      {/* ── Top SKUs ────────────────────────────── */}
      <div className={styles.card} style={{ padding: '20px' }}>
        <div className={styles.cardHeaderRow} style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Top SKUs</h2>
            <select style={{ 
              backgroundColor: '#f3f4f6', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '6px 12px', 
              fontSize: '12px', 
              fontWeight: 600, 
              color: '#1f2937', 
              outline: 'none',
              cursor: 'pointer'
            }}>
              <option>By Revenue</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ 
              background: 'none', 
              border: '1px solid #e5e7eb', 
              borderRadius: '50%', 
              width: 32, 
              height: 32, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              color: '#9ca3af',
              transition: 'all 0.2s'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <button style={{ 
              background: 'none', 
              border: '1px solid #e5e7eb', 
              borderRadius: '50%', 
              width: 32, 
              height: 32, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              color: '#111827',
              transition: 'all 0.2s'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map(num => <TopCard key={num} num={num} />)}
        </div>
      </div>

    </div>
  );
}
