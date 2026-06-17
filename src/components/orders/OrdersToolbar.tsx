import React from 'react';

export default function OrdersToolbar() {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
      
      {/* Search Bar */}
      <div style={{ flex: 1, position: 'relative' }}>
        <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          placeholder="Search by Order" 
          style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none', fontSize: '0.875rem', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
        />
      </div>

      {/* Created On Filter */}
      <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <select style={{ padding: '0.625rem 1rem', border: 'none', borderRight: '1px solid #e5e7eb', outline: 'none', backgroundColor: 'white', color: '#374151', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
          <option>Created on</option>
        </select>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem', backgroundColor: 'white', border: 'none', cursor: 'text' }}>
          <input type="text" placeholder="" style={{ border: 'none', outline: 'none', width: '40px', backgroundColor: 'transparent' }} />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
      </div>

      {/* Apply Filters */}
      <button style={{ padding: '0.625rem 1rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#111827', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', transition: 'transform 0.2s ease, opacity 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
      >
        Apply Filters <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
      </button>

      {/* Bulk Actions */}
      <div style={{ position: 'relative' }}>
        <button style={{ padding: '0.625rem 1rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#111827', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', transition: 'transform 0.2s ease, opacity 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
        >
          Bulk Actions <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>

    </div>
  );
}
