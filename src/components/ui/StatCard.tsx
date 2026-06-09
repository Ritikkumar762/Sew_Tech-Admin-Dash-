import { ReactNode } from 'react';
import styles from './StatCard.module.css';

type Props = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
};

export default function StatCard({ label, value, icon, trend, trendUp }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{icon}{label}</div>
      <div className={styles.value}>{value}</div>
      {trend && (
        <div className={`${styles.trend} ${trendUp ? styles.up : styles.down}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      )}
    </div>
  );
}
