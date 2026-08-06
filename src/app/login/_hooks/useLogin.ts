import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type LoginMode = 'otp' | 'password' | 'verify_otp';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://project-sewtech-mart.onrender.com';

export function useLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>('otp');
  const [phone, setPhone] = useState('');     // used for OTP flow
  const [email, setEmail] = useState('');     // kept for password flow UI
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── OTP Request (real API) ────────────────────────────────────
  const requestOtp = useCallback(async () => {
    const rawPhone = (phone || email).trim();
    if (!rawPhone) {
      setError('Please enter your phone number.');
      return;
    }
    // Normalise: add +91 if bare 10-digit number
    const formattedPhone = rawPhone.startsWith('+')
      ? rawPhone
      : `+91${rawPhone.replace(/\D/g, '')}`;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/auth/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: formattedPhone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || data.detail || 'Failed to send OTP');
      }
      setMode('verify_otp');
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP. Try again.');
    } finally {
      setLoading(false);
    }
  }, [phone, email]);

  // ── OTP Verify (real API) → stores token ─────────────────────
  const verifyOtp = useCallback(async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) return;

    const rawPhone = (phone || email).trim();
    const formattedPhone = rawPhone.startsWith('+')
      ? rawPhone
      : `+91${rawPhone.replace(/\D/g, '')}`;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: formattedPhone, otp_code: otpValue }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || data.detail || 'Incorrect OTP');
      }

      if (data.access_token) {
        // Store token — all hooks read 'auth_token'
        localStorage.setItem('auth_token', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        router.push('/dashboard');
      } else {
        // verified_otp_token returned — user not fully registered (shouldn't happen for admin)
        throw new Error('Admin account not found for this phone number.');
      }
    } catch (err: any) {
      setError(err.message || 'Incorrect OTP');
    } finally {
      setLoading(false);
    }
  }, [phone, email, otp, router]);

  // ── Password login (kept as fallback, not used by backend) ────
  const loginWithPassword = useCallback(async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Backend uses phone+OTP — password login not supported
      // This is a UI-only mock for development
      if (email === 'admin@sewtech.com' && password === 'admin') {
        router.push('/dashboard');
      } else {
        throw new Error('Invalid credentials. Use phone number + OTP to login.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }, [email, password, router]);

  const toggleMode = (newMode: LoginMode) => {
    setMode(newMode);
    setError(null);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);
  };

  return {
    mode,
    phone, setPhone,
    email, setEmail,
    password, setPassword,
    otp, handleOtpChange,
    loading,
    error,
    requestOtp,
    verifyOtp,
    loginWithPassword,
    toggleMode,
  };
}
