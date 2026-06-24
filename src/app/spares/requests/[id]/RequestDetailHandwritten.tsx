'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Copy, 
  Check, 
  Plus, 
  Minus,
  X,
  MinusCircle,
  PlusCircle,
  Maximize2,
  Printer,
  Download,
  FileText
} from 'lucide-react';

interface RequestDetailProps {
  request: {
    id: string;
    customerName: string;
    phone: string;
  };
}

interface SpareRow {
  id: number;
  name: string;
  variant: string;
  qty: number;
}

export default function RequestDetailHandwritten({ request }: RequestDetailProps) {
  const router = useRouter();
  
  // Spares rows state - default matching Figma mockup 3
  const [rows, setRows] = useState<SpareRow[]>([
    { id: 1, name: 'High-Speed Rotary Hook Assembly', variant: 'HC3000', qty: 10 },
    { id: 2, name: 'High-Speed Rotary Hook Assembly', variant: 'HC3000', qty: 10 },
    { id: 3, name: 'High-Speed Rotary Hook Assembly', variant: 'HC3000', qty: 10 },
  ]);

  // Copy status
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);

  // Document viewer state
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages] = useState<number>(2);

  // Invoice modal state
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  // Copy helpers
  const handleCopyId = () => {
    navigator.clipboard.writeText(request.id.toUpperCase());
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(request.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 1500);
  };

  // Spares state handlers
  const handleAddRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows([...rows, { id: newId, name: 'High-Speed Rotary Hook Assembly', variant: 'HC3000', qty: 10 }]);
  };

  const handleRemoveRow = (id: number) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleQtyChange = (id: number, increment: boolean) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const newQty = increment ? row.qty + 1 : Math.max(1, row.qty - 1);
        return { ...row, qty: newQty };
      }
      return row;
    }));
  };

  const handleFieldChange = (id: number, field: 'name' | 'variant', value: string) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  // Price calculations
  const calculateTotalQty = () => rows.reduce((acc, row) => acc + row.qty, 0);
  const calculateSubtotal = () => rows.reduce((acc, row) => acc + (row.qty * 150), 0); // ₹150 per spare unit

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <style>
        {`
          .detail-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            padding: 1.5rem;
          }
          .custom-select {
            width: 100%;
            padding: 0.625rem 0.875rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            color: #374151;
            background-color: #f9fafb;
            outline: none;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
            background-position: right 0.75rem center;
            background-repeat: no-repeat;
            background-size: 1.25rem;
            font-weight: 500;
          }
          .custom-select:focus {
            border-color: #9ca3af;
          }
          .qty-btn {
            border: 1px solid #e5e7eb;
            background: white;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 0.875rem;
            color: #4b5563;
            transition: background-color 0.15s;
          }
          .qty-btn:hover {
            background-color: #f3f4f6;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1100;
            backdrop-filter: blur(2px);
          }
          .viewer-btn {
            background: none;
            border: none;
            color: #4b5563;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.15s;
          }
          .viewer-btn:hover {
            background-color: #e2e8f0;
          }
        `}
      </style>

      {/* Top Banner Info Detail */}
      <div className="detail-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={() => router.push('/spares/requests')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                cursor: 'pointer',
                color: '#4b5563',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <ChevronLeft size={18} />
            </button>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>{request.customerName}</h2>
            
            {/* Request ID Badge */}
            <div 
              onClick={handleCopyId}
              style={{
                fontSize: '0.75rem',
                color: '#2563eb',
                border: '1px dashed #bfdbfe',
                borderRadius: '0.375rem',
                padding: '0.125rem 0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
                backgroundColor: '#eff6ff',
                fontWeight: 600,
                position: 'relative'
              }}
            >
              REQUEST ID
              {copiedId ? <Check size={10} style={{ color: '#16a34a' }} /> : <Copy size={10} />}
            </div>

            {/* Phone badge */}
            <div 
              onClick={handleCopyPhone}
              style={{
                fontSize: '0.75rem',
                color: '#2563eb',
                border: '1px dashed #bfdbfe',
                borderRadius: '0.375rem',
                padding: '0.125rem 0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
                backgroundColor: '#eff6ff',
                fontWeight: 600,
                position: 'relative'
              }}
            >
              {request.phone}
              {copiedPhone ? <Check size={10} style={{ color: '#16a34a' }} /> : <Copy size={10} />}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => alert('Marked as New')}
              style={{
                padding: '0.5rem 1.25rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Mark as New
            </button>

            <button 
              onClick={() => alert('Marked as Irrelevant')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.5rem 1.25rem',
                border: 'none',
                borderRadius: '0.5rem',
                backgroundColor: '#1f2937',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#111827'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
            >
              Mark as Irrelevant
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        
        {/* Left column - Select Order */}
        <div className="detail-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: 0 }}>Select Order</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {rows.map((row, idx) => (
              <div 
                key={row.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.75rem', 
                  backgroundColor: '#ffffff'
                }}
              >
                {/* Delete row button */}
                <button 
                  onClick={() => handleRemoveRow(row.id)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                >
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Minus size={12} strokeWidth={3} />
                  </div>
                </button>

                {/* SNo */}
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af', width: '20px' }}>
                  {(idx + 1).toString().padStart(2, '0')}
                </span>

                {/* Spare Name Select */}
                <div style={{ flex: 2 }}>
                  <select 
                    value={row.name} 
                    onChange={(e) => handleFieldChange(row.id, 'name', e.target.value)}
                    className="custom-select"
                  >
                    <option value="High-Speed Rotary Hook Assembly">High-Speed Rotary Hook Assembly</option>
                    <option value="Industrial Sewing Machine Needle">Industrial Sewing Machine Needle</option>
                    <option value="Heavy-Duty Bobbin Case">Heavy-Duty Bobbin Case</option>
                  </select>
                </div>

                {/* Variant Select */}
                <div style={{ flex: 1.2 }}>
                  <select 
                    value={row.variant} 
                    onChange={(e) => handleFieldChange(row.id, 'variant', e.target.value)}
                    className="custom-select"
                  >
                    <option value="Select Variant">Select Variant</option>
                    <option value="HC3000">HC3000</option>
                    <option value="HC4000">HC4000</option>
                    <option value="HC5000">HC5000</option>
                  </select>
                </div>

                {/* Quantity adjust */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#f9fafb' }}>
                  <button className="qty-btn" onClick={() => handleQtyChange(row.id, false)}>-</button>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', width: '24px', textAlign: 'center' }}>{row.qty}</span>
                  <button className="qty-btn" onClick={() => handleQtyChange(row.id, true)}>+</button>
                </div>

                {/* Price Display */}
                <div style={{ minWidth: '70px', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                  ₹{(row.qty * 150).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Add Spare & Generate Invoice Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <button 
              onClick={handleAddRow}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px dashed #bfdbfe',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                color: '#2563eb',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <Plus size={16} />
              Add Spare
            </button>

            <button 
              onClick={() => setShowInvoiceModal(true)}
              style={{
                width: '180px',
                padding: '0.75rem 1.25rem',
                border: 'none',
                borderRadius: '0.5rem',
                backgroundColor: '#111827',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111827'}
            >
              Generate Invoice
            </button>
          </div>
        </div>

        {/* Right column - Document Uploaded */}
        <div className="detail-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: 0 }}>Document Uploaded</h3>

          {/* Document Viewer Container */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
            
            {/* Viewer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0.625rem 1rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                <span onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} style={{ cursor: 'pointer' }}>◀</span>
                <span>{currentPage} / {totalPages}</span>
                <span onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} style={{ cursor: 'pointer' }}>▶</span>
              </div>

              {/* Zoom controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                <button className="viewer-btn" onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))}>-</button>
                <span style={{ width: '40px', textAlign: 'center' }}>{zoomLevel}%</span>
                <button className="viewer-btn" onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))}>+</button>
              </div>

              {/* Toolbar Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button className="viewer-btn" onClick={() => alert('Printing document...')}><Printer size={15} /></button>
                <button className="viewer-btn" onClick={() => alert('Downloading file...')}><Download size={15} /></button>
                <button className="viewer-btn" onClick={() => setZoomLevel(100)}><Maximize2 size={15} /></button>
              </div>
            </div>

            {/* Document Canvas Viewer Body */}
            <div style={{ 
              height: '420px', 
              overflow: 'auto', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '1rem',
              position: 'relative'
            }}>
              <img 
                src="/pdf _svg.svg" 
                alt="Handwritten Purchase Order" 
                style={{ 
                  transform: `scale(${zoomLevel / 100})`, 
                  transition: 'transform 0.15s ease-out', 
                  maxWidth: '90%', 
                  maxHeight: '90%', 
                  objectFit: 'contain',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                  backgroundColor: 'white'
                }} 
              />
            </div>
            
            {/* Scanned note bottom info bar */}
            <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              Uploaded 3 Hrs Ago
            </div>
          </div>
        </div>

      </div>

      {/* Select Order / Invoice Modal */}
      {showInvoiceModal && (
        <div className="modal-overlay">
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '1.75rem',
            width: '800px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>Select Order</h3>

            <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                    <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Product ↑↓</th>
                    <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Spare Price ↑↓</th>
                    <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Quantity ↑↓</th>
                    <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Tax ↑↓</th>
                    <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Amount ↑↓</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            backgroundColor: '#ffedd5', 
                            color: '#c2410c',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8125rem'
                          }}>
                            b
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#1f2937' }}>{row.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>{row.variant}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#374151' }}>₹1,850</td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 500, color: '#374151', paddingLeft: '1.75rem' }}>{row.qty}</td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#374151' }}>₹1,850</td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#111827' }}>₹1,850</td>
                    </tr>
                  ))}

                  <tr style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}>
                    <td colSpan={4} style={{ padding: '0.875rem 1.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
                      Discount Code (SEWSPARE-NEW)
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.875rem' }}>
                      - ₹1,850
                    </td>
                  </tr>

                  <tr style={{ backgroundColor: '#4b5563', color: 'white' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Total</td>
                    <td style={{ padding: '1rem 1.25rem' }}></td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, paddingLeft: '1.75rem' }}>{calculateTotalQty()}</td>
                    <td style={{ padding: '1rem 1.25rem' }}></td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, fontSize: '1rem' }}>₹{calculateSubtotal().toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button 
                onClick={() => setShowInvoiceModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Edit Details
              </button>

              <button 
                onClick={() => {
                  alert('Invoice has been pushed for payment!');
                  setShowInvoiceModal(false);
                  router.push('/spares/requests');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#111827',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                Push Invoice for Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
