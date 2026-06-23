import React from 'react';

export default function OrdersSummaryCards() {
  const cards = [
    {
      title: 'New Requests',
      value: '140',
      subValue: '10 Assigned',
      trend: '▲ 5% (L7D)',
      trendColor: '#10b981',
      icon: (
        <img src="/zap.png" alt="New Requests" style={{ width: 20, height: 20, objectFit: 'contain' }} />
      )
    },
    {
      title: 'Open Requests',
      value: '140',
      subValue: null,
      trend: '▲ 5% (L7D)',
      trendColor: '#10b981',
      icon: (
        <img src="/wrench-01.svg" alt="Open Requests" style={{ width: 20, height: 20, objectFit: 'contain' }} />
      )
    },
    {
      title: 'AMC Visits Due',
      value: '140',
      subValue: '110 Assigned',
      trend: '▲ 5% (L7D)',
      trendColor: '#10b981',
      icon: (
        <img src="/exchange-01.svg" alt="AMC Visits Due" style={{ width: 20, height: 20, objectFit: 'contain' }} />
      )
    },
    {
      title: 'Mechanics Online',
      value: '10',
      subValue: null,
      inlinePercent: '(10%)',
      trend: '▼ 5% (L7D)',
      trendColor: '#10b981', // In mockup it is green despite down arrow
      icon: (
        <img src="/mechnaics%20_online_logo.png" alt="Mechanics Online" style={{ width: 20, height: 20, objectFit: 'contain' }} />
      )
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
      {cards.map((card, idx) => (
        <div key={idx} style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} 
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: 600 }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '0.25rem', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.icon}
              </div>
              {card.title}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: card.trendColor }}>
              {card.trend}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
                {card.value}
              </div>
              {card.inlinePercent && (
                <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
                  {card.inlinePercent} <svg style={{ display: 'inline' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </div>
              )}
            </div>
            {card.subValue && (
              <div style={{ backgroundColor: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>
                {card.subValue}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
