'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ENDPOINTS } from '@/lib';

interface Role {
  id: string;
  index: string;
  name: string;
  mappedCount: number;
}

const INITIAL_ROLES: Role[] = [
  { id: 'role-1', index: '01', name: 'Super- Admin', mappedCount: 12 },
  { id: 'role-2', index: '02', name: 'ST Spares Admin', mappedCount: 12 },
  { id: 'role-3', index: '03', name: 'ST Mechanics Admin', mappedCount: 12 },
  { id: 'role-4', index: '04', name: 'Audit', mappedCount: 12 },
  { id: 'role-5', index: '05', name: 'Mechanic', mappedCount: 12 },
  { id: 'role-6', index: '06', name: 'Customer', mappedCount: 12 },
];

export default function RoleManagementPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Load actual Roles from local backend API server if online
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        // Assume API has a role endpoint under settings or system namespace
        const res = await apiClient.get<{ success: boolean; data: Role[] }>('/api/v1/settings/roles');
        if (res && res.success && Array.isArray(res.data)) {
          setRoles(res.data);
        }
      } catch (err) {
        console.warn('Backend server offline. Displaying static roles mockup database.');
        setRoles(INITIAL_ROLES);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-btn { transition: all 0.2s ease; }
        .animate-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .animate-btn:active { transform: translateY(1px); }
        .animate-tr { transition: all 0.2s ease; }
        .animate-tr:hover { background-color: #f9fafb !important; }
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e5e7eb;
          borderRadius: 0.5rem;
          outline: none;
          fontSize: 0.875rem;
          fontWeight: 500;
          color: #111827;
          background: #fff;
          transition: all 0.2s ease;
        }
        .search-input:focus {
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
        }
      `}</style>

      {/* Header view */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827' }}>Role Management</h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            System & Settings <span style={{ margin: '0 0.5rem' }}>•</span> <span style={{ fontWeight: 600, color: '#111827' }}>Added Roles</span>
          </div>
        </div>
        
        <button 
          onClick={() => router.push('/settings/role-management/add')}
          style={{ background: '#111827', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          className="animate-btn"
        >
          AddNew Role
        </button>
      </div>

      {/* Main Table Container Card */}
      <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Added Roles</h2>
        <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

        {/* Inner Bordered Table wrapper */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', background: '#f9fafb' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Search Industry" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {/* List Table */}
          <div style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>Loading Roles...</td>
                  </tr>
                )}
                {!loading && filteredRoles.map((role) => (
                  <tr 
                    key={role.id} 
                    className="animate-tr"
                    style={{ borderBottom: '1px solid #e5e7eb' }}
                  >
                    {/* Index Col */}
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#111827', width: '60px' }}>
                      {role.index}
                    </td>

                    {/* Role Name */}
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>
                      {role.name}
                    </td>

                    {/* IDs Mapped */}
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#9ca3af', textAlign: 'right' }}>
                      IDs Mapped: <strong style={{ color: '#111827', marginLeft: '4px' }}>{role.mappedCount}</strong>
                    </td>

                    {/* Actions button */}
                    <td style={{ padding: '1.25rem 1.5rem', width: '60px', textAlign: 'right' }}>
                      <button 
                        onClick={() => router.push(`/settings/role-management/add?editId=${role.id}`)}
                        style={{ border: 'none', background: '#111827', color: '#fff', width: '32px', height: '32px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        className="animate-btn"
                        title="Edit Access"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table pagination mockup row matching figma */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', padding: '0 0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Rows per page:</span>
              <select style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}>
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>1–10 of 165</span>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&lt;</button>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&gt;</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
