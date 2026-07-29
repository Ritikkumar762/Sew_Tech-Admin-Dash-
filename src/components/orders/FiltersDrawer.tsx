'use client';

import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Calendar, HelpCircle } from 'lucide-react';

interface FiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export default function FiltersDrawer({ isOpen, onClose, onApply }: FiltersDrawerProps) {
  // Accordion open states
  const [sections, setSections] = useState({
    category: true,
    compatibility: true,
    priceRange: true,
    smartFilters: true,
    orderedPlacedOn: true,
    orderClosedOn: true,
  });

  // Selected Categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Category input dropdown selected
  const [categoryInput, setCategoryInput] = useState('');

  // Compatibility
  const [compatibleBrand, setCompatibleBrand] = useState('');
  const [compatibleMachineType, setCompatibleMachineType] = useState('');

  // Price range
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Smart Filters
  const [smartFilter, setSmartFilter] = useState('');

  // Dates
  const [orderedPlacedOn, setOrderedPlacedOn] = useState('');
  const [orderClosedOn, setOrderClosedOn] = useState('');
  
  // Date manually inputs
  const [placedStartDate, setPlacedStartDate] = useState('');
  const [placedEndDate, setPlacedEndDate] = useState('');
  const [closedStartDate, setClosedStartDate] = useState('');
  const [closedEndDate, setClosedEndDate] = useState('');

  if (!isOpen) return null;

  const toggleSection = (name: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setCompatibleBrand('');
    setCompatibleMachineType('');
    setMinPrice('');
    setMaxPrice('');
    setSmartFilter('');
    setOrderedPlacedOn('');
    setOrderClosedOn('');
    setPlacedStartDate('');
    setPlacedEndDate('');
    setClosedStartDate('');
    setClosedEndDate('');
  };

