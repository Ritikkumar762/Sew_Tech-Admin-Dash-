'use client';

import { useState, useMemo, useCallback } from 'react';

export interface TransactionItem {
  id: string;
  counterpartyName: string;
  counterpartyId: string;
  counterpartyAvatar?: string;
  module: 'mechanic' | 'spares';
  transactionId: string;
  relatedEntity: string;
  relatedEntityId: string;
  amount: number;
  type: 'credit' | 'debit';
  counterpartyType: 'mechanic' | 'customer';
  date: string;
  dateObj: Date;
  status: 'Completed' | 'Failed' | 'Pending';
  goldMember: boolean;
  couponUsed: boolean;
  firstTimeUser: boolean;
}

const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 't1',
    counterpartyName: 'Rajdhani Exports Pvt. Ltd.',
    counterpartyId: 'CUST-89102',
    module: 'mechanic',
    transactionId: 'TXN456213178',
    relatedEntity: 'Booking ID',
    relatedEntityId: 'BKG-88129',
    amount: 12000,
    type: 'credit',
    counterpartyType: 'customer',
    date: "01:20 PM, 21 Jan '26",
    dateObj: new Date(2026, 0, 21, 13, 20),
    status: 'Completed',
    goldMember: true,
    couponUsed: false,
    firstTimeUser: false,
  },
  {
    id: 't2',
    counterpartyName: 'Rajdhani Exports Pvt. Ltd.',
    counterpartyId: 'CUST-89102',
    module: 'spares',
    transactionId: 'TXN456213178',
    relatedEntity: 'Booking ID',
    relatedEntityId: 'BKG-88129',
    amount: 12000,
    type: 'debit',
    counterpartyType: 'customer',
    date: "01:20 PM, 21 Jan '26",
    dateObj: new Date(2026, 0, 21, 13, 20),
    status: 'Failed',
    goldMember: true,
    couponUsed: false,
    firstTimeUser: false,
  },
  {
    id: 't3',
    counterpartyName: 'Rajdhani Exports Pvt. Ltd.',
    counterpartyId: 'CUST-89102',
    module: 'spares',
    transactionId: 'TXN456213178',
    relatedEntity: 'Booking ID',
    relatedEntityId: 'BKG-88129',
    amount: 12000,
    type: 'debit',
    counterpartyType: 'customer',
    date: "01:20 PM, 21 Jan '26",
    dateObj: new Date(2026, 0, 21, 13, 20),
    status: 'Completed',
    goldMember: true,
    couponUsed: true,
    firstTimeUser: false,
  },
  {
    id: 't4',
    counterpartyName: 'Rajdhani Exports Pvt. Ltd.',
    counterpartyId: 'CUST-89102',
    module: 'spares',
    transactionId: 'TXN456213178',
    relatedEntity: 'Booking ID',
    relatedEntityId: 'BKG-88129',
    amount: 12000,
    type: 'debit',
    counterpartyType: 'customer',
    date: "01:20 PM, 21 Jan '26",
    dateObj: new Date(2026, 0, 21, 13, 20),
    status: 'Completed',
    goldMember: false,
    couponUsed: false,
    firstTimeUser: true,
  },
  {
    id: 't5',
    counterpartyName: 'Rajdhani Exports Pvt. Ltd.',
    counterpartyId: 'CUST-89102',
    module: 'spares',
    transactionId: 'TXN456213178',
    relatedEntity: 'Booking ID',
    relatedEntityId: 'BKG-88129',
    amount: 12000,
    type: 'debit',
    counterpartyType: 'customer',
    date: "01:20 PM, 21 Jan '26",
    dateObj: new Date(2026, 0, 21, 13, 20),
    status: 'Completed',
    goldMember: false,
    couponUsed: false,
    firstTimeUser: false,
  },
  {
    id: 't6',
    counterpartyName: 'Rajdhani Exports Pvt. Ltd.',
    counterpartyId: 'CUST-89102',
    module: 'mechanic',
    transactionId: 'TXN456213178',
    relatedEntity: 'Booking ID',
    relatedEntityId: 'BKG-88129',
    amount: 12000,
    type: 'credit',
    counterpartyType: 'mechanic',
    date: "01:20 PM, 21 Jan '26",
    dateObj: new Date(2026, 0, 21, 13, 20),
    status: 'Completed',
    goldMember: true,
    couponUsed: false,
    firstTimeUser: false,
  },
  {
    id: 't7',
    counterpartyName: 'Rajdhani Exports Pvt. Ltd.',
    counterpartyId: 'CUST-89102',
    module: 'mechanic',
    transactionId: 'TXN456213178',
    relatedEntity: 'Booking ID',
    relatedEntityId: 'BKG-88129',
    amount: 12000,
    type: 'credit',
    counterpartyType: 'mechanic',
    date: "01:20 PM, 21 Jan '26",
    dateObj: new Date(2026, 0, 21, 13, 20),
    status: 'Completed',
    goldMember: false,
    couponUsed: false,
    firstTimeUser: false,
  },
  {
    id: 't8',
    counterpartyName: 'Sharma Auto Parts',
    counterpartyId: 'CUST-32984',
    module: 'spares',
    transactionId: 'TXN456213180',
    relatedEntity: 'Booking ID',
    relatedEntityId: 'BKG-88131',
    amount: 4500,
    type: 'debit',
    counterpartyType: 'customer',
    date: "03:45 PM, 22 Jan '26",
    dateObj: new Date(2026, 0, 22, 15, 45),
    status: 'Completed',
    goldMember: false,
    couponUsed: true,
    firstTimeUser: false,
  },
  {
    id: 't9',
    counterpartyName: 'Amit Wrench Master',
    counterpartyId: 'CUST-10492',
    module: 'mechanic',
    transactionId: 'TXN456213185',
    relatedEntity: 'Booking ID',
    relatedEntityId: 'BKG-88140',
    amount: 8500,
    type: 'credit',
    counterpartyType: 'mechanic',
    date: "11:15 AM, 25 Jan '26",
    dateObj: new Date(2026, 0, 25, 11, 15),
    status: 'Pending',
    goldMember: true,
    couponUsed: false,
    firstTimeUser: false,
  }
];

