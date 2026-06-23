import React from 'react';

export default function SummaryCards() {
  const cards = [
    {
      title: 'Total Service Requests',
      value: '200',
      icon: (
        <img src="/sewtech_spare_logo.png" alt="Total Service Requests" style={{ width: 20, height: 20, objectFit: 'contain' }} />
      ),
      iconBg: '#eff6ff',
      link: true
    },
    {
      title: 'Active Service Requests',
      value: '₹15,000',
      icon: (
        <img src="/money-bag-02.svg" alt="Revenue" style={{ width: 20, height: 20, objectFit: 'contain' }} />
      ),
      iconBg: '#eff6ff',
      link: false
    },
    {
      title: 'First-Visit Fix Rate (%)',
      value: '15',
      icon: (
        <img src="/alert-02.svg" alt="Fix Rate" style={{ width: 20, height: 20, objectFit: 'contain' }} />
      ),
      iconBg: '#fef3c7',
      link: true
    },
    {
      title: 'Repeat Service Rate (%)',
      value: '10',
      icon: (
        <img src="/laptop-issue.svg" alt="Repeat Rate" style={{ width: 20, height: 20, objectFit: 'contain' }} />
      ),
      iconBg: '#fee2e2',
      link: true
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
      {cards.map((card, idx) => (
        <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: 500 }}>
            <div style={{ backgroundColor: card.iconBg, padding: '0.25rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {card.icon}
            </div>
            {card.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
              {card.value}
            </div>
            {card.link && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
