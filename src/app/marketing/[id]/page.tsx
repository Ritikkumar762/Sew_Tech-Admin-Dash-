'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient, ENDPOINTS } from '@/lib';

const MOCK_BANNER_DETAILS: Record<string, any> = {
  'banner-1': {
    name: 'ST Spares Banner 1',
    carousel: false,
    linkTo: 'ST Spares',
    openType: 'Spare',
    spareId: 'CTEC 300U',
    categoryId: 'Sewing Machine Spares',
    machineId: 'Lockstitch Machine',
    externalLink: '',
    targetAudience: 'Gold Members',
    startDate: '28.02.2026, 01:00-02:00 PM',
    endDate: '28.02.2026, 01:00-02:00 PM'
  },
  'banner-2': {
    name: 'ST Spares Banner 2',
    carousel: false,
    linkTo: 'ST Spares',
    openType: 'Spare',
    spareId: 'Brother S-7200C',
    categoryId: 'Sewing Machine Spares',
    machineId: 'Lockstitch Machine',
    externalLink: '',
    targetAudience: 'Gold Members',
    startDate: '28.02.2026, 01:00-02:00 PM',
    endDate: '28.02.2026, 01:00-02:00 PM'
  },
  'banner-3': {
    name: 'ST Spares Banner 3',
    carousel: false,
    linkTo: 'ST Mechanic',
    openType: 'Service',
    spareId: 'Full Service',
    categoryId: 'Sewing Machine Spares',
    machineId: 'Lockstitch Machine',
    externalLink: '',
    targetAudience: 'Gold Members',
    startDate: '28.02.2026, 01:00-02:00 PM',
    endDate: '28.02.2026, 01:00-02:00 PM'
  },
  'banner-4': {
    name: 'ST Spares Banner 4',
    carousel: false,
    linkTo: 'ST Spares',
    openType: 'Spare',
    spareId: 'Juki DDL-9000B',
    categoryId: 'Sewing Machine Spares',
    machineId: 'Lockstitch Machine',
    externalLink: '',
    targetAudience: 'Gold Members',
    startDate: '28.02.2026, 01:00-02:00 PM',
    endDate: '28.02.2026, 01:00-02:00 PM'
  },
  'banner-5': {
    name: 'ST Spares Banner 5',
    carousel: false,
    linkTo: 'ST Spares',
    openType: 'Spare',
    spareId: 'CTEC 300U',
    categoryId: 'Sewing Machine Spares',
    machineId: 'Lockstitch Machine',
    externalLink: '',
    targetAudience: 'Gold Members',
    startDate: '28.02.2026, 01:00-02:00 PM',
    endDate: '28.02.2026, 01:00-02:00 PM'
  },
  'banner-6': {
    name: 'ST Spares Banner 6',
    carousel: false,
    linkTo: 'ST Spares',
    openType: 'Spare',
    spareId: 'Brother S-7200C',
    categoryId: 'Sewing Machine Spares',
    machineId: 'Lockstitch Machine',
    externalLink: '',
    targetAudience: 'Gold Members',
    startDate: '28.02.2026, 01:00-02:00 PM',
    endDate: '28.02.2026, 01:00-02:00 PM'
  },
  'banner-7': {
    name: 'ST Spares Banner 7',
    carousel: false,
    linkTo: 'ST Spares',
    openType: 'Spare',
    spareId: 'Juki DDL-9000B',
    categoryId: 'Sewing Machine Spares',
    machineId: 'Lockstitch Machine',
    externalLink: '',
    targetAudience: 'Gold Members',
    startDate: '28.02.2026, 01:00-02:00 PM',
    endDate: '28.02.2026, 01:00-02:00 PM'
  }
};

