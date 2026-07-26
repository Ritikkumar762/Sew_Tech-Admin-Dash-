'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useUsers } from '../../_hooks/useUsers';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  ChevronDown, 
  X,
  MoreVertical
} from 'lucide-react';

// Help parse custom dob string ("21 Jan' 1990") to input date format (YYYY-MM-DD)
function parseDobToInputDate(dobStr?: string): string {
  if (!dobStr) return '';
  try {
    const cleanStr = dobStr.replace("'", "").replace(/\s+/g, ' ').trim();
    const parts = cleanStr.split(' ');
    if (parts.length >= 3) {
      const day = parts[0].padStart(2, '0');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIndex = monthNames.indexOf(parts[1]);
      const month = monthIndex >= 0 ? String(monthIndex + 1).padStart(2, '0') : '01';
      const year = parts[2];
      if (year.length === 4 && !isNaN(Number(year))) {
        return `${year}-${month}-${day}`;
      }
    }
  } catch (e) {}
  return '';
}

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { users, loading, updateUser } = useUsers();

  // Find user
  const user = useMemo(() => {
    return users.find((u) => u.id === id);
  }, [users, id]);

  // ── Form States ─────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const [userType, setUserType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  // UI States
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Available options
  const languageOptions = ['English', 'Hindi', 'Punjabi', 'Bengali', 'Tamil', 'Telugu', 'Gujarati', 'Marathi'];
  const businessTypes = ['Demo Type', 'Retail', 'Wholesale', 'Service Provider', 'Manufacturer'];
  const rolesList = [
    'Customer',
    'Buyer',
    'Seller',
    'Admin',
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
  const userTypesList = ['Individual', 'Business Owner', 'Partner', 'Corporate'];

  // Initialize form fields once user details load
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      // Clean prefix from phone for display if needed
      setPhone(user.phone.replace('+91 ', ''));
      setDob(parseDobToInputDate(user.dob));
      setLocation(user.location || (user as any).city || '');
      
      // Parse language string into tags array
      const langArray = user.selectedLanguage 
        ? user.selectedLanguage.split(',').map((l: string) => l.trim())
        : [];
      setLanguages(langArray);
      
      setRole(user.role);
      setUserType(user.userType || user.typeOfUser || 'Individual');
      setBusinessName(user.businessName || '');
      setBusinessType(user.businessType || 'Demo Type');
      setGstNumber(user.gstNumber || '');
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading user profile...
      </div>
    );
  }

  if (!user) {
    return notFound();
  }

  // ── Handlers ────────────────────────────────────────────────
  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(prev => prev.filter(l => l !== lang));
    } else {
      setLanguages(prev => [...prev, lang]);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address.';
    }
    
    if (!phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phone.trim().replace(/[^\d]/g, ''))) {
      errs.phone = 'Enter a valid 10-digit number.';
    }

    if (!role) errs.role = 'Role is required.';
    if (!userType) errs.userType = 'User type is required.';

    if (userType === 'Business Owner') {
      if (!businessName.trim()) errs.businessName = 'Business name is required.';
      if (!businessType) errs.businessType = 'Business type is required.';
      if (!gstNumber.trim()) errs.gstNumber = 'GST Number is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setGeneralError(null);

    try {
      // Format phone prefix
      const cleanPhone = phone.trim().replace(/[^\d]/g, '');
      const formattedPhone = `+91 ${cleanPhone}`;

      // Format DOB date YYYY-MM-DD -> 21 Jan' 1990
      let formattedDob = user.dob;
      if (dob) {
        const dateObj = new Date(dob);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        formattedDob = `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]}' ${dateObj.getFullYear()}`;
      }

      const isCust = role === 'Customer';
      await updateUser(user.id, {
        email: email.trim().toLowerCase(),
        phone: formattedPhone,
        dob: formattedDob,
        location: location.trim(),
        selectedLanguage: languages.join(', '),
        role,
        userType: isCust ? userType : 'Individual',
        typeOfUser: isCust ? userType : 'Individual',
        businessName: (isCust && userType === 'Business Owner') ? businessName.trim() : undefined,
        businessType: (isCust && userType === 'Business Owner') ? businessType : undefined,
        gstNumber: (isCust && userType === 'Business Owner') ? gstNumber.trim() : undefined
      });

      // Redirect back to profile page
      router.push(`/users/${user.id}`);
    } catch (err: any) {
      setGeneralError(err?.message || 'Failed to update user profile. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  let idLabel = 'Customer ID';
  if (user.role.toLowerCase().includes('mechanic')) idLabel = 'Mehcanic ID';
  else if (user.role.toLowerCase().includes('kaarigar')) idLabel = 'Kaarigar ID';
  else if (user.role.toLowerCase().includes('admin')) idLabel = 'Admin ID';
  else if (user.role.toLowerCase().includes('audit')) idLabel = 'Audit ID';

  return (
    <div className={styles.container}>
      {/* Header white Card */}
      <div className={styles.headerCard}>
        <div className={styles.profileInfo}>
          <button 
            type="button" 
            className={styles.backArrow}
            onClick={() => router.push(`/users/${user.id}`)}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className={styles.profileTitleArea}>
            <span className={styles.profileName}>{user.name}</span>
            <div 
              className={`${styles.copyIdBadge} ${copiedId === user.id ? styles.copySuccess : ''}`}
              onClick={handleCopyId}
            >
              {copiedId === user.id ? (
                <>Copied! <Check size={12} /></>
              ) : (
                <>{idLabel} <Copy size={12} /></>
              )}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.discardBtn}
            onClick={() => router.push(`/users/${user.id}`)}
            disabled={isSaving}
          >
            Discard
          </button>
          <button 
            type="submit" 
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Details'}
          </button>
        </div>
      </div>

      {generalError && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '8px' }}>
          {generalError}
        </div>
      )}

      {/* Form Card Grid */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {role === 'Mechanic' && (
          <div className={styles.formCard}>
            <h2 className={styles.sectionTitle}>Active Services</h2>
            <div className={styles.activeServicesRow}>
              <div className={`${styles.servicePill} ${styles.serviceOrange}`}>
                <span className={styles.serviceIcon}></span> Video Call Assistance <MoreVertical size={14} className={styles.serviceMore} />
              </div>
              <div className={`${styles.servicePill} ${styles.serviceGreen}`}>
                <span className={styles.serviceIcon}></span> Instant Smart Booking <MoreVertical size={14} className={styles.serviceMore} />
              </div>
              <div className={`${styles.servicePill} ${styles.serviceCyan}`}>
                <span className={styles.serviceIcon}></span> Invite Quote <MoreVertical size={14} className={styles.serviceMore} />
              </div>
            </div>
          </div>
        )}

        <div className={styles.formCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Basic Details</h2>
            {role === 'Mechanic' && (
              <select className={styles.input} style={{ width: '120px', padding: '0.35rem 0.75rem', height: 'auto' }}>
                <option value="Live">Live</option>
                <option value="Offline">Offline</option>
              </select>
            )}
          </div>

          <div className={styles.formGrid}>
          {/* Email ID Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Email <span className={styles.required}>*</span>
            </label>
            <input 
              type="email" 
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSaving}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          {/* Phone Number Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Phone Number <span className={styles.required}>*</span>
            </label>
            <input 
              type="text" 
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSaving}
            />
            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
          </div>

          {/* DOB Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>DOB *</label>
            <input 
              type="date" 
              className={styles.input}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={isSaving}
            />
          </div>

          {/* Location / City Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Location / City</label>
            <input 
              type="text" 
              className={styles.input}
              placeholder="e.g. New Delhi, Mumbai"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isSaving}
            />
          </div>

          {/* Selected Language Tags Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Selected Language <span className={styles.required}>*</span>
            </label>
            <div className={styles.dropdownSelectWrapper}>
              <div 
                className={styles.multiSelectTrigger}
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              >
                <div className={styles.tagsRow}>
                  {languages.length === 0 ? (
                    <span style={{ color: '#94a3b8' }}>Select languages</span>
                  ) : (
                    languages.map(lang => (
                      <span key={lang} className={styles.langTag}>
                        {lang}
                        <button 
                          type="button" 
                          className={styles.langTagRemove}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLanguage(lang);
                          }}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <ChevronDown size={14} style={{ color: '#64748b' }} />
              </div>

              {isLangDropdownOpen && (
                <div className={styles.dropdownOptions}>
                  {languageOptions.map(option => {
                    const isSelected = languages.includes(option);
                    return (
                      <div 
                        key={option}
                        className={`${styles.dropdownOptionItem} ${isSelected ? styles.dropdownOptionItemActive : ''}`}
                        onClick={() => handleToggleLanguage(option)}
                      >
                        <span>{option}</span>
                        {isSelected && <Check size={14} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Role Dropdown - Only if not Mechanic, as Mechanic role is fixed for this view or can be changed but let's keep it */}
          {role !== 'Mechanic' && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Role <span className={styles.required}>*</span>
              </label>
              <select 
                className={styles.input}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isSaving}
              >
                {rolesList.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.role && <span className={styles.errorText}>{errors.role}</span>}
            </div>
          )}

          {/* User Type Dropdown */}
          {role === 'Customer' && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Type of user <span className={styles.required}>*</span>
              </label>
              <select 
                className={styles.input}
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                disabled={isSaving}
              >
                {userTypesList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.userType && <span className={styles.errorText}>{errors.userType}</span>}
            </div>
          )}
          </div>
        </div>

        {role === 'Mechanic' && (
          <div className={styles.formCard}>
            <h2 className={styles.sectionTitle}>Profile Details</h2>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.label}>Bio <span className={styles.required}>*</span></label>
                <div className={styles.richTextEditor}>
                  <div className={styles.richTextToolbar}>
                    <span>14 ▼</span>
                    <span style={{ fontWeight: 'bold' }}>T</span>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#1e293b', display: 'inline-block' }}></span>
                    <span style={{ fontWeight: 'bold' }}>B</span>
                    <span style={{ fontStyle: 'italic' }}>I</span>
                    <span style={{ textDecoration: 'underline' }}>U</span>
                    <span>S</span>
                    <span>≡</span>
                    <span>🔗</span>
                    <span>☷</span>
                  </div>
                  <textarea 
                    className={styles.richTextArea} 
                    placeholder="Add Body to your post"
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna."
                  />
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', padding: '0.25rem 0.5rem' }}>50/200</div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Experience (in years) <span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} defaultValue="12" />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Availability <span className={styles.required}>*</span></label>
                <select className={styles.input}>
                  <option>Demo Manufacturer</option>
                  <option>Mon, Tue, Wed, Thu, Fri</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Location Preference: <span className={styles.required}>*</span></label>
                <div className={styles.dropdownSelectWrapper}>
                  <div className={styles.multiSelectTrigger}>
                    <div className={styles.tagsRow}>
                      <span className={styles.langTag}>Delhi NCR <X size={10} style={{ marginLeft: '0.25rem', cursor: 'pointer' }} /></span>
                    </div>
                    <ChevronDown size={14} style={{ color: '#64748b' }} />
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Skills: <span className={styles.required}>*</span></label>
                <div className={styles.dropdownSelectWrapper}>
                  <div className={styles.multiSelectTrigger}>
                    <div className={styles.tagsRow}>
                      <span className={styles.langTag}>Skill Tag 1 <X size={10} style={{ marginLeft: '0.25rem', cursor: 'pointer' }} /></span>
                    </div>
                    <ChevronDown size={14} style={{ color: '#64748b' }} />
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.label}>Machines/ Brands familiar with: <span className={styles.required}>*</span></label>
                <div className={styles.dropdownSelectWrapper}>
                  <div className={styles.multiSelectTrigger}>
                    <div className={styles.tagsRow}>
                      <span className={styles.langTag}>Machine Tag 1 <X size={10} style={{ marginLeft: '0.25rem', cursor: 'pointer' }} /></span>
                    </div>
                    <ChevronDown size={14} style={{ color: '#64748b' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.pitchesGrid} style={{ marginTop: '2rem' }}>
              <div className={styles.pitchCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 className={styles.pitchTitle} style={{ marginBottom: 0 }}>Mechanic Audio Pitch</h3>
                  <button type="button" className={styles.deletePitchBtn}>Delete Pitch 🗑</button>
                </div>
                <div className={styles.audioPlayerPlaceholder}>
                  <div className={styles.audioTrack}>
                    <div className={styles.audioProgress}></div>
                    <div className={styles.audioThumb}></div>
                  </div>
                  <div className={styles.audioTimes}>
                    <span>02:30</span>
                    <span>03:30</span>
                  </div>
                  <div className={styles.audioControls}>
                    <div className={styles.audioControlIcon}></div>
                    <div className={styles.audioControlIcon}></div>
                    <div className={styles.audioPlayBtn}></div>
                    <div className={styles.audioControlIcon}></div>
                    <div className={styles.audioControlIcon}></div>
                  </div>
                </div>
              </div>

              <div className={styles.pitchCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 className={styles.pitchTitle} style={{ marginBottom: 0 }}>Mechanic Video Pitch</h3>
                  <button type="button" className={styles.deletePitchBtn}>Delete Pitch 🗑</button>
                </div>
                <div className={styles.videoPlayerPlaceholder}>
                  <div className={styles.videoPlayBtn}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Details Section - Shown conditionally if User Type is Business Owner and role is Customer */}
        {role === 'Customer' && userType === 'Business Owner' && (
          <div className={styles.formCard}>
            <h2 className={styles.sectionTitle}>Business Details</h2>
            <div className={styles.formGrid}>
              {/* Business Name Field */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Business Name <span className={styles.required}>*</span>
                </label>
                <input 
                  type="text" 
                  className={styles.input}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={isSaving}
                />
                {errors.businessName && <span className={styles.errorText}>{errors.businessName}</span>}
              </div>

              {/* Type of Business Dropdown */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Type of Business <span className={styles.required}>*</span>
                </label>
                <select 
                  className={styles.input}
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  disabled={isSaving}
                >
                  {businessTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.businessType && <span className={styles.errorText}>{errors.businessType}</span>}
              </div>

              {/* GST Number Field */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  GST Number <span className={styles.required}>*</span>
                </label>
                <input 
                  type="text" 
                  className={styles.input}
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  disabled={isSaving}
                />
                {errors.gstNumber && <span className={styles.errorText}>{errors.gstNumber}</span>}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
