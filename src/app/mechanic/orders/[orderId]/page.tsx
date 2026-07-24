'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import OrderDetailView from '@/components/orders/OrderDetailView';

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading order details...</div>}>
      <OrderDetailView orderId={orderId} />
    </Suspense>
  );
}


