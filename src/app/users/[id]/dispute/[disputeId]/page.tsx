'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import styles from './page.module.css';

export default function DisputeDetailsPage() {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = () => {
    navigator.clipboard.writeText('STM834849');
    setCopiedId('STM834849');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <div className={styles.profileInfo}>
          <button 
            type="button" 
            className={styles.backArrow}
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className={styles.profileTitleArea}>
            <span className={styles.profileName}>Rajdhani Exports Pvt. Ltd.</span>
            <div 
              className={`${styles.copyIdBadge} ${copiedId ? styles.copySuccess : ''}`}
              onClick={handleCopyId}
            >
              {copiedId ? (
                <>Copied! <Check size={12} /></>
              ) : (
                <>Dispute ID <Copy size={12} /></>
              )}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.refundBtn}>Refund</button>
          <button type="button" className={styles.resolveBtn}>Resolve</button>
        </div>
      </div>

      <div className={styles.headerCard} style={{ marginTop: '-1rem', borderTop: 'none', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
        <div className={styles.topInfoRow}>
          <div className={styles.infoCol}>
            <span className={styles.infoLabel}>Email ID:</span>
            <span className={styles.infoValue}>demoemail@gmail.com</span>
          </div>
          <div className={styles.infoCol}>
            <span className={styles.infoLabel}>Phone Number:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className={styles.infoValue}>+91 9876543210</span>
              <Copy size={12} style={{ color: '#2563eb', cursor: 'pointer' }} />
            </div>
          </div>
          <div className={styles.infoCol} style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <span className={styles.infoLabel}>Status:</span>
            <span className={styles.statusActive}>Active</span>
          </div>
        </div>
      </div>

      <div className={styles.detailCard}>
        <h2 className={styles.sectionTitle}>Reported Issue</h2>
        <div style={{ marginTop: '1rem' }}>
          <span className={styles.infoLabel} style={{ marginBottom: '0.5rem', display: 'block' }}>Issue Description:</span>
          <p className={styles.descriptionText}>
            had booked a service for my sewing machine because it was skipping stitches and making noise. The mechanic visited and serviced the machine, but the issue is still not resolved. The machine continues to skip stitches while sewing and the thread keeps breaking. I request a recheck or proper repair of the machine.
          </p>
        </div>
      </div>

      <div className={styles.detailCard}>
        <h2 className={styles.sectionTitle}>Service Details</h2>
        <div className={styles.serviceStrip}>
          Service : Instant Smart Booking
        </div>
        <div className={styles.serviceGrid}>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span className={styles.infoLabel} style={{ marginBottom: '0.25rem', display: 'block' }}>Selected Date & Time:</span>
              <span className={styles.infoValue}>28.02.2026 | 01:00-02:00 PM</span>
            </div>
            <div>
              <span className={styles.infoLabel} style={{ marginBottom: '0.25rem', display: 'block' }}>Language Preference:</span>
              <span className={styles.infoValue}>Hindi</span>
            </div>
          </div>
          <div>
            <span className={styles.infoLabel} style={{ marginBottom: '0.25rem', display: 'block' }}>Address</span>
            <div className={styles.addressBox}>
              123, MG Road<br />
              Connaught Place<br />
              New Delhi - 110001<br />
              DELHI, INDIA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