  const handleRemoveCategory = (cat: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== cat));
  };

  const handleAddCategory = (cat: string) => {
    if (cat && !selectedCategories.includes(cat)) {
      setSelectedCategories(prev => [...prev, cat]);
    }
    setCategoryInput('');
  };

  return (
    <>
      {/* Background Overlay */}
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

      {/* Drawer Container */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '420px',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            .filter-card {
              background-color: #f8f9fa;
              border: 1px solid #f3f4f6;
              border-radius: 0.75rem;
              margin-bottom: 1rem;
              overflow: hidden;
              transition: all 0.2s ease;
            }
            .filter-card:hover {
              border-color: #e5e7eb;
            }
            .section-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 1rem 1.25rem;
              font-weight: 600;
              font-size: 0.875rem;
              color: #1f2937;
              cursor: pointer;
              user-select: none;
            }
            .section-content {
              padding: 0 1.25rem 1.25rem 1.25rem;
              display: flex;
              flex-direction: column;
              gap: 0.875rem;
            }
            .form-input {
              width: 100%;
              padding: 0.625rem 0.875rem;
              border: 1px solid #e5e7eb;
              border-radius: 0.5rem;
              font-size: 0.875rem;
              color: #374151;
              outline: none;
              background-color: white;
              transition: border-color 0.15s, box-shadow 0.15s;
              appearance: none;
              background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
              background-position: right 0.75rem center;
              background-repeat: no-repeat;
              background-size: 1.25rem;
              padding-right: 2rem;
            }
            .form-input:focus {
              border-color: #3b82f6;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.05);
            }
            .text-input {
              width: 100%;
              padding: 0.625rem 0.875rem;
              border: 1px solid #e5e7eb;
              border-radius: 0.5rem;
              font-size: 0.875rem;
              color: #1f2937;
              outline: none;
              background-color: white;
              font-weight: 500;
              transition: border-color 0.15s;
            }
            .text-input:focus {
              border-color: #3b82f6;
            }
            .radio-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 0.75rem;
            }
            .radio-label {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              font-size: 0.875rem;
              color: #374151;
              cursor: pointer;
              font-weight: 500;
            }
            .radio-input {
              width: 1rem;
              height: 1rem;
              accent-color: #111827;
              cursor: pointer;
            }
            .badge-pill {
              display: inline-flex;
              align-items: center;
              gap: 0.375rem;
              background-color: #eff6ff;
              color: #2563eb;
              border: 1px solid #bfdbfe;
              border-radius: 2rem;
              padding: 0.375rem 0.75rem;
              font-size: 0.75rem;
              font-weight: 500;
              cursor: pointer;
            }
            .badge-pill:hover {
              background-color: #dbeafe;
            }
            .manual-date-picker {
              display: flex;
              align-items: center;
              background-color: #f1f5f9;
              border-radius: 0.5rem;
              padding: 0.625rem 0.875rem;
              color: #6b7280;
              font-size: 0.75rem;
              font-weight: 500;
              gap: 0.5rem;
              cursor: pointer;
            }
            .manual-date-picker input {
              border: none;
              background: transparent;
              color: #374151;
              outline: none;
              font-size: 0.75rem;
              width: 90px;
              font-weight: 600;
            }
            .drawer-scroll::-webkit-scrollbar {
              width: 4px;
            }
            .drawer-scroll::-webkit-scrollbar-thumb {
              background: #e2e8f0;
              border-radius: 2px;
            }
          `}
        </style>

        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>Filters</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={handleClearAll}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                border: 'none',
                background: '#fef2f2',
                color: '#ef4444',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0.375rem 0.75rem',
                borderRadius: '2rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
            >
              Clear Filters 
              <X size={12} style={{ display: 'inline' }} />
            </button>
            <button 
              onClick={onClose}
              style={{ border: 'none', background: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="drawer-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem' }}>
          
          {/* 1. Category Section */}
          <div className="filter-card">
            <div className="section-header" onClick={() => toggleSection('category')}>
              <span>Category</span>
              {sections.category ? <ChevronUp size={16} style={{ color: '#9ca3af' }} /> : <ChevronDown size={16} style={{ color: '#9ca3af' }} />}
            </div>
            {sections.category && (
              <div className="section-content">
                <div>
                  <select 
                    className="form-input" 
                    value={categoryInput}
                    onChange={(e) => handleAddCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option value="Hookset">Hookset</option>
                    <option value="Needles">Needles</option>
                    <option value="Knives">Knives</option>
                    <option value="Bobbins">Bobbins</option>
                    <option value="Loopers">Loopers</option>
                    <option value="Motors">Motors</option>
                  </select>
                </div>
                {/* Category Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedCategories.map(cat => (
                    <div key={cat} className="badge-pill" onClick={() => handleRemoveCategory(cat)}>
                      {cat}
                      <X size={12} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Compatibility Section */}
          <div className="filter-card">
            <div className="section-header" onClick={() => toggleSection('compatibility')}>
              <span>Compatibility</span>
              {sections.compatibility ? <ChevronUp size={16} style={{ color: '#9ca3af' }} /> : <ChevronDown size={16} style={{ color: '#9ca3af' }} />}
            </div>
            {sections.compatibility && (
              <div className="section-content">
                <select 
                  className="form-input" 
                  value={compatibleBrand} 
                  onChange={(e) => setCompatibleBrand(e.target.value)}
                >
                  <option value="">Compatible Brand</option>
                  <option value="Juki">Juki</option>
                  <option value="Singer">Singer</option>
                  <option value="Brother">Brother</option>
                </select>
                <select 
                  className="form-input" 
                  value={compatibleMachineType} 
                  onChange={(e) => setCompatibleMachineType(e.target.value)}
                >
                  <option value="">Compatible Machine Type</option>
                  <option value="Single Needle Lockstitch">Single Needle Lockstitch</option>
                  <option value="Overlock">Overlock</option>
                  <option value="Flatlock">Flatlock</option>
                </select>
              </div>
            )}
          </div>

          {/* 3. Price Range Section */}
          <div className="filter-card">
            <div className="section-header" onClick={() => toggleSection('priceRange')}>
              <span>Price Range</span>
              {sections.priceRange ? <ChevronUp size={16} style={{ color: '#9ca3af' }} /> : <ChevronDown size={16} style={{ color: '#9ca3af' }} />}
            </div>
            {sections.priceRange && (
              <div className="section-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem', color: '#1f2937', fontWeight: 500 }}>₹</span>
                    <input 
                      type="text" 
                      className="text-input" 
                      style={{ paddingLeft: '1.625rem' }} 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <span style={{ color: '#9ca3af', fontWeight: 600 }}>-</span>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem', color: '#1f2937', fontWeight: 500 }}>₹</span>
                    <input 
                      type="text" 
                      className="text-input" 
                      style={{ paddingLeft: '1.625rem' }} 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Smart Filters Section */}
          <div className="filter-card">
            <div className="section-header" onClick={() => toggleSection('smartFilters')}>
              <span>Smart Filters</span>
              {sections.smartFilters ? <ChevronUp size={16} style={{ color: '#9ca3af' }} /> : <ChevronDown size={16} style={{ color: '#9ca3af' }} />}
            </div>
            {sections.smartFilters && (
              <div className="section-content" style={{ gap: '0.75rem' }}>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="smartFilter" 
                    className="radio-input" 
                    checked={smartFilter === 'SLA_OVER'}
                    onChange={() => setSmartFilter('SLA_OVER')}
                  />
                  Order Over SLA Time
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="smartFilter" 
                    className="radio-input" 
                    checked={smartFilter === 'SLA_UNDER'}
                    onChange={() => setSmartFilter('SLA_UNDER')}
                  />
                  Order Under SLA Time
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="smartFilter" 
                    className="radio-input" 
                    checked={smartFilter === 'ACTIONS'}
                    onChange={() => setSmartFilter('ACTIONS')}
                  />
                  Actions Required
                </label>
              </div>
            )}
          </div>

          {/* 5. Ordered Placed On Section */}
          <div className="filter-card">
            <div className="section-header" onClick={() => toggleSection('orderedPlacedOn')}>
              <span>Ordered Placed On</span>
              {sections.orderedPlacedOn ? <ChevronUp size={16} style={{ color: '#9ca3af' }} /> : <ChevronDown size={16} style={{ color: '#9ca3af' }} />}
            </div>
            {sections.orderedPlacedOn && (
              <div className="section-content" style={{ gap: '1rem' }}>
                <div className="radio-grid">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="orderedPlaced" 
                      className="radio-input" 
                      checked={orderedPlacedOn === '7'}
                      onChange={() => setOrderedPlacedOn('7')}
                    />
                    Last 7 Days
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="orderedPlaced" 
                      className="radio-input" 
                      checked={orderedPlacedOn === '14'}
                      onChange={() => setOrderedPlacedOn('14')}
                    />
                    Last 14 Days
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="orderedPlaced" 
                      className="radio-input" 
                      checked={orderedPlacedOn === '30'}
                      onChange={() => setOrderedPlacedOn('30')}
                    />
                    Last 30 Days
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="orderedPlaced" 
                      className="radio-input" 
                      checked={orderedPlacedOn === '180'}
                      onChange={() => setOrderedPlacedOn('180')}
                    />
                    Last 6 Months
                  </label>
                </div>
                
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1f2937', marginTop: '0.25rem' }}>Select Manually</div>
                
                {/* Unified Date Selection Row */}
                <div className="manual-date-picker">
                  <Calendar size={14} style={{ color: '#9ca3af' }} />
                  <input 
                    type="text" 
                    placeholder="DD/MM/YYYY" 
                    value={placedStartDate}
                    onChange={(e) => { setPlacedStartDate(e.target.value); setOrderedPlacedOn('manual'); }}
                  />
                  <span>-</span>
                  <Calendar size={14} style={{ color: '#9ca3af' }} />
                  <input 
                    type="text" 
                    placeholder="DD/MM/YYYY" 
                    value={placedEndDate}
                    onChange={(e) => { setPlacedEndDate(e.target.value); setOrderedPlacedOn('manual'); }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 6. Order Closed On Section */}
          <div className="filter-card">
            <div className="section-header" onClick={() => toggleSection('orderClosedOn')}>
              <span>Order Closed On</span>
              {sections.orderClosedOn ? <ChevronUp size={16} style={{ color: '#9ca3af' }} /> : <ChevronDown size={16} style={{ color: '#9ca3af' }} />}
            </div>
            {sections.orderClosedOn && (
              <div className="section-content" style={{ gap: '1rem' }}>
                <div className="radio-grid">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="orderClosed" 
                      className="radio-input" 
                      checked={orderClosedOn === '7'}
                      onChange={() => setOrderClosedOn('7')}
                    />
                    Last 7 Days
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="orderClosed" 
                      className="radio-input" 
                      checked={orderClosedOn === '14'}
                      onChange={() => setOrderClosedOn('14')}
                    />
                    Last 14 Days
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="orderClosed" 
                      className="radio-input" 
                      checked={orderClosedOn === '30'}
                      onChange={() => setOrderClosedOn('30')}
                    />
                    Last 30 Days
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="orderClosed" 
                      className="radio-input" 
                      checked={orderClosedOn === '180'}
                      onChange={() => setOrderClosedOn('180')}
                    />
                    Last 6 Months
                  </label>
                </div>
                
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1f2937', marginTop: '0.25rem' }}>Select Manually</div>
                
                {/* Unified Date Selection Row */}
                <div className="manual-date-picker">
                  <Calendar size={14} style={{ color: '#9ca3af' }} />
                  <input 
                    type="text" 
                    placeholder="DD/MM/YYYY" 
                    value={closedStartDate}
                    onChange={(e) => { setClosedStartDate(e.target.value); setOrderClosedOn('manual'); }}
                  />
                  <span>-</span>
                  <Calendar size={14} style={{ color: '#9ca3af' }} />
                  <input 
                    type="text" 
                    placeholder="DD/MM/YYYY" 
                    value={closedEndDate}
                    onChange={(e) => { setClosedEndDate(e.target.value); setOrderClosedOn('manual'); }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Drawer Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '1rem' }}>
          <button 
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
              color: '#4b5563',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onApply({
                categories: selectedCategories,
                brand: compatibleBrand,
                machineType: compatibleMachineType,
                price: { min: minPrice, max: maxPrice },
                smartFilter,
                orderedPlaced: { option: orderedPlacedOn, start: placedStartDate, end: placedEndDate },
                orderClosed: { option: orderClosedOn, start: closedStartDate, end: closedEndDate },
              });
              onClose();
            }}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: '#111827',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111827'}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
