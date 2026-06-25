'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

// ─── Types ─────────────────────────────────────────────────────────
export interface Mechanic {
  id: string;
  name: string;
  mechanicId?: string;
  lastActivity?: string;
  lastLogin?: string;
  jobsCompleted?: number;
  totalJobs?: number;
  rating?: number;
  flags?: number | null;
  avatarColor?: string;
  phone?: string;
  location?: string;
  status?: string;
}

interface ApiResponse {
  data: {
    items: Mechanic[];
    total: number;
    page: number;
    pageSize: number;
  };
  success: boolean;
}

interface AssignMechanicModalProps {
  onClose: () => void;
  onAssign: (mechanic: Mechanic) => void;
}

// ─── Helpers ────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#3b82f6','#f59e0b','#ef4444','#10b981','#8b5cf6','#ec4899','#06b6d4','#f97316'];

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function ratingColor(r: number) {
  if (r >= 4) return { bg: '#dcfce7', color: '#16a34a' };
  if (r >= 3) return { bg: '#fef9c3', color: '#ca8a04' };
  return { bg: '#fee2e2', color: '#dc2626' };
}

// ─── Mock fallback data ─────────────────────────────────────────────
const MOCK_MECHANICS: Mechanic[] = [
  { id: 'm-1', name: 'Suresh Sharma',  mechanicId: 'MCH-001', lastActivity: '3 days ago',        jobsCompleted: 4,  rating: 5, flags: null },
  { id: 'm-2', name: 'Rajesh Chauhan', mechanicId: 'MCH-002', lastActivity: '3 Months ago',      jobsCompleted: 4,  rating: 3, flags: null },
  { id: 'm-3', name: 'Shivam Pant',    mechanicId: 'MCH-003', lastActivity: 'Yesterday, 4:32 PM',jobsCompleted: 5,  rating: 2, flags: 2   },
  { id: 'm-4', name: 'Suresh Sharma',  mechanicId: 'MCH-004', lastActivity: '3 days ago',        jobsCompleted: 4,  rating: 3, flags: null },
  { id: 'm-5', name: 'Rajesh Chauhan', mechanicId: 'MCH-005', lastActivity: '3 Months ago',      jobsCompleted: 15, rating: 5, flags: null },
  { id: 'm-6', name: 'Shivam Pant',    mechanicId: 'MCH-006', lastActivity: 'Yesterday, 4:32 PM',jobsCompleted: 20, rating: 3, flags: 2   },
  { id: 'm-7', name: 'Amit Verma',     mechanicId: 'MCH-007', lastActivity: '1 week ago',        jobsCompleted: 32, rating: 4, flags: null },
  { id: 'm-8', name: 'Priya Singh',    mechanicId: 'MCH-008', lastActivity: '2 days ago',        jobsCompleted: 11, rating: 5, flags: null },
];