export default function BannerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bannerIdParam = params?.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [creativeDetails, setCreativeDetails] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [step, setStep] = useState<1 | 2 | 3>(1); // Changed default to 1 as per design flow
  const [carousel, setCarousel] = useState(false);

  // Interaction Form States
  const [linkTo, setLinkTo] = useState<string>('ST Spares');
  const [openType, setOpenType] = useState<string>('Spare');
  const [spareId, setSpareId] = useState<string>('ST Spares');
  const [categoryId, setCategoryId] = useState<string>('Sewing Machine Spares');
  const [machineId, setMachineId] = useState<string>('Lockstitch Machine');
  const [externalLink, setExternalLink] = useState<string>('');

  // Target Audience & Schedule States
  const [audience, setAudience] = useState<string>('Gold Members');
  const [startDate, setStartDate] = useState<string>('28.02.2026, 01:00-02:00 PM');
  const [endDate, setEndDate] = useState<string>('28.02.2026, 01:00-02:00 PM');

  const [loading, setLoading] = useState(false);

  // Fetch current banner details if id exists
  useEffect(() => {
    if (!bannerIdParam) return;

    // Pre-populate with mock details first
    const mockData = MOCK_BANNER_DETAILS[bannerIdParam];
    if (mockData) {
      setAudience(mockData.targetAudience || 'Gold Members');
      setStartDate(mockData.startDate || '28.02.2026, 01:00-02:00 PM');
      setEndDate(mockData.endDate || '28.02.2026, 01:00-02:00 PM');
      setCarousel(mockData.carousel || false);
      setLinkTo(mockData.linkTo || 'ST Spares');
      setOpenType(mockData.openType || 'Spare');
      setSpareId(mockData.spareId || 'ST Spares');
      setCategoryId(mockData.categoryId || 'Sewing Machine Spares');
      setMachineId(mockData.machineId || 'Lockstitch Machine');
      setExternalLink(mockData.externalLink || '');
    }

    // For mock IDs skip API fetch — mock data is already populated above
    if (bannerIdParam.startsWith('banner-')) {
      return;
    }

    const loadBannerDetails = async () => {
      setLoading(true);
      try {
        // Fetch from banners endpoint (not creatives)
        const response = await apiClient.get<{ success: boolean; data: any }>(ENDPOINTS.marketing.bannerById(bannerIdParam));
        if (response && response.success && response.data) {
          const c = response.data;
          setAudience(c.targetAudience || 'Gold Members');
          setStartDate(c.startDate || '28.02.2026, 01:00-02:00 PM');
          setEndDate(c.endDate || '28.02.2026, 01:00-02:00 PM');
          setCarousel(c.carousel || false);
          setLinkTo(c.linkTo || 'ST Spares');
          setOpenType(c.openType || 'Spare');
          setSpareId(c.spareId || 'ST Spares');
          setCategoryId(c.categoryId || 'Sewing Machine Spares');
          setMachineId(c.machineId || 'Lockstitch Machine');
          setExternalLink(c.externalLink || '');
          setCreativeDetails(c);
        }
      } catch (err) {
        console.error('Failed to fetch banner details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBannerDetails();
  }, [bannerIdParam]);

  // Handle Publish/Update — PUT /marketing/banners/{id}
  const handlePublish = async () => {
    setLoading(true);
    try {
      const isMockId = bannerIdParam.startsWith('banner-');

      if (!isMockId) {
        // Real DB banner — update scheduling/targeting fields
        const payload = {
          targetAudience: audience,
          startDate,
          endDate,
          carousel,
          linkTo,
          openType,
          spareId:      spareId      || null,
          categoryId:   categoryId   || null,
          machineId:    machineId    || null,
          externalLink: externalLink || null,
          status: 'Active',
        };
        await apiClient.put(ENDPOINTS.marketing.bannerById(bannerIdParam), payload);
      }
      // For mock IDs: no API call needed, just navigate back
      router.push('/marketing');
    } catch (err) {
      console.error('Error updating banner:', err);
      router.push('/marketing');
    } finally {
      setLoading(false);
    }
  };

  const hasOpenField = (link: string) => {
    return !['External Link', 'Open Service Category'].includes(link);
  };

  const getOpenOptions = (link: string) => {
    switch (link) {
      case 'ST Spares':
        return [
          { label: 'Spares', value: 'Spare' },
          { label: 'Category', value: 'Category' },
          { label: 'Machine', value: 'Machine' }
        ];
      case 'ST Mechanic':
        return [
          { label: 'Service', value: 'Service' },
          { label: 'Category', value: 'Category' },
          { label: 'Mechanic', value: 'Mechanic' }
        ];
      case 'ST Exchange':
      case 'ST Kaarigar':
        return [
          { label: 'Default', value: 'Default' },
          { label: 'Category', value: 'Category' }
        ];
      case 'ST Academics':
        return [
          { label: 'Course', value: 'Course' },
          { label: 'Category', value: 'Category' }
        ];
      default:
        return [{ label: 'Default', value: 'Default' }];
    }
  };

  const renderThirdField = (link: string, open: string) => {
    if (!hasOpenField(link)) return null;

    let label = '';
    let value = '';
    let onChange = (val: string) => {};
    let options: string[] = [];

    if (link === 'ST Spares') {
      if (open === 'Spare') {
        label = 'Add Spare ID';
        value = spareId;
        onChange = setSpareId;
        options = ['ST Spares', 'CTEC 300U', 'Brother S-7200C', 'Juki DDL-9000B'];
      } else if (open === 'Category') {
        label = 'Add Category ID';
        value = categoryId;
        onChange = setCategoryId;
        options = ['Sewing Machine Spares', 'Embroidery Spares', 'Cutting Machine Spares'];
      } else if (open === 'Machine') {
        label = 'Add Machine ID';
        value = machineId;
        onChange = setMachineId;
        options = ['Lockstitch Machine', 'Overlock Machine', 'Interlock Machine'];
      }
    } else if (link === 'ST Mechanic') {
      if (open === 'Service') {
        label = 'Add Service ID';
        value = spareId;
        onChange = setSpareId;
        options = ['Full Service', 'Part Repair', 'Installation', 'Maintenance'];
      } else if (open === 'Category') {
        label = 'Add Category ID';
        value = categoryId;
        onChange = setCategoryId;
        options = ['Standard Mechanic', 'Industrial Mechanic', 'Heavy Duty Mechanic'];
      } else if (open === 'Mechanic') {
        label = 'Add Mechanic ID';
        value = machineId;
        onChange = setMachineId;
        options = ['John Doe (ID: 101)', 'Jane Smith (ID: 102)', 'Bob Johnson (ID: 103)'];
      }
    } else if (link === 'ST Exchange' && open === 'Category') {
      label = 'Add Category ID';
      value = categoryId;
      onChange = setCategoryId;
      options = ['Exchange Program A', 'Exchange Program B'];
    } else if (link === 'ST Kaarigar' && open === 'Category') {
      label = 'Add Category ID';
      value = categoryId;
      onChange = setCategoryId;
      options = ['Tailoring Category', 'Embroidery Category'];
    } else if (link === 'ST Academics') {
      if (open === 'Course') {
        label = 'Add Course ID';
        value = spareId;
        onChange = setSpareId;
        options = ['Advanced Embroidery', 'Sewing Basics', 'Pattern Making'];
      } else if (open === 'Category') {
        label = 'Add Category ID';
        value = categoryId;
        onChange = setCategoryId;
        options = ['Beginner Courses', 'Advanced Courses'];
      }
    }

    if (!label) return null;

    return (
      <div style={{ marginTop: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
          {label} <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <select 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', appearance: 'none', background: '#fff', fontWeight: 500, color: '#111827' }}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
    );
  };

  const getPreviewData = () => {
    if (linkTo === 'ST Spares') {
      if (openType === 'Spare') {
        if (spareId === 'Brother S-7200C') {
          return {
            sub: 'Direct Drive Lockstitch',
            title: 'Brother S-7200C',
            footer: '100% Original | Made in Japan'
          };
        } else if (spareId === 'Juki DDL-9000B') {
          return {
            sub: 'High Speed Lockstitch',
            title: 'Juki DDL-9000B',
            footer: '100% Original | Made in Japan'
          };
        } else if (spareId === 'CTEC 300U') {
          return {
            sub: 'Mattress Tape Edge',
            title: 'CTEC 300U',
            footer: '100% Original | Made in Taiwan'
          };
        } else {
          return {
            sub: 'Sewtech Spares',
            title: spareId,
            footer: 'Premium Quality Spares'
          };
        }
      } else if (openType === 'Category') {
        return {
          sub: 'Category Special',
          title: categoryId,
          footer: 'All major brands available'
        };
      } else if (openType === 'Machine') {
        return {
          sub: 'Machine Specific Spares',
          title: machineId,
          footer: 'Optimal performance guaranteed'
        };
      }
    } else if (linkTo === 'ST Mechanic') {
      return {
        sub: 'Expert Sewtech Mechanics',
        title: openType === 'Mechanic' ? machineId : openType === 'Category' ? categoryId : spareId,
        footer: 'On-demand professional service'
      };
    } else if (linkTo === 'External Link' || linkTo === 'Open Service Category') {
      return {
        sub: 'Special Campaign',
        title: externalLink || 'Visit External Link',
        footer: 'Exclusive deals & offers'
      };
    }
    
    return {
      sub: 'Mattress Tape Edge',
      title: 'CTEC 300U',
      footer: '100% Original | Made in Taiwan'
    };
  };

  const previewData = getPreviewData();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <button 
            onClick={() => router.back()} 
            style={{ 
              background: 'none', 
              cursor: 'pointer', 
              padding: '0.25rem', 
              marginRight: '0.5rem', 
              color: '#6b7280',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '1px solid #e5e7eb',
              width: '28px',
              height: '28px',
              verticalAlign: 'middle'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {bannerIdParam === 'banner-hs-1' ? 'Hero Banner — Summer Sale' : (MOCK_BANNER_DETAILS[bannerIdParam]?.name || 'ST Spares Banner 1')}
            </h1>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Ads & Marketing <span style={{ margin: '0 0.5rem' }}>•</span> All Banners <span style={{ margin: '0 0.5rem' }}>•</span> <span style={{ fontWeight: 600, color: '#111827' }}>{bannerIdParam === 'banner-hs-1' ? 'Hero Banner — Summer Sale' : (MOCK_BANNER_DETAILS[bannerIdParam]?.name || 'ST Spares Banner 1')}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => router.push('/marketing')}
            style={{ border: '1px solid #ef4444', color: '#ef4444', background: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Discard
          </button>
          {step < 3 ? (
            <button onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)} style={{ background: '#111827', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Next <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ) : (
            <button onClick={handlePublish} disabled={loading} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Publishing...' : 'Publish Banner'} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem', color: '#9ca3af', fontWeight: 600 }}>
        {/* Step 1 */}
        <div 
          onClick={() => setStep(1)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step === 1 ? '#111827' : '#9ca3af', cursor: 'pointer' }}
        >
          <div style={{ 
            width: '24px', 
            height: '24px', 
            borderRadius: '50%', 
            background: step === 1 ? '#111827' : '#e5e7eb', 
            color: step === 1 ? '#fff' : '#6b7280', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.75rem',
            fontWeight: 700
          }}>1</div>
          <span style={{ fontWeight: step === 1 ? 700 : 500 }}>
            {step === 3 && linkTo === 'External Link' ? 'Add Banner' : 'Add Creative'}
          </span>
        </div>
        
        {/* Line 1 */}
        <div style={{ flex: '0 0 100px', height: '1px', background: '#e5e7eb' }}></div>
        
        {/* Step 2 */}
        <div 
          onClick={() => setStep(2)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step === 2 ? '#111827' : '#9ca3af', cursor: 'pointer' }}
        >
          <div style={{ 
            width: '24px', 
            height: '24px', 
            borderRadius: '50%', 
            background: step === 2 ? '#111827' : '#e5e7eb', 
            color: step === 2 ? '#fff' : '#6b7280', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.75rem',
            fontWeight: 700
          }}>2</div>
          <span style={{ fontWeight: step === 2 ? 700 : 500 }}>Edit Details</span>
        </div>
        
        {/* Line 2 */}
        <div style={{ flex: '0 0 100px', height: '1px', background: '#e5e7eb' }}></div>
        
        {/* Step 3 */}
        <div 
          onClick={() => setStep(3)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step === 3 ? '#111827' : '#9ca3af', cursor: 'pointer' }}
        >
          <div style={{ 
            width: '24px', 
            height: '24px', 
            borderRadius: '50%', 
            background: step === 3 ? '#111827' : '#e5e7eb', 
            color: step === 3 ? '#fff' : '#6b7280', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.75rem',
            fontWeight: 700
          }}>3</div>
          <span style={{ fontWeight: step === 3 ? 700 : 500 }}>Preview</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Form Pane */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {step === 1 && (
            <>
              {/* Add Creative Card */}
              <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
                <div 
                  onClick={() => setCarousel(!carousel)}
                  style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer', userSelect: 'none' }}
                >
                  <input 
                    type="checkbox" 
                    checked={carousel}
                    onChange={(e) => setCarousel(e.target.checked)}
                    style={{ accentColor: '#3b82f6', width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer' }} 
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>Carousel</span>
                </div>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #3b82f6', borderRadius: '0.5rem', padding: uploadedImage ? '0' : '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eff6ff', cursor: 'pointer', position: 'relative', overflow: 'hidden', minHeight: '200px' }}
                >
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Uploaded Creative" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.15)', pointerEvents: 'none' }}>
                      Select From Saved Creatives
                    </button>
                  )}
                </div>
              </div>

              {/* Interaction details have been hidden to match UI flow exactly */}
            </>
          )}

          {/* In the design, step 2 and 3 both display the edit details form */}
          {(step === 2 || step === 3) && (
            <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Edit Details</h2>
              <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 2rem 0' }}></div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                  Select Target Audience <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', appearance: 'none', background: '#fff', fontWeight: 500, color: '#111827' }}
                  >
                    <option value="Gold Members">Gold Members</option>
                    <option value="All Users">All Users</option>
                    <option value="Silver Members">Silver Members</option>
                  </select>
                  <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                    Start Date & Time <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#111827' }} 
                    />
                    <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                    End Date & Time <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#111827' }} 
                    />
                    <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview Pane */}
        <div style={{ flex: 1, background: '#eff6ff', borderRadius: '0.75rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 700, fontSize: '1.125rem', color: '#111827' }}>Preview</h3>
          
          {/* Mobile Mockup - Figma-Matched Device Frame */}
          <div style={{ 
            position: 'relative',
            width: '290.71px', 
            height: '540px',
            background: '#000000',
            borderRadius: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            boxSizing: 'border-box',
            border: '8.14px solid #000000',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Screen Container */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: '#111827',
            }}>
              <img 
                src="/Machine Spares Home Screen (1).svg" 
                alt="App Preview Screen" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'blur(1px)'
                }} 
              />

              {/* Dynamic Banner Overlay */}
              <div style={{
                position: 'absolute',
                left: '4%',
                top: '17.8%',
                width: '92%',
                height: '17.3%',
                background: 'linear-gradient(to bottom, #FF4778, #F31546)',
                borderRadius: '0.5rem',
                padding: '0.6rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#fff',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}>
                {/* Left Content */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.45rem', fontWeight: 400, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {previewData.sub}
                  </span>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '4px 0 3px 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {previewData.title}
                  </h4>
                  <span style={{ fontSize: '0.4rem', opacity: 0.75, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {previewData.footer}
                  </span>
                </div>

                {/* Right Image */}
                <div style={{
                  position: 'relative',
                  height: '120%',
                  width: '48%',
                  flexShrink: 0,
                  marginRight: '-1%',
                  alignSelf: 'flex-start'
                }}>
                  <img 
                    src={uploadedImage || creativeDetails?.imageUrl || "/machine.png"} 
                    alt="Spare Part" 
                    style={{ 
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      height: '100%',
                      width: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center center',
                      zIndex: 1
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
