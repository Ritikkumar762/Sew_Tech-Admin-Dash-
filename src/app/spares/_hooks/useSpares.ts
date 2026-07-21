'use client';
import { useState, useEffect, useCallback } from 'react';
import { Spare, Order } from '@/types';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export function useSpares() {
  const [spares, setSpares] = useState<Spare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpares = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>(`${ENDPOINTS.spares.inventory}?skip=0&limit=100`);
      let items: any[] = [];
      if (res?.items && Array.isArray(res.items)) items = res.items;
      else if (res?.data?.items && Array.isArray(res.data.items)) items = res.data.items;
      else if (res?.data && Array.isArray(res.data)) items = res.data;
      else if (Array.isArray(res)) items = res;

      const mapped: Spare[] = items.map((item: any) => {
        const variants = item.variants || [];
        const totalStock = variants.length > 0
          ? variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0)
          : Number(item.stock_quantity || 0);

        let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
        if (totalStock === 0) status = 'Out of Stock';
        else if (totalStock < 15) status = 'Low Stock';

        return {
          id: String(item.product_id || item.id),
          name: item.name || 'Spare Item',
          sku: item.sku || '',
          category: typeof item.category === 'object' ? item.category?.name : (item.category || 'General'),
          stock: totalStock,
          price: Number(item.price || 0),
          status: status
        };
      });
      setSpares(mapped);
    } catch (err) {
      console.error('Failed to load spares', err);
      setError('Failed to load spares.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSpares(); }, [fetchSpares]);
  return { spares, loading, error, refetch: fetchSpares };
}

export function useSparesOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>(ENDPOINTS.spares.orders);
      let items: any[] = [];
      if (res?.items && Array.isArray(res.items)) items = res.items;
      else if (res?.orders && Array.isArray(res.orders)) items = res.orders;
      else if (Array.isArray(res)) items = res;

      setOrders(items.map((o: any) => ({
        id: String(o.order_id || o.id),
        customerId: String(o.user_id || o.customer_id || ''),
        customerName: o.customer_name || o.user_name || 'Customer',
        amount: Number(o.total_amount || o.amount || 0),
        status: o.status || 'Pending',
        createdAt: o.created_at || new Date().toISOString(),
        items: o.items ? o.items.length : 1
      })));
    } catch {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  return { orders, loading, error, refetch: fetchOrders };
}

