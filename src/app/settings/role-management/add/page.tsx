'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient, ENDPOINTS } from '@/lib';

interface AccessItem {
  id: string;
  selectedAccess: string;
  accessType: string;
}

const ACCESS_OPTIONS = [
  'Sewtech Spares Module',
  'Sewtech Exchange Module',
  'Sewtech Kaarigar Module',
  'Sewtech Mechanic Module',
  'Sewtech Academic Module',
  'Super Admin',
  'Admin Settings',
  'All Modules',
  'Non-Admin'
];

const TYPE_OPTIONS = [
  'Individual',
  'Edit',
  'View Only'
];

export default function AddRolePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams ? searchParams.get('editId') : null;

  const [roleName, setRoleName] = useState('');
  const [accessItems, setAccessItems] = useState<AccessItem[]>([
    { id: 'acc-1', selectedAccess: 'Sewtech Spares Module', accessType: 'Individual' }
  ]);

  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [activeTypeDropdownId, setActiveTypeDropdownId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // Load existing details if editing
  useEffect(() => {
    if (!editId) return;

    const fetchRoleDetails = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get<{ success: boolean; data: any }>(`/api/v1/settings/roles/${editId}`);
        if (res && res.success && res.data) {
          setRoleName(res.data.name || '');
          if (res.data.accessItems && Array.isArray(res.data.accessItems)) {
            setAccessItems(res.data.accessItems);
          }
        }
      } catch (err) {
        console.warn('Backend server offline. Performing local fallback edit mapping.');
        // Set mock data based on which row was selected
        if (editId === 'role-1') {
          setRoleName('Super- Admin');
          setAccessItems([
            { id: 'acc-1', selectedAccess: 'Super Admin', accessType: 'Individual' }
          ]);
        } else if (editId === 'role-2') {
          setRoleName('ST Spares Admin');
          setAccessItems([
            { id: 'acc-1', selectedAccess: 'Sewtech Spares Module', accessType: 'Edit' }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRoleDetails();
  }, [editId]);

  const handleAddAccess = () => {
    const newItem: AccessItem = {
      id: `acc-${Date.now()}`,
      selectedAccess: 'Sewtech Spares Module',
      accessType: 'Individual'
    };
    setAccessItems([...accessItems, newItem]);
  };

  const handleRemoveAccess = (id: string) => {
    if (accessItems.length === 1) return; // Prevent deleting all accesses
    setAccessItems(accessItems.filter(item => item.id !== id));
  };

  const handleUpdateAccess = (id: string, field: 'selectedAccess' | 'accessType', value: string) => {
    setAccessItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    setActiveDropdownId(null);
    setActiveTypeDropdownId(null);
  };

  const handleSave = async () => {
    if (!roleName.trim()) {
      alert('Role Name is required!');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: roleName,
        accessItems,
      };

      if (editId) {
        await apiClient.put(`/api/v1/settings/roles/${editId}`, payload);
      } else {
        await apiClient.post('/api/v1/settings/roles', payload);
      }
      router.push('/settings/role-management');
    } catch (err) {
      console.error('Failed to save role configuration:', err);
      // fallback redirect
      router.push('/settings/role-management');
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
        .select-box {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          borderRadius: 0.5rem;
          outline: none;
          fontSize: 0.875rem;
          fontWeight: 500;
          color: #111827;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          user-select: none;
        }
        .dropdown-menu-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.25rem;
          background: #fff;
          border: 1px solid #e5e7eb;
          borderRadius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
          padding: 4px 0;
        }
        .dropdown-item {
          padding: 0.6rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .dropdown-item:hover {
          background-color: #f3f4f6;
        }
        .tag-badge {
          background: #eff6ff;
          color: #3b82f6;
          border: 1px solid #bfdbfe;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          borderRadius: 4px;
          display: inline-flex;
          alignItems: center;
          gap: 4px;
        }
        .tag-close {
          cursor: pointer;
          font-weight: bold;
          font-size: 0.875rem;
        }
      `}</style>

      {/* Header View */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827' }}>Add New Role</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            User Management <span style={{ margin: '0 0.5rem' }}>•</span> <span style={{ fontWeight: 600, color: '#111827' }}>Add New Role</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => router.push('/settings/role-management')}
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

      {/* ─── Add Details Card ─── */}
      <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Add Details</h2>
        <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 2rem 0' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Role Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
              Role Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              type="text" 
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter Role Name"
              className="form-input"
            />
          </div>

          {/* Access Lists Loop */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {accessItems.map((item, idx) => (
              <div 
                key={item.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.5rem', 
                  position: 'relative' 
                }}
              >
                {/* Selected Access Picker */}
                <div style={{ flex: 1, position: 'relative' }}>
                  {idx === 0 && (
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                      Selected Access <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                  )}
                  <div 
                    onClick={() => {
                      setActiveTypeDropdownId(null);
                      setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                    }}
                    className="select-box"
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="tag-badge">
                        Module
                        <span 
                          className="tag-close"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateAccess(item.id, 'selectedAccess', 'Non-Admin');
                          }}
                        >
                          ×
                        </span>
                      </span>
                      <span style={{ color: '#111827', fontWeight: 500 }}>{item.selectedAccess}</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>

                  {activeDropdownId === item.id && (
                    <>
                      <div onClick={() => setActiveDropdownId(null)} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />
                      <div className="dropdown-menu-list">
                        {ACCESS_OPTIONS.map((opt) => (
                          <div 
                            key={opt}
                            onClick={() => handleUpdateAccess(item.id, 'selectedAccess', opt)}
                            className="dropdown-item"
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Access Type Picker */}
                <div style={{ flex: 1, position: 'relative' }}>
                  {idx === 0 && (
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                      Access Type <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                  )}
                  <div 
                    onClick={() => {
                      setActiveDropdownId(null);
                      setActiveTypeDropdownId(activeTypeDropdownId === item.id ? null : item.id);
                    }}
                    className="select-box"
                  >
                    <span style={{ color: '#111827', fontWeight: 500 }}>{item.accessType}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>

                  {activeTypeDropdownId === item.id && (
                    <>
                      <div onClick={() => setActiveTypeDropdownId(null)} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />
                      <div className="dropdown-menu-list">
                        {TYPE_OPTIONS.map((opt) => (
                          <div 
                            key={opt}
                            onClick={() => handleUpdateAccess(item.id, 'accessType', opt)}
                            className="dropdown-item"
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Delete button (only rendered for items beyond the first, or all items with styled labels) */}
                {accessItems.length > 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleRemoveAccess(item.id)}
                      style={{ 
                        background: '#fef2f2', 
                        border: '1px solid #fca5a5', 
                        color: '#ef4444', 
                        padding: '0.75rem 1rem', 
                        borderRadius: '0.5rem', 
                        fontWeight: 600, 
                        fontSize: '0.875rem', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      className="animate-btn"
                    >
                      Delete
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Another Access Button */}
          <div style={{ display: 'flex', marginTop: '0.5rem' }}>
            <button
              onClick={handleAddAccess}
              style={{
                background: '#fff',
                border: '1px solid #111827',
                color: '#111827',
                borderRadius: '0.5rem',
                padding: '0.6rem 1.2rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              className="animate-btn"
            >
              Add Another Access
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
