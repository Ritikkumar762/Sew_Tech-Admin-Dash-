'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AddCreativePage() {
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

  // Interaction Form States
  const [linkTo, setLinkTo] = useState<string>('ST Spares');
  const [openType, setOpenType] = useState<string>('Spare');
  const [spareId, setSpareId] = useState<string>('ST Spares');
  const [categoryId, setCategoryId] = useState<string>('Sewing Machine Spares');
  const [machineId, setMachineId] = useState<string>('Lockstitch Machine');
  const [externalLink, setExternalLink] = useState<string>('');

  // Selected Label (PROMOTION, Sale, NEW COLLECTION, SALE up to 50% Off)
  const [selectedLabel, setSelectedLabel] = useState<string>('PROMOTION');

  // Load existing details if editing
  useEffect(() => {
    if (editId) {
      // Mimic backend data load
      setTitle('Mattress Tape Edge');
      setSubheader('CTEC 300U');
      setBody('100% Original | Made in Taiwan');
      setBannerType('Hero Banner');
      setUploadedFileName('brand-logo-square.jpg');
      setLinkTo('ST Spares');
      setOpenType('Spare');
      setSelectedLabel('PROMOTION');
    }
  }, [editId]);

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
              onClick={() => router.push('/marketing/creatives')} 
              style={{ background: '#111827', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Save Creative <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
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
                      <div style={{ border: '2px dashed #3b82f6', borderRadius: '0.5rem', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#eff6ff' }}>
                        <button 
                          onClick={handleMockUpload}
                          style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
                        >
                          Upload Banner
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        </button>
                        <span style={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.75rem' }}>.jpg, .png (200×200px)</span>
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
          
          {/* Mobile Mockup */}
          <div style={{ 
            width: '280px', 
            height: '580px', 
            background: '#111', 
            borderRadius: '2rem', 
            border: '8px solid #000',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Notch */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100px', height: '24px', background: '#000', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', zIndex: 10 }}></div>
            
            {/* App UI */}
            <div style={{ background: '#1c1c1e', color: '#fff', flex: 1, padding: '2rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* App Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>SEWTECH</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ width: '24px', height: '24px', background: '#333', borderRadius: '50%' }}></div>
                  <div style={{ width: '24px', height: '24px', background: '#333', borderRadius: '50%' }}></div>
                </div>
              </div>

              {/* Banner Area */}
              <div style={{ 
                background: 'linear-gradient(to right, #ec4899, #ef4444)', 
                borderRadius: '0.75rem', 
                padding: '1rem', 
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.9 }}>{subheader}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{title}</div>
                <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.85 }}>{body}</div>
                
                {/* Ribbon Tag label badge if present */}
                {selectedLabel && (
                  <div style={{ position: 'absolute', top: 0, right: '8px', zIndex: 1 }}>
                    <div style={{ 
                      background: '#ef4444', 
                      color: '#fff', 
                      fontSize: '0.45rem', 
                      fontWeight: 700, 
                      padding: '4px 6px 6px 6px', 
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                      textTransform: 'uppercase'
                    }}>
                      {selectedLabel === 'SALE up to 50%' ? '50% Off' : selectedLabel === 'NEW COLLECTION' ? 'NEW' : selectedLabel}
                    </div>
                  </div>
                )}

                {/* Mock image placeholder */}
                <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', width: '100px', height: '100px', background: '#000', opacity: 0.15, borderRadius: '0.5rem', transform: 'rotate(-10deg)' }}></div>
                
                {/* Dots */}
                <div style={{ position: 'absolute', bottom: '8px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                  <div style={{ width: '12px', height: '4px', background: '#fff', borderRadius: '2px' }}></div>
                  <div style={{ width: '4px', height: '4px', background: '#fff', opacity: 0.5, borderRadius: '50%' }}></div>
                  <div style={{ width: '4px', height: '4px', background: '#fff', opacity: 0.5, borderRadius: '50%' }}></div>
                </div>
              </div>

              {/* Grid Area */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af' }}>Quick Search</span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Part Catalogues &gt;</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {[
                  { label: 'Search by Category', icon: '🔍' },
                  { label: 'Guided Search', icon: '⚡' },
                  { label: 'Search by Photo', icon: '📷' },
                  { label: 'Order by Hand Notes', icon: '📝' },
                  { label: 'Whatsapp US', icon: '💬' },
                  { label: 'Send Audio Notes', icon: '🎙️' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#2c2c2e', borderRadius: '0.5rem', padding: '0.75rem 0.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', justifyContent: 'center', border: '1px solid #3a3a3c' }}>
                    <div style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
                    <div style={{ fontSize: '0.55rem', color: '#9ca3af', textAlign: 'center', lineHeight: '1.2', fontWeight: 500 }}>{item.label}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* Bottom Nav */}
            <div style={{ background: '#fff', height: '55px', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 0.5rem', position: 'relative', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '1rem' }}>🛠️</span>
                <span style={{ fontSize: '0.5rem', color: '#6b7280', fontWeight: 600, marginTop: '2px' }}>Services</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'pointer' }}>
                <span style={{ fontSize: '1rem' }}>🛒</span>
                <span style={{ fontSize: '0.5rem', color: '#6b7280', fontWeight: 600, marginTop: '2px' }}>Cart</span>
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', fontSize: '0.5rem', padding: '1px 4px', borderRadius: '50%', fontWeight: 700 }}>2</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateY(-12px)', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #1c1c1e', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <span style={{ fontSize: '0.9rem', color: '#fff' }}>🏠</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '1rem' }}>❤️</span>
                <span style={{ fontSize: '0.5rem', color: '#6b7280', fontWeight: 600, marginTop: '2px' }}>Wishlist</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '1rem' }}>📦</span>
                <span style={{ fontSize: '0.5rem', color: '#6b7280', fontWeight: 600, marginTop: '2px' }}>My Orders</span>
              </div>
            </div>
            
            {/* Home indicator */}
            <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '4px', background: '#000', borderRadius: '2px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
