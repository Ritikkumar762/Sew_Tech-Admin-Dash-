'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUsers } from '../_hooks/useUsers';
import styles from './page.module.css';
import { Calendar, ChevronDown } from 'lucide-react';

export default function AddUserPage() {
  const router = useRouter();
  const { createUser } = useUsers();

  // ── Form States ─────────────────────────────────────────────
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState('Customer');
  const [userType, setUserType] = useState('Individual');
  const [sendNotification, setSendNotification] = useState(false);

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Roles available matching the design spec
  const rolesList = [
    'Customer',
    'Mechanic',
    'Kaarigar',
    'Audit',
    'Super-Admin',
    'Spares Admin',
    'Kaarigar Admin',
    'Mechanic Admin',
    'Academic Admin',
    'Exchange Admin'
  ];

  // User types matching the design spec
  const userTypesList = [
    'Individual',
    'Business Owner',
    'Partner',
    'Corporate'
  ];

  // ── Validation ──────────────────────────────────────────────
  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = 'Name is required.';
    if (!phone.trim()) {
      tempErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phone.trim().replace(/[^\d]/g, ''))) {
      tempErrors.phone = 'Please enter a valid 10-digit phone number.';
    }
    if (!email.trim()) {
      tempErrors.email = 'Email ID is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }
    if (!role) tempErrors.role = 'Role is required.';
    if (role === 'Customer' && !userType) tempErrors.userType = 'User Type is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ── Handlers ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      // Clean phone format
      const cleanPhone = phone.trim().replace(/[^\d]/g, '');
      const formattedPhone = `+91 ${cleanPhone}`;

      // Format DOB to readable form e.g. "21 Jan' 1990"
      let formattedDob = '';
      if (dob) {
        const dateObj = new Date(dob);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        formattedDob = `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]}' ${dateObj.getFullYear()}`;
      }

      const isCust = role === 'Customer';
      await createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: formattedPhone,
        dob: formattedDob || undefined,
        role,
        userType: isCust ? userType : 'Individual',
        typeOfUser: isCust ? userType : 'Individual', // Keep both fields for safety
        status: 'Active', // Default status is active
        membership: isCust ? 'Silver' : undefined,
        // Mock business details for business owner roles
        businessName: (isCust && userType === 'Business Owner') ? 'Demo company Pvt Ltd' : undefined,
        businessType: (isCust && userType === 'Business Owner') ? 'Demo Type' : undefined,
        gstNumber: (isCust && userType === 'Business Owner') ? '29ABCDE1234F1Z5' : undefined,
      });

      // Redirect back to users list
      router.push('/users');
    } catch (err: any) {
      setGeneralError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header and Breadcrumbs */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <div className={styles.breadcrumbs}>
            <span>User Management</span>
            <span>•</span>
            <span className={styles.breadcrumbActive}>Add User</span>
          </div>
          <h1 className={styles.title}>Add New User</h1>
        </div>

        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.discardBtn}
            onClick={() => router.push('/users')}
            disabled={isSubmitting}
          >
            Discard Changes
          </button>
          <button 
            type="button" 
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </div>

      {generalError && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '8px' }}>
          {generalError}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <h2 className={styles.sectionTitle}>General Details</h2>

        <div className={styles.formGrid}>
          {/* Name Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Name <span className={styles.required}>*</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter Name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          {/* Phone Number Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Phone Number <span className={styles.required}>*</span>
            </label>
            <div className={styles.phoneInputWrapper}>
              <div className={styles.flagDropdown}>
                <span className={styles.flag}>🇮🇳</span>
                <ChevronDown size={12} />
              </div>
              <div style={{ padding: '0 0.5rem', color: '#94a3b8', fontWeight: 500 }}>+91</div>
              <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)' }}></div>
              <input 
                type="text" 
                placeholder="9876543210"
                className={styles.phoneInput}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
          </div>

          {/* Email ID Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Email ID <span className={styles.required}>*</span>
            </label>
            <input 
              type="email" 
              placeholder="Enter Name" // Matches mock image design
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          {/* DOB Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>DOB</label>
            <div className={styles.dateInputWrapper}>
              <input 
                type="date"
                className={styles.dateInput}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={isSubmitting}
              />
              <Calendar className={styles.dateIcon} size={16} />
            </div>
          </div>

          {/* Role Dropdown */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Role <span className={styles.required}>*</span>
            </label>
            <select 
              className={styles.input}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isSubmitting}
            >
              {rolesList.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.role && <span className={styles.errorText}>{errors.role}</span>}
          </div>

          {/* User Type Dropdown - Conditional on Customer role */}
          {role === 'Customer' && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                User Type <span className={styles.required}>*</span>
              </label>
              <select 
                className={styles.input}
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                disabled={isSubmitting}
              >
                {userTypesList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.userType && <span className={styles.errorText}>{errors.userType}</span>}
            </div>
          )}
        </div>

        {/* Send user notification Checkbox */}
        <label className={styles.notificationOption}>
          <input 
            type="checkbox" 
            className={styles.checkbox}
            checked={sendNotification}
            onChange={(e) => setSendNotification(e.target.checked)}
            disabled={isSubmitting}
          />
          <span>Send user notification</span>
        </label>
      </form>
    </div>
  );
}
