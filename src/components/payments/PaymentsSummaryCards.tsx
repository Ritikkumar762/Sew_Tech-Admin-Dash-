import React from 'react';

export default function PaymentsSummaryCards() {
  const cards = [
    {
      title: 'Payments Received',
      value: '₹10,00,000',
      iconBg: '#dcfce7',
      iconColor: '#10b981',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )
    },
    {
      title: 'Net Payouts',
      value: '₹7,00,000',
      iconBg: '#fee2e2',
      iconColor: '#ef4444',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      ) // using plus for generic red icon or whatever is in mockup
    },
    {
      title: 'Commission Received',
      value: '₹1,00,000',
      iconBg: '#dcfce7',
      iconColor: '#10b981',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )
    },
    {
      title: 'Customer Refunds',
      value: '₹1,00,000',
      iconBg: '#fee2e2',
      iconColor: '#ef4444',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      )
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
      {cards.map((card, idx) => (
        <div key={idx} style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} 
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
            <div style={{ backgroundColor: card.iconBg, color: card.iconColor, width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {card.icon}
            </div>
            {card.title}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 600, color: '#111827', marginTop: '0.25rem' }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
