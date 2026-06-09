'use client';
import { PerformanceStat } from '../_hooks/useDashboard';

type Props = { performance: PerformanceStat[] };

export default function PerformanceInsights({ performance }: Props) {
  const achieved = performance.filter(p => p.achieved).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        <div className="card" style={{ borderTop: '3px solid #6366f1' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6366f1' }}>🎯 KPIs Tracked</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{performance.length}</div>
        </div>
        <div className="card" style={{ borderTop: '3px solid #10b981' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>✅ Targets Achieved</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{achieved}</div>
        </div>
        <div className="card" style={{ borderTop: '3px solid #ef4444' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ef4444' }}>❌ Below Target</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{performance.length - achieved}</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
        {performance.map(p => {
          const percentage = p.achieved ? 100 : 75; // visual representation
          return (
            <div key={p.label} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Target: {p.target}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: p.achieved ? '#10b981' : '#ef4444' }}>{p.value}</div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', background: p.achieved ? '#dcfce7' : '#fee2e2', color: p.achieved ? '#15803d' : '#b91c1c' }}>
                    {p.achieved ? '✓ On Target' : '✗ Below Target'}
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percentage}%`, background: p.achieved ? '#10b981' : '#ef4444', borderRadius: '99px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
