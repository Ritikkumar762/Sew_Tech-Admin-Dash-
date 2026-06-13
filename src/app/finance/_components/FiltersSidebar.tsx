'use client';

import { useState } from 'react';
import { FilterState } from '../_hooks/useFinanceTransactions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
}

export default function FiltersSidebar({ isOpen, onClose, filters, onChange, onClear }: Props) {
  // Local accordion open/close state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    status: true,
    type: true,
    counterpartyType: true,
    module: true,
    amountRange: true,
    advanced: true,
    createdOn: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (
    section: 'status' | 'type' | 'counterpartyType' | 'module',
    key: string,
    checked: boolean
  ) => {
    const nextFilters = { ...filters };
    nextFilters[section] = {
      ...nextFilters[section],
      [key]: checked,
    } as any;
    onChange(nextFilters);
  };

  const handleAmountChange = (key: 'min' | 'max', value: string) => {
    onChange({
      ...filters,
      amountRange: {
        ...filters.amountRange,
        [key]: value,
      },
    });
  };

  const handleAdvancedToggle = (key: 'goldMember' | 'couponUsed' | 'firstTimeUser', checked: boolean) => {
    onChange({
      ...filters,
      advanced: {
        ...filters.advanced,
        [key]: checked,
      },
    });
  };

  const handleCreatedOnChange = (value: string) => {
    onChange({
      ...filters,
      createdOn: value,
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
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
                fontWeight: 300,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {/* 1. Transaction Status */}
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
            <div
              onClick={() => toggleSection('status')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#374151',
                marginBottom: openSections.status ? '0.75rem' : '0',
              }}
            >
              <span>Transaction Status</span>
              <span>{openSections.status ? '▾' : '▸'}</span>
            </div>
            {openSections.status && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {['Completed', 'Pending', 'Failed'].map((status) => (
                  <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: '#4b5563' }}>
                    <input
                      type="checkbox"
                      checked={(filters.status as any)[status]}
                      onChange={(e) => handleCheckboxChange('status', status, e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    {status}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 2. Transaction Type */}
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
              <span>Transaction Type</span>
              <span>{openSections.type ? '▾' : '▸'}</span>
            </div>
            {openSections.type && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {['Credit', 'Debit', 'Refund'].map((type) => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: '#4b5563' }}>
                    <input
                      type="checkbox"
                      checked={(filters.type as any)[type]}
                      onChange={(e) => handleCheckboxChange('type', type, e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    {type}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 3. Counterparty Type */}
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
            <div
              onClick={() => toggleSection('counterpartyType')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#374151',
                marginBottom: openSections.counterpartyType ? '0.75rem' : '0',
              }}
            >
              <span>Counterparty Type</span>
              <span>{openSections.counterpartyType ? '▾' : '▸'}</span>
            </div>
            {openSections.counterpartyType && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {['Mechanic', 'Customer'].map((cp) => (
                  <label key={cp} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: '#4b5563' }}>
                    <input
                      type="checkbox"
                      checked={(filters.counterpartyType as any)[cp]}
                      onChange={(e) => handleCheckboxChange('counterpartyType', cp, e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    {cp}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 4. Module */}
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
            <div
              onClick={() => toggleSection('module')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#374151',
                marginBottom: openSections.module ? '0.75rem' : '0',
              }}
            >
              <span>Module</span>
              <span>{openSections.module ? '▾' : '▸'}</span>
            </div>
            {openSections.module && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: '#4b5563' }}>
                  <input
                    type="checkbox"
                    checked={filters.module.mechanic}
                    onChange={(e) => handleCheckboxChange('module', 'mechanic', e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  Sewtech Mechanic
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: '#4b5563' }}>
                  <input
                    type="checkbox"
                    checked={filters.module.spares}
                    onChange={(e) => handleCheckboxChange('module', 'spares', e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  Sewtech Spares
                </label>
              </div>
            )}
          </div>

          {/* 5. Amount Range */}
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
            <div
              onClick={() => toggleSection('amountRange')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#374151',
                marginBottom: openSections.amountRange ? '0.75rem' : '0',
              }}
            >
              <span>Amount Range</span>
              <span>{openSections.amountRange ? '▾' : '▸'}</span>
            </div>
            {openSections.amountRange && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.85rem' }}>₹</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.amountRange.min}
                    onChange={(e) => handleAmountChange('min', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.5rem 0.4rem 1.25rem',
                      fontSize: '0.85rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      outline: 'none',
                    }}
                  />
                </div>
                <span style={{ color: '#9ca3af' }}>-</span>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.85rem' }}>₹</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.amountRange.max}
                    onChange={(e) => handleAmountChange('max', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.5rem 0.4rem 1.25rem',
                      fontSize: '0.85rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 6. Advanced Filters */}
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
            <div
              onClick={() => toggleSection('advanced')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#374151',
                marginBottom: openSections.advanced ? '0.75rem' : '0',
              }}
            >
              <span>Advanced Filters</span>
              <span>{openSections.advanced ? '▾' : '▸'}</span>
            </div>
            {openSections.advanced && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>Gold Member</span>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={filters.advanced.goldMember}
                    onChange={(e) => handleAdvancedToggle('goldMember', e.target.checked)}
                    style={{
                      width: '36px',
                      height: '18px',
                      accentColor: '#1d4ed8',
                      cursor: 'pointer',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>Coupon Used</span>
                  <input
                    type="checkbox"
                    checked={filters.advanced.couponUsed}
                    onChange={(e) => handleAdvancedToggle('couponUsed', e.target.checked)}
                    style={{
                      width: '36px',
                      height: '18px',
                      accentColor: '#1d4ed8',
                      cursor: 'pointer',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>First-time User Transaction</span>
                  <input
                    type="checkbox"
                    checked={filters.advanced.firstTimeUser}
                    onChange={(e) => handleAdvancedToggle('firstTimeUser', e.target.checked)}
                    style={{
                      width: '36px',
                      height: '18px',
                      accentColor: '#1d4ed8',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 7. Created On */}
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem' }}>
            <div
              onClick={() => toggleSection('createdOn')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#374151',
                marginBottom: openSections.createdOn ? '0.75rem' : '0',
              }}
            >
              <span>Created On</span>
              <span>{openSections.createdOn ? '▾' : '▸'}</span>
            </div>
            {openSections.createdOn && (
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
                      name="createdOnRadio"
                      checked={filters.createdOn === option.key}
                      onChange={() => handleCreatedOnChange(option.key)}
                      style={{ cursor: 'pointer' }}
                    />
                    {option.label}
                  </label>
                ))}

                {/* Custom Date Pickers */}
                {filters.createdOn === 'custom' && (
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

        {/* Footer actions */}
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

        {/* Local Keyframe animations injection style */}
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
