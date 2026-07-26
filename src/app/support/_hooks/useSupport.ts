'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiClient, ENDPOINTS } from '@/lib';

// ── Types ────────────────────────────────────────────────────────────────────
export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  raisedBy: string;
  userId: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  slaStatus: string;
  isBreached: boolean;
  assignedTo?: string;
}

export interface Dispute {
  id: string;
  disputeNumber: string;
  raisedByName: string;
  raisedByType: string;
  customerPhone?: string;
  date: string;
  disputeId: string;
  relatedEntity: string;
  issueType: string;
  status: 'Active' | 'Resolved' | 'Closed';
  disputeType?: string;
  amount?: number;
}

export interface SupportAnalytics {
  open_tickets: number;
  new_tickets_today: number;
  high_severity_issues: number;
  repeat_offenders: number;
  avg_resolution_days: string;
  active_disputes_count: number;
  resolved_disputes_count: number;
  total_refunded_amount: number;
}

// ── Mappers ──────────────────────────────────────────────────────────────────
function mapTicket(item: any): SupportTicket {
  return {
    id:           String(item.id ?? item.ticket_number),
    ticketNumber: item.ticket_number ?? `TKT-${item.id}`,
    subject:      item.subject ?? item.title ?? 'Support Request',
    raisedBy:     item.user_name ?? item.customer_name ?? (item.user_id ? `User #${item.user_id}` : 'Customer'),
    userId:       String(item.user_id ?? ''),
    status:       item.status ?? 'Open',
    priority:     item.priority ?? 'Medium',
    category:     item.category ?? 'General',
    createdAt:    item.created_at
      ? new Date(item.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    slaStatus:    item.sla_status ?? 'Within SLA',
    isBreached:   item.is_breached ?? false,
    assignedTo:   item.assigned_to ?? undefined,
  };
}

function mapDispute(item: any): Dispute {
  const terminal = ['Rejected', 'Refund Completed', 'Closed'];
  const statusDisplay: Dispute['status'] =
    terminal.includes(item.status) ? 'Resolved'
    : item.status === 'Closed'     ? 'Closed'
    : 'Active';

  return {
    id:            String(item.id ?? item.dispute_number),
    disputeNumber: item.dispute_number ?? `DISP-${item.id}`,
    raisedByName:  item.raisedByName ?? (item.customer_id ? `User #${item.customer_id}` : 'Customer'),
    raisedByType:  item.raisedByType ?? (item.dispute_type === 'mechanics' ? 'Mechanic' : 'Customer'),
    customerPhone: item.customerPhone ?? undefined,
    date:          item.created_at
      ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
      : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
    disputeId:     item.dispute_number ?? item.disputeId ?? `DISP-${item.id}`,
    relatedEntity: item.order_id ? `Order #${item.order_id}` : 'N/A',
    issueType:     item.reason ?? item.issueType ?? 'General',
    status:        statusDisplay,
    disputeType:   item.dispute_type ?? 'spares',
    amount:        item.amount ?? undefined,
  };
}

// ── Tickets Hook ──────────────────────────────────────────────────────────────
export function useTickets({
  page = 1, pageSize = 10, search = '', status = '', category = '', priority = '',
} = {}) {
  const [tickets,    setTickets]    = useState<SupportTicket[]>([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (search)   qs.set('search',   search);
      if (status)   qs.set('status',   status);
      if (category) qs.set('category', category);
      if (priority) qs.set('priority', priority);

      const res = await apiClient.get<{ success: boolean; data: any }>(
        `${ENDPOINTS.support.tickets}?${qs}`
      );
      if (res?.success && res.data) {
        const items = Array.isArray(res.data) ? res.data : (res.data.items ?? []);
        setTickets(items.map(mapTicket));
        setTotal(res.data.total ?? items.length);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, status, category, priority]);

  const assignTicket = useCallback(async (id: string, assignedTo: string) => {
    await apiClient.post(ENDPOINTS.support.assign(id), { assigned_to: assignedTo });
    await fetchTickets();
  }, [fetchTickets]);

  const changeStatus = useCallback(async (id: string, newStatus: string, reason?: string) => {
    await apiClient.patch(ENDPOINTS.support.status(id), { status: newStatus, reason });
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  }, []);

  const changePriority = useCallback(async (id: string, priority: string) => {
    await apiClient.patch(ENDPOINTS.support.priority(id), { priority });
    setTickets(prev => prev.map(t => t.id === id ? { ...t, priority } : t));
  }, []);

  const closeTicket = useCallback(async (id: string) => {
    await apiClient.post(ENDPOINTS.support.close(id), {});
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Closed' } : t));
  }, []);

  const reopenTicket = useCallback(async (id: string) => {
    await apiClient.post(ENDPOINTS.support.reopen(id), {});
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Reopened' } : t));
  }, []);

  const addReply = useCallback(async (id: string, message: string, internalNote = false) => {
    await apiClient.post(ENDPOINTS.support.reply(id), { message, internal_note: internalNote });
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  return {
    tickets, total, loading, error,
    refetch: fetchTickets,
    assignTicket, changeStatus, changePriority,
    closeTicket, reopenTicket, addReply,
  };
}

// ── Disputes Hook ─────────────────────────────────────────────────────────────
export function useDisputes({
  page = 1, pageSize = 10, search = '', disputeType = '', status = '',
} = {}) {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const fetchDisputes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (search)      qs.set('search',       search);
      if (disputeType) qs.set('dispute_type', disputeType);
      if (status)      qs.set('status',       status);

      const res = await apiClient.get<{ success: boolean; data: any }>(
        `${ENDPOINTS.support.disputes}?${qs}`
      );
      if (res?.success && res.data) {
        const items = Array.isArray(res.data) ? res.data : (res.data.items ?? []);
        setDisputes(items.map(mapDispute));
        setTotal(res.data.total ?? items.length);
      } else {
        setDisputes([]);
        setTotal(0);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to fetch disputes');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, disputeType, status]);

  const executeAction = useCallback(async (id: string, action: string) => {
    await apiClient.post(ENDPOINTS.support.disputeAction(id), { action });
    await fetchDisputes();
  }, [fetchDisputes]);

  const cancelDispute = useCallback(async (id: string) => {
    await apiClient.post(ENDPOINTS.support.disputeCancel(id), {});
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'Closed' } : d));
  }, []);

  const initiateRefund = useCallback(async (
    id: string, amount: number, refundChannel = 'WALLET', refundType = 'FULL'
  ) => {
    await apiClient.post(ENDPOINTS.support.disputeRefundInitiate(id), {
      amount, refund_channel: refundChannel, refund_type: refundType,
    });
    await fetchDisputes();
  }, [fetchDisputes]);

  useEffect(() => { fetchDisputes(); }, [fetchDisputes]);

  return {
    disputes, total, loading, error,
    refetch: fetchDisputes,
    executeAction, cancelDispute, initiateRefund,
  };
}

// ── Analytics Hook ────────────────────────────────────────────────────────────
export function useSupportAnalytics() {
  const [metrics, setMetrics] = useState<SupportAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ success: boolean; data: SupportAnalytics }>(
        ENDPOINTS.support.analyticsDashboard
      );
      if (res?.success && res.data) {
        setMetrics(res.data);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}

// ── Legacy hook (backward compat for existing support/page.tsx) ───────────────
export function useSupport() {
  const { tickets, loading, error, refetch } = useTickets();
  return { tickets, loading, error, refetch };
}
