'use client';
import { useState, useEffect, useCallback } from 'react';
import { Spare, Order } from '@/types';

// ─── Mock Data ─── Replace with real API calls ───────────────────
const MOCK_SPARES: Spare[] = [
  { id: 's1', name: 'Motor Brush Set', sku: 'SKU-101', category: 'Motor Parts', stock: 45, price: 350, status: 'In Stock' },
  { id: 's2', name: 'Needle Plate (Universal)', sku: 'SKU-102', category: 'Needle Parts', stock: 4, price: 180, status: 'Low Stock' },
  { id: 's3', name: 'Bobbin Case Assembly', sku: 'SKU-103', category: 'Bobbin', stock: 0, price: 220, status: 'Out of Stock' },
  { id: 's4', name: 'Presser Foot - Zipper', sku: 'SKU-104', category: 'Presser Foot', stock: 30, price: 95, status: 'In Stock' },
  { id: 's5', name: 'Feed Dog Mechanism', sku: 'SKU-105', category: 'Feed System', stock: 12, price: 560, status: 'In Stock' },
  { id: 's6', name: 'Tension Spring Kit', sku: 'SKU-106', category: 'Springs', stock: 8, price: 75, status: 'Low Stock' },
];

const MOCK_ORDERS: Order[] = [
  { id: 'o1', customerId: 'c1', customerName: 'Rahul Sharma', amount: 1250, status: 'Delivered', createdAt: '2026-06-01', items: 3 },
  { id: 'o2', customerId: 'c2', customerName: 'Priya Singh', amount: 440, status: 'Shipped', createdAt: '2026-06-05', items: 2 },
  { id: 'o3', customerId: 'c3', customerName: 'Arjun Patel', amount: 3100, status: 'Confirmed', createdAt: '2026-06-08', items: 5 },
  { id: 'o4', customerId: 'c4', customerName: 'Sneha Verma', amount: 920, status: 'Returned', createdAt: '2026-06-02', items: 4 },
  { id: 'o5', customerId: 'c5', customerName: 'Kiran Mehta', amount: 670, status: 'Cancelled', createdAt: '2026-06-07', items: 1 },
];
// ──────────────────────────────────────────────────────────────────

export function useSpares() {
  const [spares, setSpares] = useState<Spare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpares = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: const res = await fetch('/api/spares'); const json = await res.json(); setSpares(json.data);
      await new Promise((r) => setTimeout(r, 400));
      setSpares(MOCK_SPARES);
    } catch {
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
      // TODO: const res = await fetch('/api/spares/orders'); const json = await res.json(); setOrders(json.data);
      await new Promise((r) => setTimeout(r, 400));
      setOrders(MOCK_ORDERS);
    } catch {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  return { orders, loading, error, refetch: fetchOrders };
}
