'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

// Rich mock data matching the screenshot specs
const INITIAL_MOCK_USERS: User[] = [
  {
    id: 'u-nishant',
    name: 'Nishant Kumar',
    email: 'nishant.kumar@gmail.com',
    role: 'Customer',
    status: 'Active',
    joinedAt: '21 Jan\' 26',
    phone: '9876543210',
    location: 'Delhi',
    lastLogin: '21 Jan\' 26',
    lifetimeValue: '₹2,500',
    membership: 'Gold',
    dob: '21 Jan\' 1990',
    selectedLanguage: 'Hindi, English, Punjabi',
    joiningDate: '21 Jan\' 2026',
    userType: 'Business Owner',
    typeOfUser: 'Business Owner',
    businessName: 'Demo company Pvt Ltd',
    businessType: 'Demo Type',
    gstNumber: '29ABCDE1234F1Z5',
    modulesUsed: ['spares', 'exchange', 'kaarigar', 'academy'],
    activities: [
      { id: 'act1', title: 'Instant Booking Requested', status: 'Completed', date: '15th Jan 2025, 10:20 AM' },
      { id: 'act2', title: 'Instant Booking Requested', status: 'Cancelled', date: '15th Jan 2025, 10:20 AM' }
    ],
    escalations: [
      { id: 'esc1', disputeId: 'STM834849', mechanicName: 'Nishant Kumar', issueType: 'Service Related Issue', status: 'Resolved' },
      { id: 'esc2', disputeId: 'STM834849', mechanicName: 'Nishant Kumar', issueType: 'Service Related Issue', status: 'Active' },
      { id: 'esc3', disputeId: 'STM834849', mechanicName: 'Nishant Kumar', issueType: 'Service Related Issue', status: 'Active' },
      { id: 'esc4', disputeId: 'STM834849', mechanicName: 'Nishant Kumar', issueType: 'Service Related Issue', status: 'Active' }
    ]
  },
  {
    id: 'u-nishant-2',
    name: 'Nishant Kumar',
    email: 'nishant2@example.com',
    role: 'Mechanic',
    status: 'Active',
    joinedAt: '21 Jan\' 26',
    phone: '9876543210',
    location: 'Delhi',
    lastLogin: '21 Jan\' 26',
    lifetimeValue: '₹2,500',
    membership: 'Silver',
    dob: '15 Aug\' 1988',
    selectedLanguage: 'Hindi, English',
    joiningDate: '21 Jan\' 2026',
    userType: 'Individual',
    typeOfUser: 'Individual',
    modulesUsed: ['spares', 'kaarigar'],
    activities: [],
    escalations: []
  },
  {
    id: 'u-nishant-3',
    name: 'Nishant Kumar',
    email: 'nishant3@example.com',
    role: 'Kaarigar',
    status: 'Active',
    joinedAt: '21 Jan\' 26',
    phone: '9876543210',
    location: 'Delhi',
    lastLogin: '21 Jan\' 26',
    lifetimeValue: '₹2,500',
    membership: 'Silver',
    dob: '10 May\' 1993',
    selectedLanguage: 'Hindi, Punjabi',
    joiningDate: '21 Jan\' 2026',
    userType: 'Individual',
    typeOfUser: 'Individual',
    modulesUsed: ['kaarigar'],
    activities: [],
    escalations: []
  },
  {
    id: 'u-nishant-4',
    name: 'Nishant Kumar',
    email: 'nishant4@example.com',
    role: 'Audit',
    status: 'Active',
    joinedAt: '21 Jan\' 26',
    phone: '9876543210',
    location: 'Delhi',
    lastLogin: '21 Jan\' 26',
    lifetimeValue: '₹2,500',
    membership: 'Silver',
    dob: '05 Jan\' 1991',
    selectedLanguage: 'English',
    joiningDate: '21 Jan\' 2026',
    userType: 'Individual',
    typeOfUser: 'Individual',
    modulesUsed: [],
    activities: [],
    escalations: []
  },
  {
    id: 'u-nishant-5',
    name: 'Nishant Kumar',
    email: 'nishant5@example.com',
    role: 'Super-Admin',
    status: 'Active',
    joinedAt: '21 Jan\' 26',
    phone: '9876543210',
    location: 'Delhi',
    lastLogin: '21 Jan\' 26',
    lifetimeValue: '-',
    membership: 'Gold',
    dob: '01 Jan\' 1985',
    selectedLanguage: 'English, Hindi',
    joiningDate: '21 Jan\' 2026',
    userType: 'Individual',
    typeOfUser: 'Individual',
    modulesUsed: [],
    activities: [],
    escalations: []
  },
  {
    id: 'u-nishant-6',
    name: 'Nishant Kumar',
    email: 'nishant6@example.com',
    role: 'Spares Admin',
    status: 'Active',
    joinedAt: '21 Jan\' 26',
    phone: '9876543210',
    location: 'Delhi',
    lastLogin: '21 Jan\' 26',
    lifetimeValue: '-',
    membership: 'Silver',
    dob: '12 Sep\' 1992',
    selectedLanguage: 'Hindi',
    joiningDate: '21 Jan\' 2026',
    userType: 'Individual',
    typeOfUser: 'Individual',
    modulesUsed: ['spares'],
    activities: [],
    escalations: []
  },
  {
    id: 'u-nishant-7',
    name: 'Nishant Kumar',
    email: 'nishant7@example.com',
    role: 'Kaarigar Admin',
    status: 'Active',
    joinedAt: '21 Jan\' 26',
    phone: '9876543210',
    location: 'Delhi',
    lastLogin: '21 Jan\' 26',
    lifetimeValue: '-',
    membership: 'Silver',
    dob: '25 Nov\' 1994',
    selectedLanguage: 'Hindi, English',
    joiningDate: '21 Jan\' 2026',
    userType: 'Individual',
    typeOfUser: 'Individual',
    modulesUsed: ['kaarigar'],
    activities: [],
    escalations: []
  },
  {
    id: 'u-nishant-8',
    name: 'Nishant Kumar',
    email: 'nishant8@example.com',
    role: 'Mechanic Admin',
    status: 'Active',
    joinedAt: '21 Jan\' 26',
    phone: '9876543210',
    location: 'Delhi',
    lastLogin: '21 Jan\' 26',
    lifetimeValue: '-',
    membership: 'Silver',
    dob: '18 Dec\' 1989',
    selectedLanguage: 'Hindi, English',
    joiningDate: '21 Jan\' 2026',
    userType: 'Individual',
    typeOfUser: 'Individual',
    modulesUsed: [],
    activities: [],
    escalations: []
  },
  {
    id: 'u-nishant-9',
    name: 'Nishant Kumar',
    email: 'nishant9@example.com',
    role: 'Academic Admin',
    status: 'Active',
    joinedAt: '21 Jan\' 26',
    phone: '9876543210',
    location: 'Delhi',
    lastLogin: '21 Jan\' 26',
    lifetimeValue: '-',
    membership: 'Silver',
    dob: '02 Apr\' 1995',
    selectedLanguage: 'English',
    joiningDate: '21 Jan\' 2026',
    userType: 'Individual',
    typeOfUser: 'Individual',
    modulesUsed: [],
    activities: [],
    escalations: []
  },
  {
    id: 'u-nishant-10',
    name: 'Nishant Kumar',
    email: 'nishant10@example.com',
    role: 'Exchange Admin',
    status: 'Active',
    joinedAt: '21 Jan\' 26',
    phone: '9876543210',
    location: 'Delhi',
    lastLogin: '21 Jan\' 26',
    lifetimeValue: '-',
    membership: 'Silver',
    dob: '14 Feb\' 1991',
    selectedLanguage: 'Hindi, English',
    joiningDate: '21 Jan\' 2026',
    userType: 'Individual',
    typeOfUser: 'Individual',
    modulesUsed: [],
    activities: [],
    escalations: []
  }
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users from localStorage or initial mock data
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // BACKEND INTEGRATION:
      // const res = await apiClient.get<User[]>(ENDPOINTS.users.list);
      // setUsers(res);

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('users_data');
        if (stored) {
          setUsers(JSON.parse(stored));
        } else {
          localStorage.setItem('users_data', JSON.stringify(INITIAL_MOCK_USERS));
          setUsers(INITIAL_MOCK_USERS);
        }
      }
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 400));
    } catch (err: any) {
      setError(err?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user status
  const updateStatus = useCallback(async (id: string, status: User['status']) => {
    try {
      // BACKEND INTEGRATION:
      // await apiClient.patch(ENDPOINTS.users.updateStatus(id), { status });
      
      setUsers((prev) => {
        const updated = prev.map((u) => (u.id === id ? { ...u, status } : u));
        if (typeof window !== 'undefined') {
          localStorage.setItem('users_data', JSON.stringify(updated));
        }
        return updated;
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to update user status.');
    }
  }, []);

  // Create a new user
  const createUser = useCallback(async (userData: Omit<User, 'id' | 'joinedAt' | 'lastLogin' | 'lifetimeValue' | 'location'> & { location?: string }) => {
    try {
      // BACKEND INTEGRATION:
      // const newUser = await apiClient.post<User>(ENDPOINTS.users.create, userData);
      // setUsers(prev => [...prev, newUser]);
      
      const newId = 'u-' + Math.random().toString(36).substr(2, 9);
      const today = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedDate = `${today.getDate()} ${monthNames[today.getMonth()]}' ${String(today.getFullYear()).slice(-2)}`;

      const newUser: User = {
        location: 'Delhi',
        ...userData,
        id: newId,
        joinedAt: formattedDate,
        lastLogin: formattedDate,
        lifetimeValue: userData.role === 'Customer' ? '₹0' : '-',
        modulesUsed: userData.modulesUsed || [],
        activities: [],
        escalations: []
      };

      setUsers((prev) => {
        const updated = [...prev, newUser];
        if (typeof window !== 'undefined') {
          localStorage.setItem('users_data', JSON.stringify(updated));
        }
        return updated;
      });

      return newUser;
    } catch (err: any) {
      setError(err?.message || 'Failed to create user.');
      throw err;
    }
  }, []);

  // Update complete user details
  const updateUser = useCallback(async (id: string, updatedFields: Partial<User>) => {
    try {
      // BACKEND INTEGRATION:
      // await apiClient.patch(ENDPOINTS.users.update(id), updatedFields);
      
      setUsers((prev) => {
        const updated = prev.map((u) => (u.id === id ? { ...u, ...updatedFields } : u));
        if (typeof window !== 'undefined') {
          localStorage.setItem('users_data', JSON.stringify(updated));
        }
        return updated;
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to update user details.');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    updateStatus,
    createUser,
    updateUser
  };
}
