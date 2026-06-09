'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useLogin } from './_hooks/useLogin';
import styles from './login.module.css';

export default function LoginPage() {
  const {
    mode, email, setEmail, password, setPassword,
    otp, handleOtpChange, loading, error,
    requestOtp, verifyOtp, loginWithPassword, toggleMode
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      {/* ── Left Side (Image) ── */}
      <div className={styles.imageSection}>
        <div className={styles.logoTopLeft}>
          SEWTECH<span>mart</span>
        </div>
        <div className={styles.imageOverlay} />
        {/* We use standard img to avoid Next.js Image config issues if any, but since the user has a local public image: */}
        <img src="/login_image.png" alt="Vintage Sewing Machine" />
      </div>

      {/* ── Right Side (Form) ── */}
      <div className={styles.formSection}>
        
        {/* Title Block */}
        {mode === 'verify_otp' ? (
          <>
            <h1 className={styles.title}>Check your Inbox</h1>
            <p className={styles.subtitle}>
              Please enter the 6-digit code sent to<br/>
              <strong>{email}</strong> <span style={{ cursor: 'pointer', color: '#6b7280' }} onClick={() => toggleMode('otp')}>✏️</span>
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Login</h1>
            {mode === 'password' && (
              <p className={styles.subtitle}>Please enter the password sent to your email</p>
            )}
            {mode === 'otp' && <div style={{ marginBottom: '2rem' }} />}
          </>
        )}

        {/* Global Error */}
        {error && mode !== 'verify_otp' && (
          <div className={styles.globalError}>{error}</div>
        )}

        {/* Form Body */}
        {mode === 'otp' && (
          <>
            <div className={styles.inputGroup}>
              <input 
                type="email" 
                placeholder="Enter your registered email" 
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className={styles.primaryBtn} onClick={requestOtp} disabled={loading}>
              {loading ? 'Sending...' : 'Get OTP on Email'}
            </button>
            <button className={styles.linkBtn} onClick={() => toggleMode('password')}>
              Login using password instead
            </button>
          </>
        )}

        {mode === 'password' && (
          <>
            <div className={styles.inputGroup}>
              <input 
                type="email" 
                placeholder="Enter your registered email" 
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
            <button className={styles.primaryBtn} onClick={loginWithPassword} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button className={styles.linkBtn} onClick={() => toggleMode('otp')}>
              Login using OTP instead
            </button>
          </>
        )}

        {mode === 'verify_otp' && (
          <>
            <div className={styles.otpContainer}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  className={`${styles.otpInput} ${error ? styles.otpInputError : ''}`}
                  value={digit}
                  maxLength={1}
                  onChange={(e) => {
                    handleOtpChange(i, e.target.value);
                    if (e.target.value && i < 5) {
                      document.getElementById(`otp-${i + 1}`)?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && i > 0) {
                      document.getElementById(`otp-${i - 1}`)?.focus();
                    }
                  }}
                />
              ))}
            </div>
            <div className={styles.otpSubRow}>
              <button className={styles.resendLink} onClick={requestOtp} disabled={loading}>
                Resend OTP
              </button>
              {error && <span className={styles.errorText}>Incorrect OTP</span>}
            </div>

            <button 
              className={styles.primaryBtn} 
              onClick={verifyOtp} 
              disabled={loading || otp.join('').length < 6 || !!error}
              style={{ backgroundColor: (otp.join('').length < 6 || !!error) ? '#93c5fd' : '#2563eb' }}
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
            <button className={styles.linkBtn} onClick={() => toggleMode('password')}>
              Login using password instead
            </button>
          </>
        )}

        {/* Social Sign In (Hidden in verify OTP mode) */}
        {mode !== 'verify_otp' && (
          <>
            <div className={styles.dividerRow}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>Or Sign In Using</span>
              <div className={styles.dividerLine} />
            </div>
            <div className={styles.socialRow}>
              <button className={styles.socialBtn}>
                <span style={{color: '#00a4ef', fontWeight: 900}}>❖</span> Outlook
              </button>
              <button className={styles.socialBtn}>
                <span style={{color: '#ea4335', fontWeight: 900}}>G</span> Google
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
