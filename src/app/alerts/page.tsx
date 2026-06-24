'use client';
import { useState, useMemo } from 'react';
import { useAlerts } from './_hooks/useAlerts';
import { useRouter } from 'next/navigation';
import { AlertCircle, TriangleAlert, ChevronRight, Plus, X } from 'lucide-react';
import styles from './alerts.module.css';
import { ENDPOINTS } from '@/lib/endpoints';
import { Alert } from '@/types';

// ── Add Alert Modal ───────────────────────────────────────────────
type FormData = {
  title: string;
  message: string;
  type: Alert['type'];
  module: Alert['module'];
};

const EMPTY_FORM: FormData = { title: '', message: '', type: 'info', module: 'Other' };

function AddAlertModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(ENDPOINTS.alerts.list, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      onCreated(); // trigger refetch on parent
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create alert.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add New Alert</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* Title */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="alert-title">Title <span className={styles.required}>*</span></label>
            <input
              id="alert-title"
              className={styles.fieldInput}
              type="text"
              placeholder="e.g. Stock-out Industrial Sewing Needle"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>

          {/* Message */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="alert-message">Message <span className={styles.required}>*</span></label>
            <textarea
              id="alert-message"
              className={styles.fieldTextarea}
              placeholder="e.g. SKU-102 stock is at 0."
              rows={3}
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              required
            />
          </div>

          {/* Type + Module side by side */}
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="alert-type">Type <span className={styles.required}>*</span></label>
              <select
                id="alert-type"
                className={styles.fieldSelect}
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Alert['type'] }))}
              >
                <option value="error">Error (High Priority)</option>
                <option value="warning">Warning (Medium Priority)</option>
                <option value="info">Info (Low Priority)</option>
                <option value="success">Success (Low Priority)</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="alert-module">Module <span className={styles.required}>*</span></label>
              <select
                id="alert-module"
                className={styles.fieldSelect}
                value={form.module}
                onChange={(e) => setForm((p) => ({ ...p, module: e.target.value as Alert['module'] }))}
              >
                <option value="ST Spares">ST Spares</option>
                <option value="ST Mechanics">ST Mechanics</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {submitError && <p className={styles.formError}>{submitError}</p>}

          {/* Actions */}
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const { alerts, loading, error, markRead, refetch } = useAlerts();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'All' | 'ST Spares' | 'ST Mechanics'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Backend easily integratable filtering
  const filteredAlerts = useMemo(() => {
    if (activeTab === 'All') return alerts;
    return alerts.filter(a => a.module === activeTab);
  }, [alerts, activeTab]);

  // Priority bucketing
  const highPriority = filteredAlerts.filter(a => a.type === 'error');
  const mediumPriority = filteredAlerts.filter(a => a.type === 'warning');
  const lowPriority = filteredAlerts.filter(a => a.type === 'info' || a.type === 'success');

  const formatTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days ago` : 'Today';
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.pageTitle}>Alerts</h1>
          <div className={styles.breadcrumbs}>
            Alerts • <span>All Alerts</span>
          </div>
        </div>

        {/* Right side: Add button + Tabs */}
        <div className={styles.headerRight}>
          <button
            id="add-alert-btn"
            className={styles.addBtn}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            Add Alert
          </button>

          <div className={styles.tabsContainer}>
            {(['All', 'ST Spares', 'ST Mechanics'] as const).map(tab => (
              <button
                key={tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <p>Loading alerts...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}

      {!loading && !error && (
        <div className={styles.board}>
          {/* High Priority */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>High Priority</div>
            {highPriority.map(alert => (
              <div key={alert.id} className={`${styles.alertCard} ${styles.highPriority}`}>
                <div className={styles.cardLeft}>
                  <div className={styles.iconWrapper}>
                    <img src="/badge-alert.svg" alt="Alert" style={{ width: '16.36px', height: '16.36px', display: 'block' }} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTitle}>{alert.title}</div>
                    <div className={styles.cardTime}>{formatTime(alert.createdAt)}</div>
                  </div>
                </div>
                <button className={`${styles.actionBtn} ${styles.highBtn}`} onClick={() => {
                  markRead(alert.id);
                  router.push(`/alerts/${alert.id}`);
                }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Medium Priority */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>Medium Priority</div>
            {mediumPriority.map(alert => (
              <div key={alert.id} className={`${styles.alertCard} ${styles.mediumPriority}`}>
                <div className={styles.cardLeft}>
                  <div className={styles.iconWrapper}>
                    <img src="/alert-02.svg" alt="Warning" style={{ width: '16.36px', height: '16.36px', display: 'block' }} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTitle}>{alert.title}</div>
                    <div className={styles.cardTime}>{formatTime(alert.createdAt)}</div>
                  </div>
                </div>
                <button className={`${styles.actionBtn} ${styles.mediumBtn}`} onClick={() => {
                  markRead(alert.id);
                  router.push(`/alerts/${alert.id}`);
                }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Low Priority */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>Low Priority</div>
            {lowPriority.map(alert => (
              <div key={alert.id} className={`${styles.alertCard} ${styles.lowPriority}`}>
                <div className={styles.cardLeft}>
                  <div className={styles.iconWrapper}>
                    <img src="/alert-blue.svg" alt="Info" style={{ width: '16.36px', height: '16.36px', display: 'block' }} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTitle}>{alert.title}</div>
                    <div className={styles.cardTime}>{formatTime(alert.createdAt)}</div>
                  </div>
                </div>
                <button className={`${styles.actionBtn} ${styles.lowBtn}`} onClick={() => {
                  markRead(alert.id);
                  router.push(`/alerts/${alert.id}`);
                }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Alert Modal */}
      {showAddModal && (
        <AddAlertModal
          onClose={() => setShowAddModal(false)}
          onCreated={() => { refetch(); }}
        />
      )}
    </div>
  );
}
