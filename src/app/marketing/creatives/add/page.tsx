'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient, ENDPOINTS } from '@/lib';

function AddCreativeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams ? searchParams.get('editId') : null;

  // Step state
  const [step, setStep] = useState<1 | 2>(1);

  // Creative Info Form States
  const [bannerType, setBannerType] = useState<string>('Hero Banner');
  const [title, setTitle] = useState<string>('Mechanics');
  const [subheader, setSubheader] = useState<string>('Banner 1');
  const [body, setBody] = useState<string>('Banner 1');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileNameUrl] = useState<string | null>(null);

  // Interaction Form States
  const [linkTo, setLinkTo] = useState<string>('ST Spares');
  const [openType, setOpenType] = useState<string>('Spare');
  const [spareId, setSpareId] = useState<string>('ST Spares');
  const [categoryId, setCategoryId] = useState<string>('Sewing Machine Spares');
  const [machineId, setMachineId] = useState<string>('Lockstitch Machine');
  const [externalLink, setExternalLink] = useState<string>('');

  // Selected Label (PROMOTION, Sale, NEW COLLECTION, SALE up to 50% Off)
  const [selectedLabel, setSelectedLabel] = useState<string>('PROMOTION');

  const [loading, setLoading] = useState(false);

  // Load existing details if editing
  useEffect(() => {
    if (!editId) return;

    const loadCreativeDetails = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<{ success: boolean; data: any }>(ENDPOINTS.marketing.creativeById(editId));
        if (response && response.success && response.data) {
          const c = response.data;
          setTitle(c.title || '');
          setSubheader(c.subheader || '');
          setBody(c.body || '');
          setBannerType(c.bannerType || 'Hero Banner');
          setUploadedFileName(c.uploadedFileName || 'brand-logo-square.jpg');
          setUploadedFileNameUrl(c.imageUrl || null);
          setLinkTo(c.linkTo || 'ST Spares');
          setOpenType(c.openType || 'Spare');
          setSpareId(c.spareId || 'ST Spares');
          setCategoryId(c.categoryId || 'Sewing Machine Spares');
          setMachineId(c.machineId || 'Lockstitch Machine');
          setExternalLink(c.externalLink || '');
          setSelectedLabel(c.label || 'PROMOTION');
        }
      } catch (err) {
        console.warn('Backend server offline. Carrying out local mock edit state.');
        // Fallback mock values
        setTitle('Mattress Tape Edge');
        setSubheader('CTEC 300U');
        setBody('100% Original | Made in Taiwan');
        setBannerType('Hero Banner');
        setUploadedFileName('brand-logo-square.jpg');
        setLinkTo('ST Spares');
        setOpenType('Spare');
        setSelectedLabel('PROMOTION');
      } finally {
        setLoading(false);
      }
    };

    loadCreativeDetails();
  }, [editId]);

  // Handle file uploading
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setUploadedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Perform multipart request via native fetch referencing our endpoints structure
      const response = await fetch(ENDPOINTS.marketing.upload, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setUploadedFileNameUrl(json.data.imageUrl);
          setUploadedFileName(json.data.fileName || file.name);
        }
      }
    } catch (err) {
      console.error('Failed to upload file to backend. Standard local mock fallback applied.', err);
      // Fallback
      setUploadedFileName(file.name);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCreative = async () => {
    setLoading(true);
    try {
      // Build the exact payload schema structure as expected by FastAPI backend Pydantic model
      const payload = {
        name: editId ? title : `${title} – ${new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}`,
        bannerType,
        title,
        subheader,
        body,
        imageUrl: uploadedFileUrl || (uploadedFileName ? `/static/${uploadedFileName}` : ''),
        label: selectedLabel || null,
        linkTo,
        openType,
        spareId: spareId || null,
        categoryId: categoryId || null,
        machineId: machineId || null,
        externalLink: externalLink || null
      };

      if (editId) {
        await apiClient.put(ENDPOINTS.marketing.creativeById(editId), payload);
      } else {
        await apiClient.post(ENDPOINTS.marketing.creatives, payload);
      }
      router.push('/marketing/creatives');
    } catch (err) {
      console.error('Error saving creative asset template:', err);
      // Re-throw the error so that Next.js Error Boundaries or the React form can catch and display the issue appropriately,
      // but without breaking the user experience during network timeouts
      throw err;
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

  // Label badge illustrations
  const labels = [
    { 
      id: 'PROMOTION', 
      name: 'PROMOTION', 
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
          <div style={{ 
            background: '#ef4444', 
            color: '#fff', 
            fontSize: '0.65rem', 
            fontWeight: 800, 
            padding: '6px 12px 10px 12px', 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            PROMOTION
          </div>
        </div>
      )
    },
    { 
      id: 'Sale', 
      name: 'Sale', 
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
          <div style={{ 
            width: '45px', 
            height: '45px', 
            background: '#ef4444', 
            borderRadius: '50%', 
            color: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            transform: 'rotate(-10deg)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '2px dashed #fff'
          }}>
            Sale
          </div>
        </div>
      )
    },
    { 
      id: 'NEW COLLECTION', 
      name: 'NEW COLLECTION', 
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100px', position: 'relative', width: '100%' }}>
          <div style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px', 
            background: '#ef4444', 
            color: '#fff', 
            fontSize: '0.5rem', 
            fontWeight: 800, 
            padding: '4px 14px', 
            transform: 'rotate(45deg) translate(10px, -8px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap'
          }}>
            NEW
          </div>
          <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 600 }}>Ribbon tag</div>
        </div>
      )
    },
    { 
      id: 'SALE up to 50%', 
      name: 'SALE up to 50% Off', 
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
          <div style={{ 
            background: '#ef4444', 
            color: '#fff', 
            fontSize: '0.6rem', 
            fontWeight: 800, 
            padding: '4px 8px', 
            borderRadius: '4px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            SALE
            <div style={{ fontSize: '0.5rem', fontWeight: 500, opacity: 0.9 }}>UP TO 50% OFF</div>
          </div>
        </div>
      )
    }
  ];

  const handleMockUpload = () => {
    setUploadedFileName('brand-logo-square.jpg');
  };

  const handleRemoveMockUpload = () => {
    setUploadedFileName(null);
  };

  return (
    <div>
      {/* Top Header Navigation */}
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Add Creative</h1>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Ads & Marketing <span style={{ margin: '0 0.5rem' }}>•</span> <span style={{ fontWeight: 600, color: '#111827' }}>Add Creative</span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => router.push('/marketing/creatives')}
            style={{ border: '1px solid #ef4444', color: '#ef4444', background: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Discard
          </button>
          
          {step === 1 ? (
            <button 
              onClick={() => setStep(2)} 
              style={{ background: '#111827', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Next <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ) : (
            <button 
              onClick={handleSaveCreative} 
              disabled={loading}
              style={{ background: '#111827', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Saving...' : 'Save Creative'} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Step Wizard Bar */}
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
          <span style={{ fontWeight: step === 1 ? 700 : 500 }}>Create Creative</span>
        </div>
        
        {/* Line */}
        <div style={{ flex: '0 0 100px', height: '1.5px', background: '#e5e7eb' }}></div>
        
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
          <span style={{ fontWeight: step === 2 ? 700 : 500 }}>Preview</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Form Column */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {step === 1 ? (
            <>
              {/* Creative Info form */}
              <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#111827' }}>Creative Info</h2>
                <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Banner Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                      Banner Type <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        value={bannerType}
                        onChange={(e) => setBannerType(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', appearance: 'none', background: '#fff', fontWeight: 500, color: '#111827' }}
                      >
                        <option value="Hero Banner">Hero Banner</option>
                        <option value="Banner">Banner</option>
                        <option value="Mini Banner">Mini Banner</option>
                      </select>
                      <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                      Title <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title"
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}
                    />
                  </div>

                  {/* Subheader */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                      Subheader <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text"
                      value={subheader}
                      onChange={(e) => setSubheader(e.target.value)}
                      placeholder="Subheader"
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                      Body <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Body"
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}
                    />
                  </div>

                  {/* Upload Banner Image */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                      Upload Banner Image <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    {uploadedFileName ? (
                      <div style={{ border: '1.5px solid #10b981', background: '#f0fdf4', borderRadius: '0.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        <button 
                          onClick={handleRemoveMockUpload}
                          style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                          title="Remove Image"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        </button>
                        <div style={{ width: '80px', height: '80px', background: 'linear-gradient(to right, #ec4899, #ef4444)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
                          B
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#047857', marginTop: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          {uploadedFileName}
                        </span>
                      </div>
                    ) : (
                      <div style={{ border: '2px dashed #3b82f6', borderRadius: '0.5rem', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#eff6ff', position: 'relative' }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} 
                        />
                        <button 
                          style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', position: 'relative', zIndex: 1 }}
                        >
                          Upload Banner
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        </button>
                        <span style={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.75rem', position: 'relative', zIndex: 1 }}>.jpg, .png (200×200px)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Interaction card */}
              <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#111827' }}>Add Interaction</h2>
                <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {/* Link To */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                      Link to <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        value={linkTo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLinkTo(val);
                          if (val === 'ST Spares') setOpenType('Spare');
                          else if (val === 'ST Mechanic') setOpenType('Service');
                          else if (val === 'ST Exchange' || val === 'ST Kaarigar') setOpenType('Default');
                          else if (val === 'ST Academics') setOpenType('Course');
                        }}
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', appearance: 'none', background: '#fff', fontWeight: 500, color: '#111827' }}
                      >
                        <option value="ST Spares">ST Spares</option>
                        <option value="ST Mechanic">ST Mechanic</option>
                        <option value="ST Exchange">ST Exchange</option>
                        <option value="ST Kaarigar">ST Kaarigar</option>
                        <option value="ST Academics">ST Academics</option>
                        <option value="Open Service Category">Open Service Category</option>
                        <option value="External Link">External Link</option>
                      </select>
                      <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  {/* Open / Add Link */}
                  {hasOpenField(linkTo) ? (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                        Open <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select 
                          value={openType}
                          onChange={(e) => setOpenType(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', appearance: 'none', background: '#fff', fontWeight: 500, color: '#111827' }}
                        >
                          {getOpenOptions(linkTo).map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>
                        Add Link <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input 
                        type="text" 
                        value={externalLink}
                        onChange={(e) => setExternalLink(e.target.value)}
                        placeholder="Enter Link" 
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#111827' }} 
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Label card */}
              <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#111827' }}>Label</h2>
                <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>
                
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '1rem' }}>
                  Select Label <span style={{ color: '#ef4444' }}>*</span>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  {labels.map((lbl) => {
                    const isSelected = selectedLabel === lbl.id;
                    return (
                      <div 
                        key={lbl.id}
                        onClick={() => setSelectedLabel(lbl.id)}
                        style={{ 
                          border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb', 
                          background: isSelected ? '#f8fafc' : '#fff',
                          borderRadius: '0.5rem', 
                          padding: '0.75rem', 
                          cursor: 'pointer',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* Checkbox on top left */}
                        <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            readOnly
                            style={{ accentColor: '#3b82f6', width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer' }}
                          />
                        </div>

                        {/* Label Graphic */}
                        {lbl.render()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            // Step 2 Preview Summary Left Pane
            <>
              {/* Creative Info Left Card */}
              <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#111827' }}>Creative Info</h2>
                <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Banner Type</span>
                    <strong style={{ fontSize: '0.95rem', color: '#111827' }}>{bannerType.replace(' Banner', '')}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Title</span>
                    <strong style={{ fontSize: '0.95rem', color: '#111827' }}>{title}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Subheader</span>
                    <strong style={{ fontSize: '0.95rem', color: '#111827' }}>{subheader}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Body</span>
                    <strong style={{ fontSize: '0.95rem', color: '#111827' }}>{body}</strong>
                  </div>

                  {/* Upload Spare Images */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Upload Spare Images <span style={{ color: '#ef4444' }}>*</span></span>
                    
                    <div style={{ border: '1px solid #a7f3d0', background: '#f0fdf4', borderRadius: '0.5rem', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Left: filename info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '48px', height: '48px', background: 'linear-gradient(to right, #ec4899, #ef4444)', borderRadius: '0.35rem' }}></div>
                        <span style={{ fontSize: '0.875rem', color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          brand-logo-square.jpg
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                      </div>

                      {/* Right: Red circle cross icon */}
                      <button 
                        onClick={handleRemoveMockUpload}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interaction Left Card */}
              <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#111827' }}>Interaction</h2>
                <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Click Action:</span>
                    <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Custom Link</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Item Weight:</span>
                    <strong style={{ fontSize: '0.95rem', color: '#111827' }}>185 g</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Net Quantity:</span>
                    <strong style={{ fontSize: '0.95rem', color: '#111827' }}>1 Unit</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Material:</span>
                    <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Hardened Alloy Steel</strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Preview Mobile Pane */}
        <div style={{ flex: 1, background: '#eff6ff', borderRadius: '0.75rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #e5e7eb', minWidth: '320px' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 700, fontSize: '1.125rem', color: '#111827' }}>Preview</h3>
          
          {/* Mobile Mockup - Realistic Device Frame */}
          <div style={{ 
            position: 'relative',
            width: '280px', 
            background: '#000000',
            borderRadius: '2.5rem',
            padding: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            boxSizing: 'border-box',
            border: '4px solid #1f2937',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Screen Container */}
            <div style={{
              position: 'relative',
              borderRadius: '1.8rem',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: '#111827',
            }}>
              <img 
                src="/Machine Spares Home Screen (1).svg" 
                alt="App Preview Screen" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  display: 'block',
                  filter: 'blur(4px)',
                  transform: 'scale(1.05)'
                }} 
              />

              {/* Dynamic Banner Overlay */}
              <div style={{
                position: 'absolute',
                left: '6.5%',
                top: '17.9%',
                width: '87%',
                height: '17.2%',
                background: 'linear-gradient(135deg, #ec4899, #ef4444)',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#fff',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}>
                {/* Left Content */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.5rem', fontWeight: 600, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {subheader}
                  </span>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '2px 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {title}
                  </h4>
                  <span style={{ fontSize: '0.45rem', opacity: 0.85, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {body}
                  </span>
                </div>
                
                {/* Ribbon Tag label badge if present */}
                {selectedLabel && (
                  <div style={{ position: 'absolute', top: 0, right: '42px', zIndex: 1 }}>
                    <div style={{ 
                      background: '#ef4444', 
                      color: '#fff', 
                      fontSize: '0.425rem', 
                      fontWeight: 700, 
                      padding: '3px 5px 5px 5px', 
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                      textTransform: 'uppercase'
                    }}>
                      {selectedLabel === 'SALE up to 50%' ? '50% Off' : selectedLabel === 'NEW COLLECTION' ? 'NEW' : selectedLabel}
                    </div>
                  </div>
                )}

                {/* Right Image */}
                <div style={{
                  position: 'relative',
                  height: '140%',
                  width: '55%',
                  flexShrink: 0,
                  marginRight: '-5%'
                }}>
                  {/* Simulated shadow for images with white backgrounds */}
                  <img 
                    src={uploadedFileUrl || "/rotary-hook.png"} 
                    alt="" 
                    style={{ 
                      position: 'absolute',
                      right: 0,
                      top: '12px',
                      height: '100%',
                      width: '100%',
                      objectFit: 'contain',
                      objectPosition: 'right center',
                      mixBlendMode: 'multiply',
                      filter: 'blur(15px) contrast(1.2)',
                      opacity: 0.6
                    }} 
                  />
                  <img 
                    src={uploadedFileUrl || "/rotary-hook.png"} 
                    alt="Spare Part" 
                    style={{ 
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      height: '100%',
                      width: '100%',
                      objectFit: 'contain',
                      objectPosition: 'right center',
                      mixBlendMode: 'multiply',
                      filter: 'contrast(1.05)'
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

export default function AddCreativePage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading creative details...</div>}>
      <AddCreativeContent />
    </Suspense>
  );
}