export interface FilterState {
  status: { Completed: boolean; Pending: boolean; Failed: boolean };
  type: { Credit: boolean; Debit: boolean; Refund: boolean };
  counterpartyType: { Mechanic: boolean; Customer: boolean };
  module: { mechanic: boolean; spares: boolean };
  amountRange: { min: string; max: string };
  advanced: { goldMember: boolean; couponUsed: boolean; firstTimeUser: boolean };
  createdOn: string;
  customDateStart: string;
  customDateEnd: string;
}

export function useFinanceTransactions() {
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreatedOn, setSelectedCreatedOn] = useState('');
  
  const [filters, setFilters] = useState<FilterState>({
    status: { Completed: false, Pending: false, Failed: false },
    type: { Credit: false, Debit: false, Refund: false },
    counterpartyType: { Mechanic: false, Customer: false },
    module: { mechanic: false, spares: false },
    amountRange: { min: '', max: '' },
    advanced: { goldMember: false, couponUsed: false, firstTimeUser: false },
    createdOn: '',
    customDateStart: '',
    customDateEnd: ''
  });

  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const toggleSelectRow = useCallback((id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((filteredIds: string[]) => {
    setSelectedRowIds((prev) => {
      const allSelected = filteredIds.every(id => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        filteredIds.forEach(id => next.delete(id));
      } else {
        filteredIds.forEach(id => next.add(id));
      }
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      status: { Completed: false, Pending: false, Failed: false },
      type: { Credit: false, Debit: false, Refund: false },
      counterpartyType: { Mechanic: false, Customer: false },
      module: { mechanic: false, spares: false },
      amountRange: { min: '', max: '' },
      advanced: { goldMember: false, couponUsed: false, firstTimeUser: false },
      createdOn: '',
      customDateStart: '',
      customDateEnd: ''
    });
    setSelectedCreatedOn('');
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = t.counterpartyName.toLowerCase().includes(query);
        const matchesId = t.transactionId.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }

      const statusActive = Object.values(filters.status).some(Boolean);
      if (statusActive) {
        const statusMap: Record<string, boolean> = {
          Completed: filters.status.Completed,
          Pending: filters.status.Pending,
          Failed: filters.status.Failed,
        };
        if (!statusMap[t.status]) return false;
      }

      const typeActive = Object.values(filters.type).some(Boolean);
      if (typeActive) {
        const typeMap: Record<string, boolean> = {
          Credit: filters.type.Credit,
          Debit: filters.type.Debit,
          Refund: filters.type.Refund,
        };
        const mappedType = t.type === 'credit' ? 'Credit' : 'Debit';
        if (!typeMap[mappedType]) return false;
      }

      const cpActive = Object.values(filters.counterpartyType).some(Boolean);
      if (cpActive) {
        const cpMap: Record<string, boolean> = {
          Mechanic: filters.counterpartyType.Mechanic,
          Customer: filters.counterpartyType.Customer,
        };
        const mappedCp = t.counterpartyType === 'mechanic' ? 'Mechanic' : 'Customer';
        if (!cpMap[mappedCp]) return false;
      }

      const moduleActive = Object.values(filters.module).some(Boolean);
      if (moduleActive) {
        if (!filters.module[t.module]) return false;
      }

      if (filters.amountRange.min) {
        if (t.amount < parseFloat(filters.amountRange.min)) return false;
      }
      if (filters.amountRange.max) {
        if (t.amount > parseFloat(filters.amountRange.max)) return false;
      }

      if (filters.advanced.goldMember && !t.goldMember) return false;
      if (filters.advanced.couponUsed && !t.couponUsed) return false;
      if (filters.advanced.firstTimeUser && !t.firstTimeUser) return false;

      const dateOption = filters.createdOn || selectedCreatedOn;
      if (dateOption && dateOption !== 'custom') {
        const now = new Date(2026, 5, 13);
        const diffTime = Math.abs(now.getTime() - t.dateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (dateOption === '7days' && diffDays > 7) return false;
        if (dateOption === '14days' && diffDays > 14) return false;
        if (dateOption === '30days' && diffDays > 30) return false;
        if (dateOption === '6months' && diffDays > 180) return false;
      } else if (dateOption === 'custom' && (filters.customDateStart || filters.customDateEnd)) {
        if (filters.customDateStart) {
          const start = new Date(filters.customDateStart);
          if (t.dateObj < start) return false;
        }
        if (filters.customDateEnd) {
          const end = new Date(filters.customDateEnd);
          end.setHours(23, 59, 59, 999);
          if (t.dateObj > end) return false;
        }
      }

      return true;
    });
  }, [transactions, searchQuery, filters, selectedCreatedOn]);

  const executeBulkAction = useCallback((action: string) => {
    const ids = Array.from(selectedRowIds);
    if (ids.length === 0) return;

    setTransactions((prev) => {
      return prev.map((t) => {
        if (!ids.includes(t.id)) return t;
        
        if (action === 'retry') {
          if (t.status === 'Failed') {
            return { ...t, status: 'Completed' };
          }
        }
        if (action === 'force-success') {
          return { ...t, status: 'Completed' };
        }
        if (action === 'force-failed') {
          return { ...t, status: 'Failed' };
        }
        if (action === 'reverse') {
          return { ...t, amount: -t.amount, status: 'Completed' };
        }
        return t;
      });
    });
    setSelectedRowIds(new Set());
  }, [selectedRowIds]);

  return {
    transactions: filteredTransactions,
    rawTransactions: transactions,
    searchQuery,
    setSearchQuery,
    selectedCreatedOn,
    setSelectedCreatedOn,
    filters,
    setFilters,
    clearFilters,
    selectedRowIds,
    toggleSelectRow,
    toggleSelectAll,
    executeBulkAction
  };
}
