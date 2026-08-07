'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib';

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

interface RoleDetailsResponse {
  success: boolean;
  data: { name?: string; accessItems?: AccessItem[] } | null;
}

function AddRoleContent() {
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
        const res = await apiClient.get<RoleDetailsResponse>(`/api/v1/settings/roles/${editId}`);
        if (res && res.success && res.data) {
          setRoleName(res.data.name || '');
          if (res.data.accessItems && Array.isArray(res.data.accessItems)) {
            setAccessItems(res.data.accessItems);
          }
        }
      } catch {
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

  const chevron = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
  );

  return (
    <div className="role-page">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Sizing below is measured from the Figma frames: 52px controls, 24px card
           padding, 40px column gap, 28px chip. Keep these in sync as a set. */
        .role-page {
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 40px;
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-btn { transition: all 0.2s ease; }
        .animate-btn:hover { filter: brightness(1.04); }
        .animate-btn:active { transform: translateY(1px); }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0;
          color: #111827;
          letter-spacing: -0.01em;
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 6px;
          font-size: 16px;
          color: #6b7280;
        }
        .breadcrumb-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #cbd5e1;
        }
        .breadcrumb-current { font-weight: 700; color: #111827; }

        .header-btn {
          height: 48px;
          min-width: 170px;
          padding: 0 1.25rem;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .header-btn-discard { border: 1px solid #ef4444; color: #ef4444; background: #fff; }
        .header-btn-primary { border: none; background: #111827; color: #fff; }
        .header-btn-primary:disabled { opacity: 0.6; cursor: default; }

        .details-card {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #eef0f3;
          box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
        }
        .card-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          color: #111827;
        }
        .card-divider {
          border: 0;
          border-top: 1px dashed #e5e7eb;
          margin: 22px 0 28px 0;
        }

        .field-group { display: flex; flex-direction: column; gap: 40px; }
        .field-label {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 14px;
        }
        .field-label .req { color: #ef4444; }

        .form-input {
          width: 100%;
          height: 52px;
          padding: 0 24px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          outline: none;
          font-size: 15px;
          font-weight: 500;
          color: #111827;
          background: #fff;
          transition: all 0.2s ease;
        }
        .form-input::placeholder { color: #9ca3af; font-weight: 400; }
        .form-input:focus {
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
        }

        .select-box {
          width: 100%;
          height: 52px;
          padding: 0 24px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          outline: none;
          font-size: 15px;
          font-weight: 500;
          color: #111827;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }
        .select-value { color: #374151; font-weight: 500; }
        .select-placeholder { color: #9ca3af; font-weight: 400; }

        .access-row {
          display: flex;
          align-items: flex-end;
          gap: 40px;
          position: relative;
        }
        .access-col { flex: 1; position: relative; min-width: 0; }
        .access-list { display: flex; flex-direction: column; gap: 20px; }

        .dropdown-menu-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.25rem;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
          padding: 4px 0;
        }
        .dropdown-item {
          padding: 0.6rem 1rem;
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .dropdown-item:hover { background-color: #f3f4f6; }

        .tag-badge {
          background: #eff6ff;
          color: #3b82f6;
          border: 1px solid #bfdbfe;
          height: 28px;
          font-size: 14px;
          font-weight: 600;
          padding: 0 8px 0 14px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          white-space: nowrap;
        }
        .tag-close {
          cursor: pointer;
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
        }
        .tag-close:hover { background: #2563eb; }

        .delete-btn {
          height: 40px;
          padding: 0 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #ef4444;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          /* Centres the shorter button against the 52px controls beside it. */
          margin-bottom: 6px;
        }

        .add-access-btn {
          height: 48px;
          padding: 0 20px;
          background: #fff;
          border: 1.5px solid #111827;
          color: #111827;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-top: 40px;
        }
      `}</style>

      {/* Header View */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Add New Role</h1>
          <div className="breadcrumb">
            <span>User Management</span>
            <span className="breadcrumb-dot" />
            <span className="breadcrumb-current">Add New Roll</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => router.push('/settings/role-management')}
            className="header-btn header-btn-discard animate-btn"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="header-btn header-btn-primary animate-btn"
          >
            {loading ? 'Saving...' : 'Add Role'}
          </button>
        </div>
      </div>

      {/* ─── Add Details Card ─── */}
      <div className="details-card">
        <h2 className="card-title">Add Details</h2>
        <hr className="card-divider" />

        <div className="field-group">
          {/* Role Name */}
          <div>
            <label className="field-label">
              Role Name<span className="req">*</span>
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
          <div className="access-list">
            {accessItems.map((item) => (
              <div key={item.id} className="access-row">
                {/* Selected Access Picker */}
                <div className="access-col">
                  <label className="field-label">
                    Selected Access<span className="req">*</span>
                  </label>
                  <div
                    onClick={() => {
                      setActiveTypeDropdownId(null);
                      setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                    }}
                    className="select-box"
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', overflow: 'hidden' }}>
                      {item.selectedAccess ? (
                        <span className="tag-badge" title={item.selectedAccess}>
                          Module
                          <span
                            className="tag-close"
                            role="button"
                            aria-label={`Remove ${item.selectedAccess}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateAccess(item.id, 'selectedAccess', '');
                            }}
                          >
                            ×
                          </span>
                        </span>
                      ) : (
                        <span className="select-placeholder">Select Access</span>
                      )}
                    </div>
                    {chevron}
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
                <div className="access-col">
                  <label className="field-label">
                    Access Type<span className="req">*</span>
                  </label>
                  <div
                    onClick={() => {
                      setActiveDropdownId(null);
                      setActiveTypeDropdownId(activeTypeDropdownId === item.id ? null : item.id);
                    }}
                    className="select-box"
                  >
                    <span className="select-value">{item.accessType}</span>
                    {chevron}
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

                {/* Delete appears only once a row can actually be removed. */}
                {accessItems.length > 1 && (
                  <button
                    onClick={() => handleRemoveAccess(item.id)}
                    className="delete-btn animate-btn"
                  >
                    Delete
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Another Access Button */}
          <div style={{ display: 'flex', marginTop: '-40px' }}>
            <button onClick={handleAddAccess} className="add-access-btn animate-btn">
              Add Another Access
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddRolePage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading role details...</div>}>
      <AddRoleContent />
    </Suspense>
  );
}
