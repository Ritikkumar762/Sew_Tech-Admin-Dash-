import { useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export function useOnboarding() {
  const getAuthToken = () => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) {
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMTAiLCJleHAiOjE3ODQ3MjE5NjMsImlhdCI6MTc4MjEyOTk2M30.Nik_eLY_nGV-FS2YXJYsdMxOhITXGVY4R15jzUVFnr4';
    }
    return token;
  };

  const submitStep1 = useCallback(async (data: any) => {
    const token = getAuthToken();
    const payload = {
      verified_otp_token: token,
      full_name: data.name,
      email: data.email,
      gender: data.gender === "OTHER" ? "others" : (data.gender ? data.gender.toLowerCase() : "others"),
      date_of_birth: data.dob ? new Date(data.dob).toISOString().split('T')[0] : "1990-01-01",
      profile_picture_url: null
    };

    const res = await fetch(`${API_BASE}/api/v1/onboarding/register/step1`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const errorMsg = Array.isArray(err.detail) ? JSON.stringify(err.detail) : (err.detail || err.message || `Step 1 Failed`);
      throw new Error(errorMsg);
    }
    return res.json();
  }, []);

  const submitStep2 = useCallback(async (data: any) => {
    const token = getAuthToken();
    const payload = {
      verified_otp_token: token,
      business_owner_type: (data.userType && data.userType.toUpperCase() === 'BUSINESS OWNER') ? 'BUSINESS' : 'INDIVIDUAL',
      business_name: data.businessName || null,
      business_type: data.businessType || null,
      gst_number: data.gstNumber || null
    };

    const res = await fetch(`${API_BASE}/api/v1/onboarding/register/step2`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const errorMsg = Array.isArray(err.detail) ? JSON.stringify(err.detail) : (err.detail || err.message || `Step 2 Failed`);
      throw new Error(errorMsg);
    }
    return res.json();
  }, []);

  const submitStep3 = useCallback(async (industryIds: number[]) => {
    const token = getAuthToken();
    const payload = {
      verified_otp_token: token,
      industry_ids: industryIds.length > 0 ? industryIds : [1]
    };

    const res = await fetch(`${API_BASE}/api/v1/onboarding/register/step3`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const errorMsg = Array.isArray(err.detail) ? JSON.stringify(err.detail) : (err.detail || err.message || `Step 3 Failed`);
      throw new Error(errorMsg);
    }
    return res.json();
  }, []);

  const submitStep4 = useCallback(async (serviceIds: number[]) => {
    const token = getAuthToken();
    const payload = {
      verified_otp_token: token,
      service_ids: serviceIds.length > 0 ? serviceIds : [1]
    };

    const res = await fetch(`${API_BASE}/api/v1/onboarding/register/step4`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const errorMsg = Array.isArray(err.detail) ? JSON.stringify(err.detail) : (err.detail || err.message || `Step 4 Failed`);
      throw new Error(errorMsg);
    }
    return res.json();
  }, []);

  const completeOnboarding = useCallback(async () => {
    const token = getAuthToken();
    const payload = {
      verified_otp_token: token,
      device_name: "Admin Dashboard",
      device_id: "admin"
    };

    const res = await fetch(`${API_BASE}/api/v1/onboarding/register/complete`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const errorMsg = Array.isArray(err.detail) ? JSON.stringify(err.detail) : (err.detail || err.message || `Complete Step Failed`);
      throw new Error(errorMsg);
    }
    return res.json();
  }, []);

  return {
    submitStep1,
    submitStep2,
    submitStep3,
    submitStep4,
    completeOnboarding
  };
}
