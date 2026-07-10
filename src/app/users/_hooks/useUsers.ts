'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

const API = 'http://localhost:8000';

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

export function useUsers({ page = 1, pageSize = 10, search = '' } = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJwaG9uZSI6Iis5MTk4NzQ3NDcyNTIiLCJleHAiOjE3ODQyNzc3MzYsImlhdCI6MTc4MzY3MjkzNn0.cj9MgoGPQokWFS-bLt9J2kJAtu_iYQ9C8f3BjqiSzO0';
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      if (search) {
        queryParams.append('search', search);
      }
      
      const response = await fetch(
        `${API}/api/v1/users/?${queryParams.toString()}`, 
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle the paginated response and map to frontend User interface
      const rawUsers = data.users || [];
      const count = data.total || rawUsers.length;
      
      const mappedUsers: User[] = rawUsers.map((u: any) => ({
        id: String(u.user_id),
        name: u.full_name || 'Unknown',
        email: u.email || '',
        role: (() => {
          if (u.is_mechanic) return 'Mechanic';
          if (u.role === 'admin') return 'Admin';
          if (u.role === 'seller') return 'Seller';
          if (u.role === 'buyer') return 'Customer';
          return u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'Customer';
        })(),
        status: u.is_active ? 'Active' : 'Inactive',
        joinedAt: u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
        avatar: u.profile_picture_url || undefined,
        phone: u.phone_number || '',
        location: 'Unknown', 
        lastLogin: u.updated_at ? new Date(u.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
        lifetimeValue: u.wallet_balance ? `₹${parseFloat(u.wallet_balance).toFixed(0)}` : '-',
        membership: u.membership_type || 'Free',
        dob: u.date_of_birth || undefined,
        userType: u.business_owner_type || undefined,
        typeOfUser: u.business_owner_type || undefined,
        businessName: u.business_name || undefined,
        businessType: u.business_type || undefined,
        gstNumber: u.gst_number || undefined,
        isVerified: u.is_verified || false,
        modulesUsed: [],
        activities: [],
        escalations: []
      }));
      
      setUsers(mappedUsers);
      setTotalCount(count);

    } catch (err: any) {
      setError(err?.message || 'Failed to load users from API.');
      
      // Fallback to mock data for development if API fails
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('users_data');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUsers(parsed);
          setTotalCount(parsed.length);
        } else {
          localStorage.setItem('users_data', JSON.stringify(INITIAL_MOCK_USERS));
          setUsers(INITIAL_MOCK_USERS);
          setTotalCount(INITIAL_MOCK_USERS.length);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

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

  // Create a new user (Admin API — mirrors onboarding steps 1-4)
  const createUser = useCallback(async (userData: Omit<User, 'id' | 'joinedAt' | 'lastLogin' | 'lifetimeValue' | 'location'> & { 
    location?: string, 
    industryIds?: number[], 
    serviceIds?: number[], 
    gender?: string,
    membershipType?: string,
    walletBalance?: string,
    isActive?: boolean,
    isVerified?: boolean,
    sendNotification?: boolean,
    businessName?: string,
    businessType?: string,
    gstNumber?: string,
    dob?: string
  }) => {
    try {
      const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJwaG9uZSI6Iis5MTk4NzQ3NDcyNTIiLCJleHAiOjE3ODQyNzc3MzYsImlhdCI6MTc4MzY3MjkzNn0.cj9MgoGPQokWFS-bLt9J2kJAtu_iYQ9C8f3BjqiSzO0';
      const token = HARDCODED_TOKEN;

      // Normalise user_type for backend (accepts 'individual' or 'business')
      const rawType = (userData.userType || 'Individual').toLowerCase().trim();
      const backendUserType =
        rawType === 'business owner' || rawType === 'business' || rawType === 'corporate'
          ? 'business'
          : 'individual';

      const payload: Record<string, unknown> = {
        full_name:         userData.name,
        email:             userData.email,
        phone_number:      userData.phone,
        role:              userData.role || 'Customer',
        date_of_birth:     userData.dob
                             ? new Date(userData.dob).toISOString().split('T')[0]
                             : undefined,
        // gender must be lowercase to match backend GenderEnum ('male','female','others')
        gender:            userData.gender ? userData.gender.toLowerCase() : undefined,
        user_type:         backendUserType,
        // Business details (Step 2 parity)
        business_name:     userData.businessName || undefined,
        business_type:     userData.businessType || undefined,
        gst_number:        userData.gstNumber || undefined,
        // Industry + Service selections (Step 3 & 4 parity)
        industry_ids:      userData.industryIds ?? [],
        service_ids:       userData.serviceIds ?? [],
        // Flags
        is_active:         userData.isActive !== undefined ? userData.isActive : true,
        send_notification: userData.sendNotification !== undefined ? userData.sendNotification : false,
      };

      // Remove undefined keys to keep payload clean
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      const res = await fetch(`${API}/api/v1/users/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const detail = err.detail;
        const errorMsg = Array.isArray(detail)
          ? detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ')
          : (typeof detail === 'string' ? detail : (err.message || 'User Creation Failed'));
        throw new Error(errorMsg);
      }

      const finalData = await res.json();

      const newUser: User = {
        location: 'Unknown',
        ...userData,
        id:           String(finalData.user_id),
        joinedAt:     new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        lastLogin:    '-',
        lifetimeValue: '₹500',
        modulesUsed:  userData.modulesUsed || [],
        activities:   [],
        escalations:  [],
      };

      setUsers(prev => [newUser, ...prev]);
      setTotalCount(prev => prev + 1);
      return newUser;
    } catch (err: any) {
      setError(err?.message || 'Failed to create user.');
      throw err;
    }
  }, []);

  // Fetch single user
  const fetchUser = useCallback(async (id: string) => {
    try {
      const token = typeof window !== 'undefined'
        ? (localStorage.getItem('adminToken') || localStorage.getItem('auth_token'))
        : null;
      const response = await fetch(`${API}/api/v1/users/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const u = await response.json();
      const mappedUser: User = {
        id:           String(u.user_id),
        name:         u.full_name || 'Unknown',
        email:        u.email || '',
        role: (() => {
          if (u.is_mechanic) return 'Mechanic';
          if (u.role === 'admin') return 'Admin';
          if (u.role === 'seller') return 'Seller';
          if (u.role === 'buyer') return 'Customer';
          return u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'Customer';
        })(),
        status:       u.is_active ? 'Active' : 'Inactive',
        joinedAt:     u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
        avatar:       u.profile_picture_url || undefined,
        phone:        u.phone_number || '',
        location:     'Unknown',
        lastLogin:    u.updated_at ? new Date(u.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
        lifetimeValue: u.wallet_balance ? `₹${parseFloat(u.wallet_balance).toFixed(0)}` : '-',
        membership:   u.membership_type || 'Free',
        dob:          u.date_of_birth || undefined,
        userType:     u.business_owner_type || undefined,
        typeOfUser:   u.business_owner_type || undefined,
        businessName: u.business_name || undefined,
        businessType: u.business_type || undefined,
        gstNumber:    u.gst_number || undefined,
        modulesUsed:  [],
        activities:   [],
        escalations:  [],
      };
      return mappedUser;
    } catch (err: any) {
      console.error('Error fetching single user:', err);
      return users.find(u => u.id === id) || null;
    }
  }, [users]);

  // Deactivate user (soft delete)
  const deactivateUser = useCallback(async (id: string) => {
    try {
      const token = typeof window !== 'undefined'
        ? (localStorage.getItem('adminToken') || localStorage.getItem('auth_token'))
        : null;
      const response = await fetch(`${API}/api/v1/users/${id}/deactivate`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to deactivate user');
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Inactive' } : u));
    } catch (err: any) {
      setError(err?.message || 'Failed to deactivate user.');
      throw err;
    }
  }, []);

  // Hard delete user
  const deleteUser = useCallback(async (id: string) => {
    try {
      const token = typeof window !== 'undefined'
        ? (localStorage.getItem('adminToken') || localStorage.getItem('auth_token'))
        : null;
      const response = await fetch(`${API}/api/v1/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete user.');
      throw err;
    }
  }, []);

  // Update complete user details
  const updateUser = useCallback(async (id: string, updatedFields: Partial<User>) => {
    try {
      const token = typeof window !== 'undefined'
        ? (localStorage.getItem('adminToken') || localStorage.getItem('auth_token'))
        : null;

      // Map frontend fields to backend AdminUserUpdateRequest schema
      const payload: Record<string, unknown> = {};
      if (updatedFields.role)   payload.role      = updatedFields.role.toLowerCase();
      if (updatedFields.status) payload.is_active = updatedFields.status === 'Active';

      if (Object.keys(payload).length > 0) {
        const response = await fetch(`${API}/api/v1/admin/users/${id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.warn('Update API response:', errData);
        }
      }

      // Always update local state optimistically
      setUsers(prev => {
        const updated = prev.map(u => u.id === id ? { ...u, ...updatedFields } : u);
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
    totalCount,
    loading,
    error,
    refetch: fetchUsers,
    updateStatus,
    createUser,
    updateUser,
    fetchUser,
    deactivateUser,
    deleteUser
  };
}
