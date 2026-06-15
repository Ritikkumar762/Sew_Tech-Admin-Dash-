'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ENDPOINTS } from '@/lib';

interface KillSwitch {
  key: string;
  label: string;
  enabled: boolean;
}

export default function PlatformConfigurationPage() {
  const router = useRouter();
  const [supportEmail, setSupportEmail] = useState('support@sewtech.in');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [loading, setLoading] = useState(false);

  // Kill Switch states
  const [killSwitches, setKillSwitches] = useState<KillSwitch[]>([
    { key: 'spares', label: 'Disable Spares Module instantly', enabled: true },
    { key: 'mechanic', label: 'Disable Mechanic Module instantly', enabled: false },
    { key: 'payments', label: 'Disable payments instantly', enabled: false },
    { key: 'listings', label: 'Disable Listings', enabled: false },
    { key: 'chat', label: 'Disable chat instantly', enabled: false },
    { key: 'postings', label: 'Disable postings instantly', enabled: false },
    { key: 'referrals', label: 'Disable referrals instantly', enabled: false },
  ]);

  // Password reset fields
  const [resetEmail, setResetEmail] = useState('');
  const [resetPhone, setResetPhone] = useState('');

  // Fetch settings from local API
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get<{ success: boolean; data: any }>(ENDPOINTS.settings.get);
        if (res && res.success && res.data) {
          setSupportEmail(res.data.supportEmail || 'support@sewtech.in');
          setSupportPhone(res.data.supportPhone || '+91 98765 43210');
          if (res.data.killSwitches) {
            setKillSwitches(res.data.killSwitches);
          }
        }
      } catch (err) {
        console.warn('Backend server offline. Carrying out static settings fallback.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggleKillSwitch = (key: string) => {
    setKillSwitches(prev => prev.map(sw => sw.key === key ? { ...sw, enabled: !sw.enabled } : sw));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        supportEmail,
        supportPhone,
        killSwitches,
      };
      await apiClient.put(ENDPOINTS.settings.update, payload);
      alert('Platform configuration saved successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-btn { transition: all 0.2s ease; }
        .animate-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .animate-btn:active { transform: translateY(1px); }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          borderRadius: 0.5rem;
          outline: none;
          fontSize: 0.875rem;
          fontWeight: 500;
          color: #111827;
          background: #fff;
          transition: all 0.2s ease;
        }
        .form-input:focus {
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
        }
        .toggle-container {
          width: 44px;
          height: 24px;
          borderRadius: 99px;
          cursor: pointer;
          position: relative;
          transition: background-color 0.2s ease;
        }
        .toggle-thumb {
          width: 18px;
          height: 18px;
          borderRadius: 50%;
          background: white;
          position: absolute;
          top: 3px;
          transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Header View */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827' }}>Platform Configuration</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            System & Settings <span style={{ margin: '0 0.5rem' }}>•</span> <span style={{ fontWeight: 600, color: '#111827' }}>Platform Configuration</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => router.refresh()}
            style={{ border: '1px solid #ef4444', color: '#ef4444', background: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
            className="animate-btn"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            style={{ background: '#111827', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
            className="animate-btn"
          >
            {loading ? 'Saving...' : 'Add Role'}
          </button>
        </div>
      </div>

      {/* ─── Support Details Section ─── */}
      <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Support Details</h2>
        <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
              Support Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              type="text" 
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="Enter Role Name"
              className="form-input"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
              Support Phone <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              type="text" 
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              placeholder="Enter Role Name"
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* ─── Kill Switch Section ─── */}
      <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Kill Switch</h2>
        <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {killSwitches.map((sw) => (
            <div 
              key={sw.key}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                background: sw.enabled ? '#fff5f5' : '#f9fafb',
                border: sw.enabled ? '1px solid #fecaca' : '1px solid #f3f4f6',
                padding: '1rem 1.5rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Toggle Switch */}
              <div 
                onClick={() => handleToggleKillSwitch(sw.key)}
                className="toggle-container"
                style={{ background: sw.enabled ? '#ef4444' : '#d1d5db' }}
              >
                <div 
                  className="toggle-thumb" 
                  style={{ left: sw.enabled ? '23px' : '3px' }}
                />
              </div>

              {/* Text label */}
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: sw.enabled ? '#b91c1c' : '#4b5563' }}>
                {sw.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Password Reset Section ─── */}
      <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2.2rem 2rem 2.8rem 2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Password Reset</h2>
        <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
              Support Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              type="text" 
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter Role Name"
              className="form-input"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
              Support Phone <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              type="text" 
              value={resetPhone}
              onChange={(e) => setResetPhone(e.target.value)}
              placeholder="Enter Role Name"
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