// ─── Component ─────────────────────────────────────────────────────
export default function AssignMechanicModal({ onClose, onAssign }: AssignMechanicModalProps) {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [total, setTotal]         = useState(0);

  const [search, setSearch]       = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selected, setSelected]   = useState<string | null>(null);
  const [page, setPage]           = useState(1);
  const PER_PAGE = 10;

  // ── Debounce search ──────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // ── Fetch mechanics ──────────────────────────────────────────
  const fetchMechanics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PER_PAGE),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      });
      const url = `${ENDPOINTS.mechanics.list}?${params.toString()}`;
      const res = await apiClient.get<ApiResponse>(url);

      if (res?.data?.items) {
        setMechanics(res.data.items);
        setTotal(res.data.total ?? res.data.items.length);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch {
      // Fallback to mock data when backend not available
      const filtered = debouncedSearch
        ? MOCK_MECHANICS.filter(m => m.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
        : MOCK_MECHANICS;
      const start = (page - 1) * PER_PAGE;
      setMechanics(filtered.slice(start, start + PER_PAGE));
      setTotal(filtered.length);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchMechanics(); }, [fetchMechanics]);

  // ── Assign handler ───────────────────────────────────────────
  const handleAssign = () => {
    const m = mechanics.find(x => x.id === selected);
    if (m) { onAssign(m); onClose(); }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <>
      <style>{`
        @keyframes amFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes amSlideUp { from { opacity:0; transform: translateY(20px) scale(.98) } to { opacity:1; transform: translateY(0) scale(1) } }
        .am-overlay { animation: amFadeIn .2s ease; }
        .am-modal   { animation: amSlideUp .26s cubic-bezier(.22,.68,0,1.18); }
        .am-row     { transition: background .13s; cursor: pointer; }
        .am-row:hover { background: #f8fafc !important; }
        .am-row.am-sel { background: #eff6ff !important; }
        .am-search:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,.12); }
        .am-pg-btn { transition: background .15s; }
        .am-pg-btn:hover:not(:disabled) { background: #f1f5f9; }
        @keyframes amSpin { to { transform: rotate(360deg); } }
        .am-spinner { animation: amSpin .8s linear infinite; }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        className="am-overlay"
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.46)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
      >
        {/* ── Modal ── */}
        <div
          className="am-modal"
          onClick={e => e.stopPropagation()}
          style={{ background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '840px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 72px rgba(0,0,0,0.2)', overflow: 'hidden' }}
        >

          {/* Header */}
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#111827' }}>
              Select Mechanic to Assign Job
            </h2>
            <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', display: 'flex', alignItems: 'center', borderRadius: '6px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Search + Filters */}
          <div style={{ padding: '0.875rem 1.5rem', display: 'flex', gap: '10px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                className="am-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by Mechanic Name / ID"
                style={{ width: '100%', padding: '8px 12px 8px 34px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem', color: '#111827', background: '#fff', transition: 'border-color .15s, box-shadow .15s', boxSizing: 'border-box' }}
              />
            </div>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', borderRadius: '8px', background: '#111827', color: '#fff', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Apply Filters
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            </button>
          </div>

          {/* Table Area */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '12px', color: '#9ca3af' }}>
                <svg className="am-spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Loading mechanics...</span>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                <p style={{ marginBottom: '0.5rem' }}>{error}</p>
                <button onClick={fetchMechanics} style={{ fontSize: '0.8125rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
              </div>
            )}

            {/* Table */}
            {!loading && !error && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ width: '44px', padding: '10px 14px' }} />
                    {['Mechanic Name', 'Mechanic ID', 'Last Activity', 'Jobs Completed', 'Rating', 'Flags'].map((col, i) => (
                      <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        {col} <span style={{ color: '#d1d5db', fontSize: '0.65rem' }}>↑↓</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mechanics.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>No mechanics found</td></tr>
                  ) : mechanics.map((m) => {
                    const isSel = selected === m.id;
                    const rating = m.rating ?? 0;
                    const jobs   = m.jobsCompleted ?? m.totalJobs ?? 0;
                    const activity = m.lastActivity ?? m.lastLogin ?? '–';
                    const mechId   = m.mechanicId ?? m.id;
                    const rc = ratingColor(rating);
                    const avatarBg = m.avatarColor ?? getAvatarColor(m.name);

                    return (
                      <tr
                        key={m.id}
                        className={`am-row${isSel ? ' am-sel' : ''}`}
                        onClick={() => setSelected(m.id)}
                        style={{ borderBottom: '1px solid #f3f4f6', background: isSel ? '#eff6ff' : '#fff' }}
                      >
                        {/* Radio */}
                        <td style={{ padding: '13px 14px' }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: isSel ? '5px solid #2563eb' : '1.5px solid #d1d5db', transition: 'border .13s', boxSizing: 'border-box', flexShrink: 0 }} />
                        </td>

                        {/* Name */}
                        <td style={{ padding: '13px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0, letterSpacing: '0.03em' }}>
                              {getInitials(m.name)}
                            </div>
                            <span style={{ fontWeight: 600, color: '#111827' }}>{m.name}</span>
                          </div>
                        </td>

                        {/* ID */}
                        <td style={{ padding: '13px 14px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#3b82f6', border: '1.5px dashed #93c5fd', borderRadius: '5px', padding: '3px 8px', fontWeight: 500, maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {mechId}
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          </span>
                        </td>

                        {/* Last Activity */}
                        <td style={{ padding: '13px 14px', color: '#6b7280' }}>{activity}</td>

                        {/* Jobs */}
                        <td style={{ padding: '13px 14px', fontWeight: 600, color: '#111827' }}>{jobs}</td>

                        {/* Rating */}
                        <td style={{ padding: '13px 14px' }}>
                          {rating > 0 ? (
                            <span style={{ display: 'inline-block', background: rc.bg, color: rc.color, fontWeight: 700, fontSize: '0.8125rem', padding: '3px 10px', borderRadius: '6px', minWidth: '28px', textAlign: 'center' }}>
                              {rating}
                            </span>
                          ) : <span style={{ color: '#9ca3af' }}>–</span>}
                        </td>

                        {/* Flags */}
                        <td style={{ padding: '13px 14px' }}>
                          {m.flags != null && m.flags > 0 ? (
                            <span style={{ display: 'inline-block', background: '#fee2e2', color: '#dc2626', fontWeight: 700, fontSize: '0.8125rem', padding: '3px 10px', borderRadius: '6px', minWidth: '28px', textAlign: 'center' }}>
                              {m.flags}
                            </span>
                          ) : <span style={{ color: '#9ca3af' }}>–</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && (
            <div style={{ padding: '10px 1.5rem', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '0.8125rem', color: '#6b7280' }}>
              <span>
                Rows per page:&nbsp;
                <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#374151', cursor: 'pointer', fontSize: '0.8125rem' }}>
                  <option>10</option><option>20</option>
                </select>
              </span>
              <span style={{ color: '#374151', fontWeight: 500 }}>
                {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
              </span>
              <div style={{ display: 'flex', gap: '2px' }}>
                <button
                  className="am-pg-btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  style={{ border: 'none', background: 'none', cursor: page > 1 ? 'pointer' : 'default', color: page > 1 ? '#374151' : '#d1d5db', fontSize: '0.9rem', padding: '4px 8px', borderRadius: '5px' }}
                >❮</button>
                <button
                  className="am-pg-btn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  style={{ border: 'none', background: 'none', cursor: page < totalPages ? 'pointer' : 'default', color: page < totalPages ? '#374151' : '#d1d5db', fontSize: '0.9rem', padding: '4px 8px', borderRadius: '5px' }}
                >❯</button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1.5px solid #e5e7eb', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{ padding: '11px', border: '1.5px solid #d1d5db', borderRadius: '10px', background: '#fff', color: '#374151', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selected}
              style={{ padding: '11px', border: 'none', borderRadius: '10px', background: selected ? '#111827' : '#e5e7eb', color: selected ? '#fff' : '#9ca3af', fontSize: '0.9375rem', fontWeight: 600, cursor: selected ? 'pointer' : 'default', transition: 'background .2s, color .2s' }}
            >
              Assign Mechanic
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
