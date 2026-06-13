'use client';

import { useState } from 'react';

export interface DiscountFilterState {
  type: { Fixed: boolean; Percentage: boolean };
  validity: string; // '7days' | '14days' | '30days' | '6months' | 'custom' | ''
  customDateStart: string;
  customDateEnd: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: DiscountFilterState;
  onChange: (filters: DiscountFilterState) => void;
  onClear: () => void;
}

export default function DiscountFiltersSidebar({ isOpen, onClose, filters, onChange, onClear }: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    type: true,
    validity: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (key: 'Fixed' | 'Percentage', checked: boolean) => {
    onChange({
      ...filters,
      type: {
        ...filters.type,
        [key]: checked,
      },
    });
  };

  const handleValidityChange = (value: string) => {
    onChange({
      ...filters,
      validity: value,
    });
  };

  const handleCustomDateChange = (key: 'customDateStart' | 'customDateEnd', value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 999,
          backdropFilter: 'blur(2px)',
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '380px',
          backgroundColor: '#ffffff',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Filters</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={onClear}
              style={{
                background: '#fee2e2',
                color: '#ef4444',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear Filters ✕
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.25rem',
                color: '#9ca3af',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {/* Discount Type */}
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
            <div
              onClick={() => toggleSection('type')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#374151',
                marginBottom: openSections.type ? '0.75rem' : '0',
              }}
            >
              <span>Discount Type</span>
              <span>{openSections.type ? '▾' : '▸'}</span>
            </div>
            {openSections.type && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: '#4b5563' }}>
                  <input
                    type="checkbox"
                    checked={filters.type.Fixed}
                    onChange={(e) => handleCheckboxChange('Fixed', e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  Fixed
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: '#4b5563' }}>
                  <input
                    type="checkbox"
                    checked={filters.type.Percentage}
                    onChange={(e) => handleCheckboxChange('Percentage', e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  Percentage
                </label>
              </div>
            )}
          </div>

          {/* Validity */}
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem' }}>
            <div
              onClick={() => toggleSection('validity')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#374151',
                marginBottom: openSections.validity ? '0.75rem' : '0',
              }}
            >
              <span>Validity</span>
              <span>{openSections.validity ? '▾' : '▸'}</span>
            </div>
            {openSections.validity && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { key: '7days', label: 'Last 7 Days' },
                  { key: '14days', label: 'Last 14 Days' },
                  { key: '30days', label: 'Last 30 Days' },
                  { key: '6months', label: 'Last 6 Months' },
                  { key: 'custom', label: 'Select Manually' },
                ].map((option) => (
                  <label key={option.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: '#4b5563' }}>
                    <input
                      type="radio"
                      name="validityRadio"
                      checked={filters.validity === option.key}
                      onChange={() => handleValidityChange(option.key)}
                      style={{ cursor: 'pointer' }}
                    />
                    {option.label}
                  </label>
                ))}

                {filters.validity === 'custom' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', padding: '0.5rem', background: '#f9fafb', borderRadius: '6px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Start Date</span>
                      <input
                        type="date"
                        value={filters.customDateStart}
                        onChange={(e) => handleCustomDateChange('customDateStart', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.35rem 0.5rem',
                          fontSize: '0.8rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>End Date</span>
                      <input
                        type="date"
                        value={filters.customDateEnd}
                        onChange={(e) => handleCustomDateChange('customDateEnd', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.35rem 0.5rem',
                          fontSize: '0.8rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '1rem',
          }}
        >
          <button
            onClick={onClear}
            style={{
              flex: 1,
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              padding: '0.6rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: '#111827',
              color: '#ffffff',
              border: 'none',
              padding: '0.6rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Apply
          </button>
        </div>

        {/* CSS styles injection */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}} />
      </div>
    </>
  );
}
