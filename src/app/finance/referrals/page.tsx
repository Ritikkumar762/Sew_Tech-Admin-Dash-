'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  Gift
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import styles from '../finance.module.css';

interface ReferralItem {
  id: string;
  referrerName: string;
  referredName: string;
  referralCode: string;
  dateJoined: string;
  status: 'Completed' | 'Pending' | 'Reward Credited';
  rewardAmount: number;
}

const INITIAL_REFERRALS: ReferralItem[] = [
  {
    id: 'r1',
    referrerName: 'Anil Sharma',
    referredName: 'Vikram Singh',
    referralCode: 'ANIL982',
    dateJoined: "22 Jan '26",
    status: 'Reward Credited',
    rewardAmount: 150
  },
  {
    id: 'r2',
    referrerName: 'Mohit Gupta',
    referredName: 'Sanjay Dutt',
    referralCode: 'MOHIT55',
    dateJoined: "24 Jan '26",
    status: 'Pending',
    rewardAmount: 150
  },
  {
    id: 'r3',
    referrerName: 'Kunal Sen',
    referredName: 'Ramesh Kumar',
    referralCode: 'KUNAL10',
    dateJoined: "25 Jan '26",
    status: 'Completed',
    rewardAmount: 150
  },
  {
    id: 'r4',
    referrerName: 'Rahul Verma',
    referredName: 'Preeti Sharma',
    referralCode: 'RAHUL89',
    dateJoined: "26 Jan '26",
    status: 'Reward Credited',
    rewardAmount: 150
  }
];

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralItem[]>(INITIAL_REFERRALS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReferrals = useMemo(() => {
    return referrals.filter((r) => 
      r.referrerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referredName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referralCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [referrals, searchQuery]);

  return (
    <div className={styles.container}>
      <PageHeader 
        title="Referrals" 
        subtitle="Finance • Referrals" 
        actions={
          <button className="btn btn-dark" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Export</span>
            <Download size={15} />
          </button>
        } 
      />

      {/* Summary Stats bar */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Referred Signups</div>
          <div className={styles.statValue}>{referrals.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Rewards Credited</div>
          <div className={styles.statValue}>
            ₹{referrals.filter(r => r.status === 'Reward Credited').reduce((sum, r) => sum + r.rewardAmount, 0)}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Referral Loops</div>
          <div className={styles.statValue}>
            {referrals.filter(r => r.status === 'Pending').length}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Reward Value per Referral</div>
          <div className={styles.statValue}>₹150</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchInputWrapper} style={{ maxWidth: '400px' }}>
          <Search className={styles.searchIcon} size={16} />
          <input 
            type="text" 
            placeholder="Search by Referrer, Referred Name or Code..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Referrals List Table */}
      <div className={styles.tableContainer}>
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>Referrer Name</th>
              <th>Referred Customer</th>
              <th>Referral Code</th>
              <th>Date Joined</th>
              <th>Reward Amount</th>
              <th>Referral Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReferrals.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No referrals found matching your search.
                </td>
              </tr>
            ) : (
              filteredReferrals.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>
                      {r.referrerName}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500, color: '#475569' }}>
                      {r.referredName}
                    </span>
                  </td>
                  <td>
                    <span className={styles.dashedBadge}>
                      {r.referralCode}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>{r.dateJoined}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#111827' }}>
                      ₹{r.rewardAmount}
                    </span>
                  </td>
                  <td>
                    {r.status === 'Reward Credited' && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        <Gift size={12} />
                        Reward Credited
                      </span>
                    )}
                    {r.status === 'Completed' && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#bfdbfe',
                        color: '#1e3a8a',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        <CheckCircle2 size={12} />
                        Completed
                      </span>
                    )}
                    {r.status === 'Pending' && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        <Clock size={12} />
                        Pending verification
                      </span>
                    )}
                  </td>
                  <td>
                    <button 
                      className={styles.btnRowAction}
                      onClick={() => alert(`Referral Loop Details:\nReferrer: ${r.referrerName}\nReferred: ${r.referredName}\nReward Amount: ₹${r.rewardAmount}`)}
                    >
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
