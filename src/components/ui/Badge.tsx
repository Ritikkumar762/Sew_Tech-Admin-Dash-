import styles from './Badge.module.css';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const variantMap: Record<string, Variant> = {
  // Status
  Active: 'success', Available: 'success', Published: 'success', Completed: 'success', Resolved: 'success',
  Inactive: 'neutral', Offline: 'neutral', Archived: 'neutral', Closed: 'neutral', Draft: 'neutral',
  Suspended: 'danger', 'Out of Stock': 'danger', Failed: 'danger', Cancelled: 'danger', Returned: 'danger', Critical: 'danger',
  Busy: 'warning', 'Low Stock': 'warning', Pending: 'warning', High: 'warning', 'In Progress': 'warning',
  'In Stock': 'success', Confirmed: 'info', Packed: 'info', Shipped: 'info', 'Out for Delivery': 'info',
  Low: 'neutral', Medium: 'warning', Open: 'info',
};

export default function Badge({ label }: { label: string }) {
  const variant: Variant = variantMap[label] ?? 'neutral';
  return <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>;
}
