'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useUsers } from '../_hooks/useUsers';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  Copy, 
  Check, 
  Edit, 
  ExternalLink, 
  MoreVertical 
} from 'lucide-react';

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { users, loading } = useUsers();
  
  // ── States ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'personal' | 'activity' | 'escalations'>('personal');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedDisputeId, setCopiedDisputeId] = useState<string | null>(null);

  // Find current user
  const user = useMemo(() => {
    return users.find((u) => u.id === id);
  }, [users, id]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading user details...
      </div>
    );
  }

  if (!user) {
    return notFound();
  }

  // ── Handlers ────────────────────────────────────────────────
  const handleCopy = (val: string, type: 'id' | 'dispute') => {
    navigator.clipboard.writeText(val);
    if (type === 'id') {
      setCopiedId(val);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopiedDisputeId(val);
      setTimeout(() => setCopiedDisputeId(null), 2000);
    }
  };

  // Determine copied badge text
  let idLabel = 'Customer ID';
  if (user.role.toLowerCase().includes('mechanic')) idLabel = 'Mehcanic ID';
  else if (user.role.toLowerCase().includes('kaarigar')) idLabel = 'Kaarigar ID';
  else if (user.role.toLowerCase().includes('admin')) idLabel = 'Admin ID';
  else if (user.role.toLowerCase().includes('audit')) idLabel = 'Audit ID';

  return (
    <div className={styles.container}>
      {/* Header Area */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <div className={styles.breadcrumbs}>
            <Link href="/users">User Management</Link>
            <span>•</span>
            <span className={styles.breadcrumbActive}>{user.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className={styles.title}>{user.name}</h1>
            <div 
              className={`${styles.copyIdBadge} ${copiedId === user.id ? styles.copySuccess : ''}`}
              onClick={() => handleCopy(user.id, 'id')}
            >
              {copiedId === user.id ? (
                <>Copied! <Check size={12} /></>
              ) : (
                <>{idLabel} <Copy size={12} /></>
              )}
            </div>
          </div>
        </div>

        <button 
          className={styles.editBtn}
          onClick={() => router.push(`/users/${user.id}/edit`)}
        >
          <Edit size={16} /> Edit {user.role} Details
        </button>
      </div>

      {/* Summary Card Strip */}
      <div className={styles.summaryStrip}>
        <div className={styles.summaryCol}>
          <span className={styles.summaryLabel}>City</span>
          <span className={styles.summaryValue}>{user.location || 'Delhi NCR'}</span>
        </div>
        <div className={styles.summaryCol}>
          <span className={styles.summaryLabel}>Membership</span>
          <span className={styles.membershipBadge}>
            {user.membership || 'Silver'}
          </span>
        </div>
        <div className={styles.summaryCol}>
          <span className={styles.summaryLabel}>Lifetime Value</span>
          <span className={styles.summaryValue}>{user.lifetimeValue}</span>
        </div>
        <div className={styles.summaryCol}>
          <span className={styles.summaryLabel}>Joined on</span>
          <span className={styles.summaryValue}>{user.joinedAt}</span>
        </div>
        <div className={styles.summaryCol}>
          <span className={styles.summaryLabel}>Last Login</span>
          <span className={styles.summaryValue}>{user.lastLogin}</span>
        </div>
        <div className={styles.summaryCol}>
          <span className={styles.summaryLabel}>Status</span>
          <span style={{ 
            color: user.status === 'Active' ? '#10b981' : user.status === 'Inactive' ? '#4b5563' : '#ef4444',
            fontWeight: 700,
            fontSize: '0.9375rem'
          }}>
            {user.status}
          </span>
        </div>
      </div>

      {/* Tab bar navigation */}
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'personal' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Details
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'activity' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity Snapshot
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'escalations' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('escalations')}
        >
          Escalations
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'personal' && (
        <div className={styles.detailsGrid}>
          {/* Basic Details Card */}
          <div className={styles.detailCard}>
            <h2 className={styles.cardTitle}>Basic Details</h2>
            <div className={styles.roleAlertStrip}>
              Role : {user.role}
            </div>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phone Number</span>
                <span className={styles.infoValue}>{user.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>DOB</span>
                <span className={styles.infoValue}>{user.dob || '21 Jan\' 1990'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Selected Language</span>
                <span className={styles.infoValue}>{user.selectedLanguage || 'Hindi, English, Punjabi'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Joining Date</span>
                <span className={styles.infoValue}>{user.joiningDate || '21 Jan\' 2026'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Type of User</span>
                <span className={styles.infoValue}>{user.typeOfUser || 'Individual'}</span>
              </div>
            </div>
          </div>

          {/* Business Details Card (Render for Business Owner or when available) */}
          {(user.businessName || user.typeOfUser === 'Business Owner') && (
            <div className={styles.detailCard}>
              <h2 className={styles.cardTitle}>Business Details</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Business Name:</span>
                  <span className={styles.infoValue}>{user.businessName || 'Demo company Pvt Ltd'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Business Type:</span>
                  <span className={styles.infoValue}>{user.businessType || 'Demo Type'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>GST Number:</span>
                  <span className={styles.infoValue}>{user.gstNumber || '29ABCDE1234F1Z5'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className={styles.detailCard}>
          <h2 className={styles.cardTitle}>Modules Used</h2>
          
          <div className={styles.modulesRow}>
            {(user.modulesUsed || []).includes('spares') && (
              <span className={`${styles.moduleBadge} ${styles.moduleSpares}`}>spares</span>
            )}
            {(user.modulesUsed || []).includes('exchange') && (
              <span className={`${styles.moduleBadge} ${styles.moduleExchange}`}>exchange</span>
            )}
            {(user.modulesUsed || []).includes('kaarigar') && (
              <span className={`${styles.moduleBadge} ${styles.moduleKaarigar}`}>kaarigar</span>
            )}
            {(user.modulesUsed || []).includes('academy') && (
              <span className={`${styles.moduleBadge} ${styles.moduleAcademy}`}>academy</span>
            )}
            {(!user.modulesUsed || user.modulesUsed.length === 0) && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No modules used yet.</span>
            )}
          </div>

          <h2 className={styles.cardTitle} style={{ marginTop: '1rem' }}>Activity Details</h2>
          
          <div className={styles.timeline}>
            {user.activities && user.activities.length > 0 ? (
              user.activities.map((act) => (
                <div key={act.id} className={styles.timelineItem}>
                  <div className={styles.timelineNode}>N</div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineDetails}>
                      <span className={styles.timelineTitle}>{act.title}</span>
                      <button 
                        className={styles.timelineBtn}
                        onClick={() => alert('Activity details are being fetched...')}
                      >
                        View Details <ExternalLink size={10} />
                      </button>
                      <span className={`${styles.timelineStatus} ${
                        act.status === 'Completed' ? styles.statusCompleted : styles.statusCancelled
                      }`}>
                        {act.status}
                      </span>
                    </div>
                    <span className={styles.timelineTime}>{act.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem 0' }}>
                No activities recorded.
              </div>
            )}
            <div className={styles.timelineFooter}>
              Created- {user.joiningDate || '15th Jan 2025'}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'escalations' && (
        <div className={styles.tableCard}>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input type="checkbox" className={styles.checkbox} readOnly checked={false} />
                  </th>
                  <th>Dispute ID</th>
                  <th>Mechanic Name</th>
                  <th>Issue Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {user.escalations && user.escalations.length > 0 ? (
                  user.escalations.map((esc) => (
                    <tr key={esc.id}>
                      <td>
                        <input type="checkbox" className={styles.checkbox} readOnly checked={false} />
                      </td>
                      <td>
                        <div 
                          className={`${styles.disputeIdBadge} ${copiedDisputeId === esc.disputeId ? styles.copySuccess : ''}`}
                          onClick={() => handleCopy(esc.disputeId, 'dispute')}
                          title="Click to copy dispute ID"
                        >
                          {copiedDisputeId === esc.disputeId ? (
                            <>Copied! <Check size={10} /></>
                          ) : (
                            <>{esc.disputeId} <Copy size={10} /></>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.mechanicCell}>
                          <div className={styles.mechanicAvatar}>
                            {esc.mechanicName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{esc.mechanicName}</span>
                        </div>
                      </td>
                      <td>{esc.issueType}</td>
                      <td>
                        <span className={esc.status === 'Resolved' ? styles.statusResolved : styles.statusActive}>
                          {esc.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionCell}>
                          <button 
                            className={styles.viewBtn}
                            onClick={() => alert(`Viewing ticket details: ${esc.disputeId}`)}
                          >
                            View <ExternalLink size={12} />
                          </button>
                          <button 
                            className={styles.moreBtn}
                            onClick={() => alert('Actions: Escalate, Close')}
                            aria-label="Actions"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No dispute escalations logged for this user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <div>Rows per page: 10</div>
            <div>
              1–{user.escalations ? user.escalations.length : 0} of {user.escalations ? user.escalations.length : 0}
            </div>
            <div className={styles.pageArrows}>
              <button className={styles.arrowBtn} disabled aria-label="Prev">‹</button>
              <button className={styles.arrowBtn} disabled aria-label="Next">›</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
