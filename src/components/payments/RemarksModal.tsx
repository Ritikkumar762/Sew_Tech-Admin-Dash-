import React from 'react';

interface RemarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function RemarksModal({ isOpen, onClose, onSubmit }: RemarksModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' }}>
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .modal-content { animation: slideUp 0.3s ease; }
          .rich-text-btn { background: none; border: none; cursor: pointer; color: '#4b5563'; padding: 0.25rem; border-radius: 0.25rem; transition: background-color 0.2s; }
          .rich-text-btn:hover { background-color: #e5e7eb; }
        `}
      </style>
      
      <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: '1rem', width: '100%', maxWidth: '600px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0 }}>Remarks</h2>
          <button onClick={onClose} style={{ background: '#111827', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', top: '1rem', right: '1rem' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px dashed #e5e7eb', margin: '0 0 1.5rem 0' }} />

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Enter Remarks<span style={{ color: '#ef4444' }}>*</span></label>
          
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
            {/* Rich Text Toolbar Mock */}
            <div style={{ backgroundColor: '#f1f5f9', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer' }}>14 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
              <button className="rich-text-btn" style={{ fontWeight: 'bold' }}>T</button>
              <button className="rich-text-btn" style={{ color: '#111827' }}>●</button>
              <button className="rich-text-btn" style={{ fontWeight: 'bold' }}>B</button>
              <button className="rich-text-btn" style={{ fontStyle: 'italic' }}>I</button>
              <button className="rich-text-btn" style={{ textDecoration: 'underline' }}>U</button>
              <button className="rich-text-btn" style={{ textDecoration: 'line-through' }}>S</button>
              <button className="rich-text-btn">≡</button>
              <button className="rich-text-btn">⇋</button>
              <button className="rich-text-btn">≣</button>
            </div>
            
            {/* Textarea */}
            <div style={{ position: 'relative' }}>
              <textarea 
                placeholder="Enter Remarks before Resolving"
                style={{ width: '100%', minHeight: '150px', padding: '1rem', border: 'none', outline: 'none', resize: 'vertical', fontSize: '1rem', color: '#374151', fontFamily: 'inherit' }}
              />
              <div style={{ position: 'absolute', bottom: '0.5rem', right: '1rem', fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="3" x2="21" y2="7"></line><path d="M21 7L7 21H3v-4L17 3z"></path></svg>
                50/200
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={onClose} style={{ padding: '0.75rem 3rem', borderRadius: '0.5rem', border: '1px solid #111827', backgroundColor: 'white', color: '#111827', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s', width: '200px' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            Cancel
          </button>
          <button onClick={() => { onSubmit(); onClose(); }} style={{ padding: '0.75rem 3rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#111827', color: 'white', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s', width: '200px' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            Resolve Dispute
          </button>
        </div>
      </div>
    </div>
  );
}
