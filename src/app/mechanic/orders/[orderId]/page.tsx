import OrderDetailView from '@/components/orders/OrderDetailView';

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  return <OrderDetailView orderId={orderId} />;
}
