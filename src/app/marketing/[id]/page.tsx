'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BannerDetailPage() {
  const router = useRouter();
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
              ST Spares Banner 1
            </h1>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Ads & Marketing <span style={{ margin: '0 0.5rem' }}>•</span> All Banners <span style={{ margin: '0 0.5rem' }}>•</span> <span style={{ fontWeight: 600, color: '#111827' }}>ST Spares Banner 1</span>
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
            <button onClick={() => router.push('/marketing')} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Publish Banner <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
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
                <div style={{ border: '2px dashed #3b82f6', borderRadius: '0.5rem', padding: '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eff6ff' }}>
                  <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.15)' }}>
                    Select From Saved Creatives
                  </button>
                </div>
              </div>

              {/* Add Interaction Card */}
              <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#111827' }}>Add Interaction</h2>
                <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {/* Link To dropdown */}
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

                  {/* Open dropdown or Add Link input */}
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
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#111827', background: '#fff' }} 
                      />
                    </div>
                  )}
                </div>

                {renderThirdField(linkTo, openType)}
              </div>
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
                <div style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.9 }}>{previewData.sub}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{previewData.title}</div>
                <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.85 }}>{previewData.footer}</div>
                
                {/* Mock image placeholder */}
                <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', width: '100px', height: '100px', background: '#000', opacity: 0.15, borderRadius: '0.5rem', transform: 'rotate(-10deg)' }}></div>
                
                {/* Dots */}
                <div style={{ position: 'absolute', bottom: '8px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                  <div style={{ width: carousel ? '12px' : '4px', height: '4px', background: '#fff', borderRadius: '2px', transition: 'width 0.2s' }}></div>
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
