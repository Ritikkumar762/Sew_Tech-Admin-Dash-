'use client';

import { useParams } from 'next/navigation';
import OrderDetailView from '@/components/orders/OrderDetailView';

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  return <OrderDetailView orderId={orderId} />;
}

