'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { apiClient, ENDPOINTS } from '@/lib';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useUsers } from '../_hooks/useUsers';
import Link from 'next/link';
import { User } from '@/types';
import styles from './page.module.css';
import { 
  Copy, 
  Check, 
  Edit, 
  ExternalLink, 
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { fetchUser, deactivateUser, deleteUser } = useUsers();
  
  // ── States ──────────────────────────────────────────────────
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'personal' | 'activity' | 'escalations' | 'identity' | 'jobs' | 'violations'>('personal');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedDisputeId, setCopiedDisputeId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // ── Escalations (real disputes from backend) ─────────────────
  const [escalations, setEscalations] = useState<any[]>([]);
  const [escLoading, setEscLoading] = useState(false);

  const fetchEscalations = useCallback(async (userId: string) => {
    setEscLoading(true);
    try {
      const qs = new URLSearchParams({ page: '1', pageSize: '50' });
      // Admin can view all disputes; filter by customer_id for this user
      const res = await apiClient.get<{ success: boolean; data: any }>(
        `${ENDPOINTS.support.disputes}?${qs}&customer_id=${userId}`
      );
      if (res?.success && res.data) {
        const items = Array.isArray(res.data) ? res.data : (res.data.items ?? []);
        setEscalations(items.map((d: any) => ({
          id:           String(d.id),
          disputeId:    d.dispute_number ?? `DISP-${d.id}`,
          mechanicId:   d.mechanic_id ?? null,
          mechanicName: d.mechanic_name ?? (d.mechanic_id ? `Mechanic #${d.mechanic_id}` : 'N/A'),
          issueType:    d.reason ?? d.dispute_type ?? 'General',
          status:       ['Approved', 'Rejected', 'Refund Completed', 'Closed'].includes(d.status)
                          ? 'Resolved' : 'Active',
          rawStatus:    d.status,
          amount:       d.amount,
          orderId:      d.order_id,
        })));
      } else {
        setEscalations([]);
      }
    } catch {
      setEscalations([]);
    } finally {
      setEscLoading(false);
    }
  }, []);

  // Fetch current user
  useEffect(() => {
    if (id === 'add') return; // Prevent dynamic route from intercepting "add"

    const loadUser = async () => {
      setLoading(true);
      const fetchedUser = await fetchUser(id);
      if (fetchedUser) setUser(fetchedUser);
      setLoading(false);
    };
    loadUser();
  }, [id, fetchUser]);

  // Fetch escalations when tab becomes active
  useEffect(() => {
    if (activeTab === 'escalations' && id && id !== 'add') {
      fetchEscalations(id);
    }
  }, [activeTab, id, fetchEscalations]);

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

  const handleDeactivate = async () => {
    if (confirm('Are you sure you want to deactivate this user?')) {
      setIsDeactivating(true);
      try {
        await deactivateUser(id);
        alert('User deactivated successfully');
        setUser({ ...user, status: 'Inactive' });
      } catch (err: any) {
        alert(err.message || 'Failed to deactivate');
      } finally {
        setIsDeactivating(false);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to PERMANENTLY delete this user?')) {
      setIsDeleting(true);
      try {
        await deleteUser(id);
        alert('User deleted successfully');
        router.push('/users');
      } catch (err: any) {
        alert(err.message || 'Failed to delete');
        setIsDeleting(false);
      }
    }
  };

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
  if (user.role.toLowerCase().includes('mechanic')) idLabel = 'Mechanic ID';
  else if (user.role.toLowerCase().includes('kaarigar')) idLabel = 'Kaarigar ID';
  else if (user.role.toLowerCase().includes('admin')) idLabel = 'Admin ID';
  else if (user.role.toLowerCase().includes('audit')) idLabel = 'Audit ID';

  return (
    <div className={styles.container}>
      {/* Header Area */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
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
          <div className={styles.breadcrumbs}>
            <Link href="/users">User Management</Link>
            <span style={{ margin: '0 0.5rem', fontSize: '1rem' }}>•</span>
            <span className={styles.breadcrumbActive}>{user.name}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', paddingBottom: '0.25rem' }}>
          <button 
            className={styles.editBtn}
            onClick={() => router.push(`/users/${user.id}/edit`)}
          >
            Edit Customer Details <Edit size={14} style={{ marginLeft: '0.25rem' }} />
          </button>
        </div>
      </div>

      {/* Summary Card Strip */}
      <div className={styles.summaryStrip}>
        <div className={styles.summaryCol}>
          <span className={styles.summaryValue}>{user.location || 'Delhi NCR'}</span>
          <span className={styles.summaryLabel}>City</span>
        </div>
        <div className={styles.summaryCol}>
          <span className={styles.membershipBadge}>
            {user.membership || 'Gold'}
          </span>
          <span className={styles.summaryLabel}>Membership</span>
        </div>
        <div className={styles.summaryCol}>
          <span className={styles.summaryValue}>{user.lifetimeValue || '₹ 15,000'}</span>
          <span className={styles.summaryLabel}>Lifetime Value</span>
        </div>
        <div className={styles.summaryCol}>
          <span className={styles.summaryValue}>{user.joinedAt || '21 Jan \' 26'}</span>
          <span className={styles.summaryLabel}>Joined on</span>
        </div>
        <div className={styles.summaryCol}>
          <span className={styles.summaryValue}>{user.lastLogin || '21 Jan \' 26'}</span>
          <span className={styles.summaryLabel}>Last Login</span>
        </div>
        <div className={styles.summaryCol} style={{ borderRight: 'none' }}>
          <span style={{ 
            color: user.status === 'Active' ? '#10b981' : user.status === 'Inactive' ? '#4b5563' : '#ef4444',
            fontWeight: 700,
            fontSize: '1rem'
          }}>
            {user.status || 'Active'}
          </span>
          <span className={styles.summaryLabel}>Status</span>
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
        {user.role.toLowerCase().includes('mechanic') && (
          <button 
            className={`${styles.tab} ${activeTab === 'identity' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('identity')}
          >
            Identity & Verification
          </button>
        )}
        <button 
          className={`${styles.tab} ${activeTab === 'activity' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity Snapshot
        </button>
        {user.role.toLowerCase().includes('mechanic') && (
          <>
            <button 
              className={`${styles.tab} ${activeTab === 'jobs' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              Jobs
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'violations' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('violations')}
            >
              Violations & Risk
            </button>
          </>
        )}
        {user.role.toLowerCase() === 'customer' && (
          <button 
            className={`${styles.tab} ${activeTab === 'escalations' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('escalations')}
          >
            Escalations
          </button>
        )}
      </div>

      {/* Tab Panels */}
      {activeTab === 'personal' && user.role.toLowerCase().includes('mechanic') && (
        <div className={styles.detailsGrid}>
          {/* Basic Details Card */}
          <div className={styles.detailCard}>
            <h2 className={styles.cardTitle}>Basic Details</h2>
            <div className={styles.roleAlertStrip}>
              Role : Mechanic
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{user.email || 'nishant.kumar@gmail.com'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phone Number</span>
                <span className={styles.infoValue}>{user.phone || '+919876543210'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>DOB</span>
                <span className={styles.infoValue}>{user.dob || "21 Jan' 1990"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Selected Language</span>
                <span className={styles.infoValue}>{user.selectedLanguage || 'Hindi, English, Punjabi'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Joining Date</span>
                <span className={styles.infoValue}>{user.joiningDate || "21 Jan' 2026"}</span>
              </div>
            </div>
          </div>

          {/* Active Services */}
          <div className={styles.detailCard}>
            <h2 className={styles.cardTitle}>Active Services</h2>
            <div className={styles.activeServicesRow}>
              <div className={`${styles.servicePill} ${styles.serviceOrange}`}>
                <span className={styles.serviceIcon}></span> Video Call Assistance <MoreVertical size={14} className={styles.serviceMore} />
              </div>
              <div className={`${styles.servicePill} ${styles.serviceGreen}`}>
                <span className={styles.serviceIcon}></span> Instant Smart Booking <MoreVertical size={14} className={styles.serviceMore} />
              </div>
              <div className={`${styles.servicePill} ${styles.serviceCyan}`}>
                <span className={styles.serviceIcon}></span> Invite Quote <MoreVertical size={14} className={styles.serviceMore} />
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className={styles.detailCard}>
            <h2 className={styles.cardTitle}>Profile Details</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className={styles.infoLabel}>Bio:</span>
              <p style={{ fontSize: '0.875rem', color: '#1e293b', marginTop: '0.5rem', lineHeight: '1.5' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              </p>
            </div>
            <div className={styles.infoGrid} style={{ marginBottom: '1.5rem' }}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Experience (in years):</span>
                <span className={styles.infoValue}>3</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Availability:</span>
                <span className={styles.infoValue}>Mon, Tue, Wed, Thu, Fri</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Location Preference:</span>
                <span className={styles.infoValue}>Delhi NCR</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Skills:</span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span className={styles.tagBlue}>Skill Tag 1</span>
                  <span className={styles.tagBlue}>Skill Tag 2</span>
                </div>
              </div>
            </div>
            <div>
              <span className={styles.infoLabel}>Machines/ Brands familiar with:</span>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span className={styles.tagBlue}>Machine Tag 1 <ExternalLink size={12} style={{ marginLeft: '0.25rem' }} /></span>
                <span className={styles.tagBlue}>Machine Tag 1 <ExternalLink size={12} style={{ marginLeft: '0.25rem' }} /></span>
                <span className={styles.tagGreen}>Brand Tag 1</span>
                <span className={styles.tagGreen}>Brand Tag 2</span>
              </div>
            </div>
          </div>

          {/* Pitches */}
          <div className={styles.pitchesGrid}>
            <div className={styles.pitchCard}>
              <h3 className={styles.pitchTitle}>Mechanic Audio Pitch<span style={{ color: 'red' }}>*</span></h3>
              <div className={styles.audioPlayerPlaceholder}>
                <div className={styles.audioTrack}>
                  <div className={styles.audioProgress}></div>
                  <div className={styles.audioThumb}></div>
                </div>
                <div className={styles.audioTimes}>
                  <span>02:30</span>
                  <span>03:30</span>
                </div>
                <div className={styles.audioControls}>
                  <div className={styles.audioControlIcon}></div>
                  <div className={styles.audioControlIcon}></div>
                  <div className={styles.audioPlayBtn}></div>
                  <div className={styles.audioControlIcon}></div>
                  <div className={styles.audioControlIcon}></div>
                </div>
              </div>
            </div>
            <div className={styles.pitchCard}>
              <h3 className={styles.pitchTitle}>Mechanic Video Pitch<span style={{ color: 'red' }}>*</span></h3>
              <div className={styles.videoPlayerPlaceholder}>
                <div className={styles.videoPlayBtn}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'personal' && !user.role.toLowerCase().includes('mechanic') && (
        <div className={styles.detailsGrid}>
          {/* Basic Details Card */}
          <div className={styles.detailCard}>
            <h2 className={styles.cardTitle}>Basic Details</h2>
            <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '0' }} />
            
            <div className={styles.roleAlertStrip}>
              Role : {user.role || 'Customer'}
            </div>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{user.email || 'nishant.kumar@gmail.com'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phone Number</span>
                <span className={styles.infoValue}>{user.phone || '+91 9876543210'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>DOB</span>
                <span className={styles.infoValue}>{user.dob || '21 Jan \' 1990'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Selected Language</span>
                <span className={styles.infoValue}>{user.selectedLanguage || 'Hindi, English, Punjabi'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Joining Date</span>
                <span className={styles.infoValue}>{user.joiningDate || '21 Jan \' 2026'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Type of User</span>
                <span className={styles.infoValue}>{user.typeOfUser || 'Business Owner'}</span>
              </div>
            </div>
          </div>

          {/* Business Details Card (Render for Business Owner or when available) */}
          <div className={styles.detailCard}>
            <h2 className={styles.cardTitle}>Business Details</h2>
            <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '0' }} />
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
        </div>
      )}

      {/* Identity & Verification Tab */}
      {activeTab === 'identity' && (
        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <h2 className={styles.cardTitle}>Documents</h2>
            
            <div className={styles.infoGrid} style={{ marginTop: '1rem' }}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Name as on Aadhar Card:</span>
                <span className={styles.infoValue}>Nishant Kumar</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Aadhar Number:</span>
                <span className={styles.infoValue}>1234 5678 1234</span>
              </div>
              <div className={styles.infoItem} style={{ marginTop: '1.5rem' }}>
                <span className={styles.infoLabel}>Name as on PAN Card:</span>
                <span className={styles.infoValue}>Nishant Kumar</span>
              </div>
              <div className={styles.infoItem} style={{ marginTop: '1.5rem' }}>
                <span className={styles.infoLabel}>PAN Number:</span>
                <span className={styles.infoValue}>1234 5678 1234</span>
              </div>
              <div className={styles.infoItem} style={{ marginTop: '1.5rem', gridColumn: '2 / 3' }}>
                <span className={styles.infoLabel}>PAN Card Uploaded:</span>
                <div style={{ marginTop: '0.25rem' }}>
                  <a href="#" className={styles.documentPill}>
                    nishant-pan-card.pdf <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className={styles.detailCard}>
          {!user.role.toLowerCase().includes('mechanic') && (
            <>
              <h2 className={styles.cardTitle}>Modules Used</h2>
              <div className={styles.modulesRow}>
                {(() => {
                  const displayModules = user.modulesUsed?.length ? user.modulesUsed : ['spares', 'exchange', 'kaarigar', 'academy'];
                  return (
                    <>
                      {displayModules.includes('spares') && (
                        <div className={`${styles.moduleBadge} ${styles.spares}`}>
                          <span>spares</span>
                          <img src="/sewtech spares.svg" alt="spares icon" />
                        </div>
                      )}
                      {displayModules.includes('exchange') && (
                        <div className={`${styles.moduleBadge} ${styles.exchange}`}>
                          <span>exchange</span>
                          <img src="/Exchnage_sidebar_logo.svg" alt="exchange icon" />
                        </div>
                      )}
                      {displayModules.includes('kaarigar') && (
                        <div className={`${styles.moduleBadge} ${styles.kaarigar}`}>
                          <span>kaarigar</span>
                          <img src="/kaarigar_logo.png" alt="kaarigar icon" style={{ filter: 'brightness(0) invert(1)' }} />
                        </div>
                      )}
                      {displayModules.includes('academy') && (
                        <div className={`${styles.moduleBadge} ${styles.academy}`}>
                          <span>academy</span>
                          <img src="/Academy_logo.svg" alt="academy icon" style={{ filter: 'brightness(0) invert(1)' }} />
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </>
          )}

          {/* Timeline heading and nodes based on role */}
          {(() => {
            const isMechanicOrKaarigar = user.role.toLowerCase().includes('mechanic') || user.role.toLowerCase().includes('kaarigar');
            const heading = isMechanicOrKaarigar ? 'Detailed Journey' : 'Activity Details';
            
            // Mechanic detailed journey mock timeline items
            const mechanicJourney = [
              { id: 'mj1', title: 'Instant Booking Assigned', status: 'Completed', date: '15th Jan 2025, 10:20 AM', icon: 'SM' },
              { id: 'mj2', title: 'Quote Submitted', status: 'Not Selected', date: '15th Jan 2025, 10:20 AM', icon: 'N' },
              { id: 'mj3', title: 'Instant Booking Assigned', status: 'Completed', date: '15th Jan 2025, 10:20 AM', icon: 'SM' }
            ];

            const customerActivity = [
              { id: 'ca1', title: 'Instant Booking Requested', status: 'Completed', date: '15th Jan 2025, 10:20 AM', icon: 'N' },
              { id: 'ca2', title: 'Instant Booking Requested', status: 'Cancelled', date: '15th Jan 2025, 10:20 AM', icon: 'N' }
            ];

            const timelineItems = isMechanicOrKaarigar 
              ? (user.activities && user.activities.length > 0 ? user.activities : mechanicJourney)
              : (user.activities && user.activities.length > 0 ? user.activities : customerActivity);

            return (
              <>
                <h2 className={styles.cardTitle} style={{ marginTop: '1rem', borderBottom: 'none', paddingBottom: '0.5rem' }}>{heading}</h2>
                <div className={styles.timelineWrapper}>
                  <div className={styles.timelineTopLine}></div>
                  <div className={styles.timeline}>
                    {timelineItems.length > 0 ? (
                      timelineItems.map((act: any) => {
                        const isSMIcon = act.icon === 'SM';
                        
                        return (
                          <div key={act.id} className={styles.timelineItem}>
                            {isMechanicOrKaarigar ? (
                              isSMIcon ? (
                                <div className={`${styles.timelineNode} ${styles.timelineNodeBlack}`}>SM</div>
                              ) : (
                                <div className={styles.timelineNode}>N</div>
                              )
                            ) : (
                              <div className={styles.timelineNode}>N</div>
                            )}
                            <div className={styles.timelineContent}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span className={styles.timelineTitle}>{act.title}</span>
                                    <button 
                                      type="button"
                                      className={styles.timelineBtn}
                                      onClick={() => alert('Activity details are being fetched...')}
                                    >
                                      View Details <ExternalLink size={12} style={{ marginLeft: '0.25rem' }} />
                                    </button>
                                  </div>
                                  <span className={styles.timelineTime}>{act.date}</span>
                                </div>
                                <div>
                                  <span className={`${styles.timelineStatus} ${
                                    act.status === 'Completed' ? styles.statusCompleted :
                                    act.status === 'Cancelled' ? styles.statusCancelled :
                                    styles.statusNotSelected
                                  }`}>
                                    {act.status} {act.status === 'Completed' && <Check size={12} style={{ marginLeft: '0.25rem' }}/>}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem 0' }}>
                        No activities recorded.
                      </div>
                    )}
                  </div>
                  <div className={styles.timelineBottomLineContainer}>
                    <div className={styles.timelineBottomLine}></div>
                    <span className={styles.timelineFooterText}>Created- {user.joiningDate || '15th Jan 2025'}</span>
                    <div className={styles.timelineBottomLine}></div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {activeTab === 'escalations' && (
        <div className={styles.tableCard}>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '14px', height: '14px', background: '#3b82f6', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <div style={{ width: '8px', height: '2px', background: 'white' }}></div>
                      </div>
                    </div>
                  </th>
                  <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Dispute ID <span style={{ color: '#94a3b8', fontSize: '0.65rem' }}>↓↑</span></div></th>
                  <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Mechanic Name <span style={{ color: '#94a3b8', fontSize: '0.65rem' }}>↓↑</span></div></th>
                  <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Issue Type <span style={{ color: '#94a3b8', fontSize: '0.65rem' }}>↓↑</span></div></th>
                  <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Status <span style={{ color: '#94a3b8', fontSize: '0.65rem' }}>↓↑</span></div></th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {escLoading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      Loading disputes...
                    </td>
                  </tr>
                ) : escalations.length > 0 ? (
                  escalations.map((esc) => (
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
                            {esc.mechanicName !== 'N/A'
                              ? esc.mechanicName.split(' ').map((n: string) => n[0]).join('')
                              : '—'}
                          </div>
                          <span>{esc.mechanicName}</span>
                        </div>
                      </td>
                      <td>{esc.issueType}</td>
                      <td>
                        <span className={esc.status === 'Resolved' ? styles.statusResolved : styles.statusActive}>
                          {esc.rawStatus ?? esc.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionCell}>
                          <button 
                            className={styles.viewBtn}
                            onClick={() => router.push(`/support?dispute=${esc.id}`)}
                          >
                            View <ExternalLink size={12} style={{ marginLeft: '0.2rem', color: '#64748b' }} />
                          </button>
                          <button 
                            className={styles.moreBtn}
                            onClick={() => alert(`Dispute: ${esc.disputeId}\nOrder: ${esc.orderId ?? 'N/A'}\nAmount: ₹${esc.amount ?? 'N/A'}\nStatus: ${esc.rawStatus}`)}
                            aria-label="Actions"
                          >
                            <MoreVertical size={14} color="#64748b" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                      No disputes found for this user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Rows per page: </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: '#1e293b', fontWeight: 600 }}>
                10 <span style={{ fontSize: '0.65rem' }}>▼</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>
                {escalations.length > 0 ? `1-${escalations.length} of ${escalations.length}` : '0 of 0'}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', color: '#94a3b8' }}>
                <span style={{ cursor: 'pointer' }}>&lt;</span>
                <span style={{ cursor: 'pointer' }}>&gt;</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'jobs' && (
        <div className={styles.tableCard}>
          <div className={styles.subTabsContainer}>
            <button className={`${styles.subTab} ${styles.subTabActive}`}>All (1085)</button>
            <button className={styles.subTab}>Instant Smart Booking (1085)</button>
            <button className={styles.subTab}>Invite Quote(1085)</button>
            <button className={styles.subTab}>Video Call Assistance (1085)</button>
            <button className={styles.subTab}>Assisted Booking (1085)</button>
          </div>
          
          <div className={styles.filterPillsRow}>
            <span className={`${styles.filterPill} ${styles.filterPillBlack}`}>All <span className={styles.filterCross}>⊗</span></span>
            <span className={styles.filterPill}>Ongoing <span className={styles.filterPlus}>⊕</span></span>
            <span className={styles.filterPill}>Completed <span className={styles.filterPlus}>⊕</span></span>
            <span className={styles.filterPill}>Diagnosis Available <span className={styles.filterPlus}>⊕</span></span>
            <span className={styles.filterPill}>Cancelled <span className={styles.filterPlus}>⊕</span></span>
          </div>

          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', background: '#3b82f6', borderRadius: '4px' }}>
                      <div style={{ width: '8px', height: '2px', background: 'white' }}></div>
                    </div>
                  </th>
                  <th>Order <span className={styles.sortArrows}>↓↑</span></th>
                  <th>Location <span className={styles.sortArrows}>↓↑</span></th>
                  <th>Created On <span className={styles.sortArrows}>↓↑</span></th>
                  <th>Status <span className={styles.sortArrows}>↓↑</span></th>
                  <th>Feedback <span className={styles.sortArrows}>↓↑</span></th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Ongoing */}
                <tr>
                  <td style={{ textAlign: 'center' }}><input type="checkbox" className={styles.checkbox} readOnly checked={false} /></td>
                  <td>
                    <div className={styles.mechanicCell}>
                      <div className={styles.mechanicAvatar} style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=11)' }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontWeight: 600 }}>Aditya Bhargav</span>
                        <div className={styles.disputeIdBadge} style={{ width: 'fit-content' }}>
                          Request ID <Copy size={10} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>Bangalore</td>
                  <td>10:30 PM, 21 Jan' 26</td>
                  <td><span className={styles.statusOngoing}>Ongoing</span></td>
                  <td></td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.viewBtn}>View <ExternalLink size={12} style={{ marginLeft: '0.2rem', color: '#64748b' }} /></button>
                      <button className={styles.moreBtn}><MoreVertical size={14} color="#64748b" /></button>
                    </div>
                  </td>
                </tr>
                {/* Completed */}
                <tr>
                  <td style={{ textAlign: 'center' }}><input type="checkbox" className={styles.checkbox} readOnly checked={false} /></td>
                  <td>
                    <div className={styles.mechanicCell}>
                      <div className={styles.mechanicAvatar} style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=11)' }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontWeight: 600 }}>Aditya Bhargav</span>
                        <div className={styles.disputeIdBadge} style={{ width: 'fit-content' }}>
                          Request ID <Copy size={10} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>Bangalore</td>
                  <td>10:30 PM, 21 Jan' 26</td>
                  <td><span className={styles.statusCompleted}>Completed</span></td>
                  <td><span style={{ fontWeight: 600, color: '#1e293b' }}>4.5 <span style={{ color: '#f59e0b' }}>★</span></span></td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.viewBtn}>View <ExternalLink size={12} style={{ marginLeft: '0.2rem', color: '#64748b' }} /></button>
                      <button className={styles.moreBtn}><MoreVertical size={14} color="#64748b" /></button>
                    </div>
                  </td>
                </tr>
                {/* Diagnosis Available */}
                <tr>
                  <td style={{ textAlign: 'center' }}><input type="checkbox" className={styles.checkbox} readOnly checked={false} /></td>
                  <td>
                    <div className={styles.mechanicCell}>
                      <div className={styles.mechanicAvatar} style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=11)' }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontWeight: 600 }}>Aditya Bhargav</span>
                        <div className={styles.disputeIdBadge} style={{ width: 'fit-content' }}>
                          Request ID <Copy size={10} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>Bangalore</td>
                  <td>10:30 PM, 21 Jan' 26</td>
                  <td><span className={styles.statusDiagnosis}>Diagnosis Available</span></td>
                  <td></td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.viewBtn}>View <ExternalLink size={12} style={{ marginLeft: '0.2rem', color: '#64748b' }} /></button>
                      <button className={styles.moreBtn}><MoreVertical size={14} color="#64748b" /></button>
                    </div>
                  </td>
                </tr>
                {/* Cancelled */}
                <tr>
                  <td style={{ textAlign: 'center' }}><input type="checkbox" className={styles.checkbox} readOnly checked={false} /></td>
                  <td>
                    <div className={styles.mechanicCell}>
                      <div className={styles.mechanicAvatar} style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=11)' }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontWeight: 600 }}>Aditya Bhargav</span>
                        <div className={styles.disputeIdBadge} style={{ width: 'fit-content' }}>
                          Request ID <Copy size={10} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>Bangalore</td>
                  <td>10:30 PM, 21 Jan' 26</td>
                  <td><span className={styles.statusCancelled}>Cancelled</span></td>
                  <td></td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.viewBtn}>View <ExternalLink size={12} style={{ marginLeft: '0.2rem', color: '#64748b' }} /></button>
                      <button className={styles.moreBtn}><MoreVertical size={14} color="#64748b" /></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Rows per page: </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: '#1e293b', fontWeight: 600 }}>
                10 <span style={{ fontSize: '0.65rem' }}>▼</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>1-10 of 165</span>
              <div style={{ display: 'flex', gap: '0.5rem', color: '#94a3b8' }}>
                <span style={{ cursor: 'pointer' }}>&lt;</span>
                <span style={{ cursor: 'pointer' }}>&gt;</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'violations' && (
        <div className={styles.tableCard}>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', background: '#3b82f6', borderRadius: '4px' }}>
                      <div style={{ width: '8px', height: '2px', background: 'white' }}></div>
                    </div>
                  </th>
                  <th>Dispute ID <span className={styles.sortArrows}>↓↑</span></th>
                  <th>Disputee Name <span className={styles.sortArrows}>↓↑</span></th>
                  <th>Issue Type <span className={styles.sortArrows}>↓↑</span></th>
                  <th>Status <span className={styles.sortArrows}>↓↑</span></th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" className={styles.checkbox} readOnly checked={false} />
                    </td>
                    <td>
                      <div 
                        className={styles.disputeIdBadge}
                        onClick={() => handleCopy('STM834849', 'dispute')}
                      >
                        STM834849 <Copy size={10} />
                      </div>
                    </td>
                    <td>
                      <div className={styles.mechanicCell}>
                        <div className={styles.mechanicAvatar} style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=' + (i + 10) + ')', backgroundSize: 'cover', color: 'transparent', border: '2px solid #f59e0b' }}>
                          NK
                        </div>
                        <span style={{ fontWeight: 600 }}>Nishant Kumar</span>
                      </div>
                    </td>
                    <td>Service Related Issue</td>
                    <td>
                      <span className={i === 0 ? styles.statusResolved : styles.statusActive}>
                        {i === 0 ? 'Resolved' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionCell}>
                        <button 
                          className={styles.viewBtn}
                          onClick={() => alert(`Viewing ticket details: STM834849`)}
                        >
                          View <ExternalLink size={12} style={{ marginLeft: '0.2rem', color: '#64748b' }} />
                        </button>
                        <button 
                          className={styles.moreBtn}
                          onClick={() => alert('Actions: Escalate, Close')}
                          aria-label="Actions"
                        >
                          <MoreVertical size={14} color="#64748b" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Rows per page: </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: '#1e293b', fontWeight: 600 }}>
                10 <span style={{ fontSize: '0.65rem' }}>▼</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>1-10 of 165</span>
              <div style={{ display: 'flex', gap: '0.5rem', color: '#94a3b8' }}>
                <span style={{ cursor: 'pointer' }}>&lt;</span>
                <span style={{ cursor: 'pointer' }}>&gt;</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
