import React, { useState } from 'react';

interface RemarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function RemarksModal({ isOpen, onClose, onSubmit }: RemarksModalProps) {
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' }}>
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .modal-content { animation: slideUp 0.3s ease; position: relative; }
          .rich-text-btn { background: none; border: none; cursor: pointer; color: #4b5563; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: inherit; font-size: 0.875rem; display: flex; alignItems: center; justify-content: center; transition: background-color 0.2s; }
          .rich-text-btn:hover { background-color: #e2e8f0; }
        `}
      </style>
      
      <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: '16px', width: '90%', maxWidth: '580px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0' }}>
        
        {/* Close button - black circle with white stroke and cross, offset at top-right corner */}
        <button onClick={onClose} style={{ position: 'absolute', top: '-14px', right: '-14px', background: '#111827', color: 'white', border: '2px solid white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', zIndex: 1010 }} aria-label="Close dialog">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0 }}>Remarks</h2>
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '0 0 1.5rem 0' }} />

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
            Enter Remarks<span style={{ color: '#ef4444' }}>*</span>
          </label>
          
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)' }}>
            {/* Rich Text Toolbar Mock */}
            <div style={{ backgroundColor: '#f1f5f9', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
              {/* Font size */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#4b5563', cursor: 'pointer', fontWeight: 500 }}>
                14 
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              
              <div style={{ width: '1px', height: '14px', backgroundColor: '#e2e8f0' }}></div>
              
              {/* Text Style */}
              <button className="rich-text-btn" style={{ fontWeight: 600, color: '#111827' }}>T</button>
              
              {/* Color picker circle */}
              <button className="rich-text-btn" aria-label="Color picker">
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1e293b', display: 'block' }}></span>
              </button>
              
              <div style={{ width: '1px', height: '14px', backgroundColor: '#e2e8f0' }}></div>
              
              {/* Bold, Italic, Underline, Strikethrough */}
              <button className="rich-text-btn" style={{ fontWeight: 700, color: '#4b5563' }}>B</button>
              <button className="rich-text-btn" style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#4b5563' }}>I</button>
              <button className="rich-text-btn" style={{ textDecoration: 'underline', color: '#4b5563' }}>U</button>
              <button className="rich-text-btn" style={{ textDecoration: 'line-through', color: '#4b5563' }}>S</button>
              
              <div style={{ width: '1px', height: '14px', backgroundColor: '#e2e8f0' }}></div>
              
              {/* Alignment */}
              <button className="rich-text-btn" aria-label="Align text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
              </button>
              
              {/* Clear Formatting */}
              <button className="rich-text-btn" aria-label="Clear formatting">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18.84 12.86l-6-6M13.4 18.28H21M13.4 18.28l6-6-6-6-6 6 6 6z"></path></svg>
              </button>
              
              {/* Bullet list */}
              <button className="rich-text-btn" aria-label="Bullet list">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="9" y1="6" x2="20" y2="6"></line><line x1="9" y1="12" x2="20" y2="12"></line><line x1="9" y1="18" x2="20" y2="18"></line><circle cx="4" cy="6" r="1.5"></circle><circle cx="4" cy="12" r="1.5"></circle><circle cx="4" cy="18" r="1.5"></circle></svg>
              </button>
            </div>
            
            {/* Textarea */}
            <div style={{ position: 'relative' }}>
              <textarea 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                maxLength={200}
                placeholder="Enter Remarks before Resolving"
                style={{ width: '100%', minHeight: '140px', padding: '1rem', border: 'none', outline: 'none', resize: 'none', fontSize: '0.95rem', color: '#111827', fontFamily: 'inherit', lineHeight: '1.5' }}
              />
              {/* Counter */}
              <div style={{ position: 'absolute', bottom: '0.75rem', right: '1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                {remarks.length}/200
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={onClose} style={{ padding: '0.625rem 2.5rem', borderRadius: '8px', border: '1px solid #111827', backgroundColor: 'white', color: '#111827', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', minWidth: '160px' }}>
            Cancel
          </button>
          <button onClick={() => { onSubmit(); onClose(); }} style={{ padding: '0.625rem 2.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#111827', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', minWidth: '160px' }}>
            Resolve Dispute
          </button>
        </div>
      </div>
    </div>
  );
}
