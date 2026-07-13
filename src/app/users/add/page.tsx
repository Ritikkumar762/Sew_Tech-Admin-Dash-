'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUsers } from '../_hooks/useUsers';
import styles from './page.module.css';
import { Calendar, ChevronDown } from 'lucide-react';

export default function AddUserWizardPage() {
  const router = useRouter();
  const { createUser, fetchIndustries, fetchServices } = useUsers();

  const [currentStep, setCurrentStep] = useState(1);

  // ── Form States ─────────────────────────────────────────────
  // Step 1
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState('Customer');
  const [gender, setGender] = useState('male');
  
  // Step 2
  const [userType, setUserType] = useState('Individual');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [membershipType, setMembershipType] = useState('Free');
  const [walletBalance, setWalletBalance] = useState('500.00');
  const [isActive, setIsActive] = useState(true);
  const [isVerified, setIsVerified] = useState(true);

  // Step 3
  const [selectedIndustries, setSelectedIndustries] = useState<number[]>([]);
  
  // Step 4
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  // Extra
  const [sendNotification, setSendNotification] = useState(false);

  // ── Master Data States ──────────────────────────────────────
  const [industriesList, setIndustriesList] = useState<{id: number, name: string}[]>([]);
  const [servicesList, setServicesList] = useState<{id: number, name: string}[]>([]);

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const rolesList = ['Customer', 'Seller', 'Mechanic', 'Audit', 'Super-Admin', 'Spares Admin', 'Kaarigar Admin', 'Mechanic Admin', 'Academic Admin', 'Exchange Admin'];
  // Backend supports 'individual' and 'business' only
  const userTypesList = ['Individual', 'Business Owner'];


  // ── Fetch Master Data ───────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [inds, servs] = await Promise.all([fetchIndustries(), fetchServices()]);
        setIndustriesList(inds);
        setServicesList(servs);
      } catch (err) {
        console.error('Failed to load master data', err);
      }
    };
    load();
  }, [fetchIndustries, fetchServices]);

  // ── Validation ──────────────────────────────────────────────
  const validateStep1 = () => {
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

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep2 = () => {
    const tempErrors: Record<string, string> = {};
    if (role === 'Customer' && !userType) tempErrors.userType = 'User Type is required.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ── Handlers ────────────────────────────────────────────────
  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setIsSubmitting(true);
      try {
        const cleanPhone = phone.trim().replace(/[^\d]/g, '');
        const formattedPhone = `+91${cleanPhone}`;
        await createUser({
          name,
          email,
          phone: formattedPhone,
          dob,
          role,
          // gender lowercase to match backend GenderEnum: male/female/others
          gender: gender.toLowerCase(),
          userType,
          businessName,
          businessType,
          gstNumber,
          industryIds: selectedIndustries,
          serviceIds: selectedServices,
          membershipType,
          walletBalance,
          isActive,
          isVerified,
          sendNotification,
          // Fields required by the User type union
          status: 'Active',
          location: 'Unknown',
          modulesUsed: [],
          activities: [],
          escalations: [],
        });
        router.push('/users');
      } catch (err: any) {
        setGeneralError(err.message || 'Failed to create user');
      } finally {
        setIsSubmitting(false);
      }
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
            <span className={styles.breadcrumbActive}>Add User (Step {currentStep} of 4)</span>
          </div>
          <h1 className={styles.title}>Onboard New User</h1>
        </div>

        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.discardBtn}
            onClick={() => router.push('/users')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          {currentStep > 1 && (
            <button 
              type="button" 
              className={styles.discardBtn}
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={isSubmitting}
            >
              Back
            </button>
          )}

          <button 
            type="button" 
            className={styles.submitBtn}
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (currentStep === 4 ? 'Complete Registration' : 'Next Step')}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map(step => (
          <div 
            key={step} 
            style={{ 
              height: '6px', 
              flex: 1, 
              backgroundColor: currentStep >= step ? '#3b82f6' : '#e2e8f0',
              borderRadius: '3px'
            }} 
          />
        ))}
      </div>

      {generalError && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '8px', marginBottom: '1rem' }}>
          {generalError}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleNext} className={styles.formCard}>
        
        {currentStep === 1 && (
          <>
            <h2 className={styles.sectionTitle}>Step 1: General Details</h2>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Name <span className={styles.required}>*</span></label>
                <input type="text" placeholder="Enter Name" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Phone Number <span className={styles.required}>*</span></label>
                <div className={styles.phoneInputWrapper}>
                  <div className={styles.flagDropdown}><span className={styles.flag}>🇮🇳</span><ChevronDown size={12} /></div>
                  <div style={{ padding: '0 0.5rem', color: '#94a3b8', fontWeight: 500 }}>+91</div>
                  <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)' }}></div>
                  <input type="text" placeholder="9876543210" className={styles.phoneInput} value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isSubmitting} />
                </div>
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email ID <span className={styles.required}>*</span></label>
                <input type="email" placeholder="Enter Email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>DOB</label>
                <div className={styles.dateInputWrapper}>
                  <input type="date" className={styles.dateInput} value={dob} onChange={(e) => setDob(e.target.value)} disabled={isSubmitting} />
                  <Calendar className={styles.dateIcon} size={16} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Gender</label>
                <select className={styles.input} value={gender} onChange={(e) => setGender(e.target.value)} disabled={isSubmitting}>
                  {/* Lowercase values match backend GenderEnum exactly */}
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Other</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Role <span className={styles.required}>*</span></label>
                <select className={styles.input} value={role} onChange={(e) => setRole(e.target.value)} disabled={isSubmitting}>
                  {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.role && <span className={styles.errorText}>{errors.role}</span>}
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h2 className={styles.sectionTitle}>Step 2: Business Details</h2>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>User Type <span className={styles.required}>*</span></label>
                <select className={styles.input} value={userType} onChange={(e) => setUserType(e.target.value)} disabled={isSubmitting}>
                  {userTypesList.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.userType && <span className={styles.errorText}>{errors.userType}</span>}
              </div>

              {/* Show business fields only for Business Owner — 'Corporate' removed as backend doesn't support it */}
              {userType === 'Business Owner' && (
                <>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Business Name</label>
                    <input type="text" placeholder="e.g., Priya Textiles" className={styles.input} value={businessName} onChange={(e) => setBusinessName(e.target.value)} disabled={isSubmitting} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Business Type</label>
                    <input type="text" placeholder="e.g., Sole Proprietorship" className={styles.input} value={businessType} onChange={(e) => setBusinessType(e.target.value)} disabled={isSubmitting} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>GST Number</label>
                    <input type="text" placeholder="29ABCDE..." className={styles.input} value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} disabled={isSubmitting} />
                  </div>
                </>
              )}

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Membership Type</label>
                <select className={styles.input} value={membershipType} onChange={(e) => setMembershipType(e.target.value)} disabled={isSubmitting}>
                  <option value="Free">Free</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Wallet Balance (₹)</label>
                <input type="text" placeholder="500.00" className={styles.input} value={walletBalance} onChange={(e) => setWalletBalance(e.target.value)} disabled={isSubmitting} />
              </div>

              <div className={styles.fieldGroup} style={{ display: 'flex', gap: '2rem', alignItems: 'center', paddingTop: '1rem' }}>
                <label className={styles.notificationOption}>
                  <input type="checkbox" className={styles.checkbox} checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={isSubmitting} />
                  <span>Is Active</span>
                </label>
                <label className={styles.notificationOption}>
                  <input type="checkbox" className={styles.checkbox} checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} disabled={isSubmitting} />
                  <span>Is Verified</span>
                </label>
              </div>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h2 className={styles.sectionTitle}>Step 3: Choose Industries</h2>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Industries (Hold Ctrl/Cmd to select multiple)</label>
              <select 
                multiple
                className={styles.input}
                style={{ height: '200px', padding: '0.5rem' }}
                value={selectedIndustries.map(String)}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
                  setSelectedIndustries(values);
                }}
                disabled={isSubmitting || industriesList.length === 0}
              >
                {industriesList.length === 0 && <option disabled>Loading industries...</option>}
                {industriesList.map((ind: any, i: number) => (
                  <option key={ind.industry_id || ind.id || `ind-${i}`} value={ind.industry_id || ind.id}>{ind.name}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {currentStep === 4 && (
          <>
            <h2 className={styles.sectionTitle}>Step 4: Choose Services</h2>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Services (Hold Ctrl/Cmd to select multiple)</label>
              <select 
                multiple
                className={styles.input}
                style={{ height: '200px', padding: '0.5rem' }}
                value={selectedServices.map(String)}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
                  setSelectedServices(values);
                }}
                disabled={isSubmitting || servicesList.length === 0}
              >
                {servicesList.length === 0 && <option disabled>Loading services...</option>}
                {servicesList.map((serv: any, i: number) => (
                  <option key={serv.service_id || serv.id || `srv-${i}`} value={serv.service_id || serv.id}>{serv.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <label className={styles.notificationOption}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e.target.checked)}
                  disabled={isSubmitting}
                />
                <span>Send welcome notification to user</span>
              </label>
            </div>
          </>
        )}

      </form>
    </div>
  );
}
