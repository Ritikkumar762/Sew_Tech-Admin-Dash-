import { useState, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://project-sewtech-mart.onrender.com';

export interface UserProfile {
  user_id: number;
  full_name: string | null;
  phone_number: string;
  email: string;
  role: string;
  profile_picture_url: string | null;
  [key: string]: any;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTciLCJwaG9uZSI6Iis5MTk4NzQ3NDcyNTIiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjIwOTk4ODU4MjYsImlhdCI6MTc4NDUyNTgyNn0.VbN8ps-Ucul8Evkyo0X9iltdU43Fn2IDfE9cf7VtKcI';
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadProfilePicture = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE}/api/v1/users/me/profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          // Don't set Content-Type for FormData
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload profile picture');
      const data = await response.json();
      
      setProfile(prev => prev ? { ...prev, profile_picture_url: data.profile_picture_url } : null);
    } catch (err: any) {
      setError(err.message || 'Error uploading profile picture');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProfilePicture = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/users/me/profile-picture`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete profile picture');
      
      setProfile(prev => prev ? { ...prev, profile_picture_url: null } : null);
    } catch (err: any) {
      setError(err.message || 'Error deleting profile picture');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadProfilePicture,
    deleteProfilePicture
  };
}
