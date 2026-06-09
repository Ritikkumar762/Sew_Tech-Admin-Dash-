import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type LoginMode = 'otp' | 'password' | 'verify_otp';

export function useLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>('otp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Actions ──────────────────────────────────────────────────
  const requestOtp = useCallback(async () => {
    if (!email) {
      setError('Please enter a valid email.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with real API call
      // await apiClient.post('/auth/request-otp', { email });
      await new Promise(r => setTimeout(r, 600)); // mock delay
      setMode('verify_otp');
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP. Try again.');
    } finally {
      setLoading(false);
    }
  }, [email]);

  const verifyOtp = useCallback(async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) return;

    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with real API call
      // await apiClient.post('/auth/verify-otp', { email, otp: otpValue });
      await new Promise(r => setTimeout(r, 600)); // mock delay
      if (otpValue === '123456') {
        // Success
        router.push('/dashboard');
      } else {
        throw new Error('Incorrect OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Incorrect OTP');
    } finally {
      setLoading(false);
    }
  }, [email, otp, router]);

  const loginWithPassword = useCallback(async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with real API call
      // await apiClient.post('/auth/login', { email, password });
      await new Promise(r => setTimeout(r, 600)); // mock delay
      if (email === 'admin@sewtech.com' && password === 'admin') {
        router.push('/dashboard');
      } else {
        throw new Error('Invalid credentials. (Hint: admin@sewtech.com / admin)');
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
    if (value.length > 1) value = value.slice(-1); // only single char
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null); // clear error when typing
  };

  return {
    mode,
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
