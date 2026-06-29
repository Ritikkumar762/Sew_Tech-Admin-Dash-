'use client';

import React, { useState } from 'react';
import OrdersTable from './OrdersTable';

interface FilterOption {
  label: string;
  count: number | null;
}

export default function AssistedBooking() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters: FilterOption[] = [
    { label: 'All', count: null },
    { label: 'Mechanic Allotted', count: 767 },
    { label: 'Ongoing', count: null },
    { label: 'Completed', count: null },
    { label: 'Diagnosis Available', count: null },
    { label: 'Cancelled', count: null },
    { label: 'Flagged', count: 767 },
    { label: 'Delayed', count: null },
    { label: 'Support Required', count: 34 }
  ];

  return (
    <div>
      {/* Secondary Filter Pills */}
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #e5e7eb', overflowX: 'auto' }}>
        {filters.map((filter, idx) => {
          const isFilterActive = filter.label === activeFilter;
          return (
            <button
              key={idx}
              onClick={() => setActiveFilter(filter.label)}
              className="filter-pill"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                border: isFilterActive ? '1px solid #1f2937' : '1px solid #e5e7eb',
                backgroundColor: isFilterActive ? '#1f2937' : 'white',
                color: isFilterActive ? 'white' : '#4b5563',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {filter.label} {filter.count !== null && <span style={{ color: isFilterActive ? '#9ca3af' : '#9ca3af' }}>({filter.count})</span>}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div style={{ marginTop: '0', margin: '0 -1.5rem -1.5rem -1.5rem' }}>
        <OrdersTable activeTab="Assisted Booking" activeFilter={activeFilter} />
      </div>
    </div>
  );
}
