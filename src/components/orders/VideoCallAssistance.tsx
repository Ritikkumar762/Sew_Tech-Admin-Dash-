'use client';

import React, { useState } from 'react';
import OrdersTable from './OrdersTable';

interface FilterOption {
  label: string;
  key: string | null;
}

export default function VideoCallAssistance({ onCounts }: { onCounts?: (counts: Record<string, number>) => void }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [filterCounts, setFilterCounts] = useState<Record<string, number>>({});

  // Video Call Assistance is a remote diagnosis flow — no mechanic dispatch/allotment
  // pill here, but Diagnosis Available is the key deliverable of the call.
  const filters: FilterOption[] = [
    { label: 'All', key: null },
    { label: 'Ongoing', key: 'ongoing' },
    { label: 'Diagnosis Available', key: 'diagnosis available' },
    { label: 'Completed', key: 'completed' },
    { label: 'Cancelled', key: 'cancelled' },
    { label: 'Support Required', key: 'support required' }
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
              {filter.label} {filter.key !== null && <span style={{ color: isFilterActive ? '#9ca3af' : '#9ca3af' }}>({filterCounts[filter.key] ?? 0})</span>}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div style={{ marginTop: '0', margin: '0 -1.5rem -1.5rem -1.5rem' }}>
        <OrdersTable activeTab="Video Call Assistance" activeFilter={activeFilter} onCounts={onCounts} onFilterCounts={setFilterCounts} />

      </div>
    </div>
  );
}
