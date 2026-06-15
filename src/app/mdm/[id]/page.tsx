'use client';
import { useMdmDetail } from '../_hooks/useMdmDetail';

export default function MDMDetailPage() {
  const {
    id,
    router,
    editType,
    machineData,
    setMachineData,
    loading,
    industryName,
    setIndustryName,
    industrySpares,
    industryMachines,
    skillName,
    setSkillName,
    skillMachines,
    skillIndustries,
    showSkillAddDrop,
    setShowSkillAddDrop,
    skillsOptions,
    selectedSkillInput,
    setSelectedSkillInput,
    showSpareAddDrop,
    setShowSpareAddDrop,
    sparesOptions,
    selectedSpareInput,
    setSelectedSpareInput,
    showIndAddDrop,
    setShowIndAddDrop,
    indOptions,
    selectedIndInput,
    setSelectedIndInput,
    handleAddField,
    handleRemoveField,
    handleSave,
  } = useMdmDetail();

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Loading details...</div>;
  }

  return (
    <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-btn { transition: all 0.2s ease; }
        .animate-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .animate-btn:active { transform: translateY(1px); }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          outline: none;
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
          background: #fff;
          transition: all 0.2s ease;
        }
        .form-input:focus {
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
        }

        .select-picker {
          width: 100%;
          padding: 0.75rem 1.5rem 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: #fff;
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
          outline: none;
          appearance: none;
          cursor: pointer;
        }

        .tag-pill {
          background: #eff6ff;
          color: #3b82f6;
          border: 1px solid #bfdbfe;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .tag-remove {
          color: #fca5a5;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.875rem;
          transition: color 0.15s ease;
        }
        .tag-remove:hover {
          color: #ef4444;
        }

        .bordered-column-grid {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.5rem;
          flex: 1;
          min-height: 350px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .add-field-box {
          border: 1px dashed #3b82f6;
          background: #f8fafc;
          border-radius: 0.5rem;
          padding: 1rem;
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
      `}</style>

      {/* Top Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => router.push('/mdm')}
            style={{ background: 'none', border: '1px solid #e5e7eb', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#111827' }}>
            {editType === 'industry' ? industryName : (editType === 'category' ? 'Needle' : (editType === 'machineType' ? 'Lockstitch Machine' : (editType === 'skill' ? skillName : machineData.name)))}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => router.push('/mdm')}
            style={{ border: '1px solid #ef4444', color: '#ef4444', background: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
            className="animate-btn"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
            className="animate-btn"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ─── RENDERING CONDITION A: Edit Industry ─── */}
      {editType === 'industry' && (
        <>
          {/* Visible Name Card */}
          <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Visible Name <span style={{ color: '#ef4444' }}>*</span></span>
            <div style={{ position: 'relative', maxWidth: '500px' }}>
              <select 
                value={industryName}
                onChange={(e) => setIndustryName(e.target.value)}
                className="select-picker"
              >
                <option>Apparel & Fashion</option>
                <option>Medical & Healthcare Textiles</option>
                <option>Furniture & Upholstery</option>
              </select>
              <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          {/* Mapped sections */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            {/* Spares Mapped Card */}
            <div className="bordered-column-grid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1rem', color: '#111827' }}>Spares Mapped</strong>
                <button 
                  onClick={() => setShowSpareAddDrop(!showSpareAddDrop)}
                  style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#111827', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="animate-btn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {showSpareAddDrop && (
                <div className="add-field-box">
                  <select 
                    value={selectedSpareInput}
                    onChange={(e) => setSelectedSpareInput(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    {sparesOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <button onClick={() => handleAddField('indSpares')} style={{ background: '#111827', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              )}

              {/* Tags Grid loop */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', overflowY: 'auto' }}>
                {industrySpares.map((item) => (
                  <div key={item.id} className="tag-pill">
                    <span>{item.name}</span>
                    <span onClick={() => handleRemoveField('indSpares', item.id)} className="tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Machines Mapped Card */}
            <div className="bordered-column-grid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1rem', color: '#111827' }}>Machines Mapped</strong>
                <button 
                  onClick={() => setShowSkillAddDrop(!showSkillAddDrop)}
                  style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#111827', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="animate-btn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {showSkillAddDrop && (
                <div className="add-field-box">
                  <select 
                    value={selectedSkillInput}
                    onChange={(e) => setSelectedSkillInput(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    {skillsOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <button onClick={() => handleAddField('indMachines')} style={{ background: '#111827', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', overflowY: 'auto' }}>
                {industryMachines.map((item) => (
                  <div key={item.id} className="tag-pill">
                    <span>{item.name}</span>
                    <span onClick={() => handleRemoveField('indMachines', item.id)} className="tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── RENDERING CONDITION B: Edit Machine or Edit Spare ─── */}
      {(editType === 'machine' || editType === 'spare') && (
        <>
          {/* Visible metadata grid card */}
          <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            
            {/* Grid layout parameters inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Visible Name <span style={{ color: '#ef4444' }}>*</span></span>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={editType === 'spare' ? 'Industrial Sewing Machine Needle' : machineData.name}
                    onChange={(e) => setMachineData({ ...machineData, name: e.target.value })}
                    className="select-picker"
                  >
                    <option>Industrial Single Needle Lockstitch Machine</option>
                    <option>Industrial Sewing Machine Needle</option>
                    <option>Brother S-7200C Sewing Machine</option>
                  </select>
                  <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Category <span style={{ color: '#ef4444' }}>*</span></span>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={machineData.machineType}
                    onChange={(e) => setMachineData({ ...machineData, machineType: e.target.value })}
                    className="select-picker"
                  >
                    <option>Locksmith Machine</option>
                    <option>Overlock Machine</option>
                  </select>
                  <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Brand <span style={{ color: '#ef4444' }}>*</span></span>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={machineData.brand}
                    onChange={(e) => setMachineData({ ...machineData, brand: e.target.value })}
                    className="select-picker"
                  >
                    <option>Singer</option>
                    <option>Brother</option>
                    <option>Juki</option>
                  </select>
                  <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>

            {/* Images upload cards mapping (Mockup Image 5) */}
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>Machine Images <span style={{ color: '#ef4444' }}>*</span></span>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                {machineData.images.map((img, i) => (
                  <div 
                    key={i}
                    style={{ 
                      width: '130px', 
                      height: '130px', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.5rem', 
                      background: `url(${img}) center/cover`,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      paddingBottom: '8px'
                    }}
                  >
                    {/* Delete tag */}
                    <button style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '22px', borderRadius: '50%', background: '#ef4444', border: 'none', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>×</button>
                    
                    {/* Cover Photo Indicator tag */}
                    <span style={{ background: i === 0 ? '#3b82f6' : '#fff', color: i === 0 ? '#fff' : '#4b5563', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', cursor: 'pointer' }}>
                      {i === 0 ? '✓ Cover Photo' : 'Cover Photo'}
                    </span>
                  </div>
                ))}
                
                {/* Upload dash button */}
                <div style={{ border: '2px dashed #3b82f6', background: '#eff6ff', borderRadius: '0.5rem', width: '130px', height: '130px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '6px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                  <span style={{ fontSize: '0.65rem', color: '#3b82f6', fontWeight: 700 }}>Upload Photo</span>
                </div>
              </div>
            </div>

          </div>

          {/* 3-Column dynamic tags columns mapping */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {/* Column 1: Skills Mapped */}
            <div className="bordered-column-grid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Skills Mapped</strong>
                <button 
                  onClick={() => {
                    setShowSpareAddDrop(false);
                    setShowIndAddDrop(false);
                    setShowSkillAddDrop(!showSkillAddDrop);
                  }}
                  style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#111827', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="animate-btn"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {showSkillAddDrop && (
                <div className="add-field-box">
                  <select 
                    value={selectedSkillInput}
                    onChange={(e) => setSelectedSkillInput(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    {skillsOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <button onClick={() => handleAddField('skills')} style={{ background: '#111827', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', overflowY: 'auto', maxHeight: '250px' }}>
                {machineData.skills.map((item) => (
                  <div key={item.id} className="tag-pill">
                    <span>{item.name}</span>
                    <span onClick={() => handleRemoveField('skills', item.id)} className="tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Spares Mapped */}
            <div className="bordered-column-grid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Spares Mapped</strong>
                <button 
                  onClick={() => {
                    setShowSkillAddDrop(false);
                    setShowIndAddDrop(false);
                    setShowSpareAddDrop(!showSpareAddDrop);
                  }}
                  style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#111827', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="animate-btn"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {showSpareAddDrop && (
                <div className="add-field-box">
                  <select 
                    value={selectedSpareInput}
                    onChange={(e) => setSelectedSpareInput(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    {sparesOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <button onClick={() => handleAddField('spares')} style={{ background: '#111827', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', overflowY: 'auto', maxHeight: '250px' }}>
                {machineData.spares.map((item) => (
                  <div key={item.id} className="tag-pill">
                    <span>{item.name}</span>
                    <span onClick={() => handleRemoveField('spares', item.id)} className="tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Industries Mapped */}
            <div className="bordered-column-grid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Industries Mapped</strong>
                <button 
                  onClick={() => {
                    setShowSkillAddDrop(false);
                    setShowSpareAddDrop(false);
                    setShowIndAddDrop(!showIndAddDrop);
                  }}
                  style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#111827', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="animate-btn"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {showIndAddDrop && (
                <div className="add-field-box">
                  <select 
                    value={selectedIndInput}
                    onChange={(e) => setSelectedIndInput(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    {indOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <button onClick={() => handleAddField('industries')} style={{ background: '#111827', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', overflowY: 'auto', maxHeight: '250px' }}>
                {machineData.industries.map((item) => (
                  <div key={item.id} className="tag-pill">
                    <span>{item.name}</span>
                    <span onClick={() => handleRemoveField('industries', item.id)} className="tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── RENDERING CONDITION C: Edit Category ─── */}
      {editType === 'category' && (
        <>
          {/* Visible Name Card */}
          <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Visible Name <span style={{ color: '#ef4444' }}>*</span></span>
            <div style={{ position: 'relative', maxWidth: '500px' }}>
              <select 
                value="Industrial Single Needle Lockstitch Machine"
                disabled
                className="select-picker"
              >
                <option>Industrial Single Needle Lockstitch Machine</option>
              </select>
              <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          {/* Mapped sections */}
          <div style={{ display: 'flex', gap: '2rem', maxWidth: '500px' }}>
            {/* Spares Mapped Card */}
            <div className="bordered-column-grid" style={{ minHeight: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1rem', color: '#111827' }}>Spares Mapped</strong>
                <button 
                  onClick={() => setShowSpareAddDrop(!showSpareAddDrop)}
                  style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#111827', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="animate-btn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {showSpareAddDrop && (
                <div className="add-field-box">
                  <select 
                    value={selectedSpareInput}
                    onChange={(e) => setSelectedSpareInput(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    {sparesOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <button onClick={() => handleAddField('indSpares')} style={{ background: '#111827', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              )}

              {/* Tags Grid loop */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', overflowY: 'auto' }}>
                {industrySpares.map((item) => (
                  <div key={item.id} className="tag-pill">
                    <span>{item.name}</span>
                    <span onClick={() => handleRemoveField('indSpares', item.id)} className="tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── RENDERING CONDITION D: Edit Machine Type ─── */}
      {editType === 'machineType' && (
        <>
          {/* Visible Name Card */}
          <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Visible Name <span style={{ color: '#ef4444' }}>*</span></span>
            <div style={{ position: 'relative', maxWidth: '500px' }}>
              <select 
                value="Industrial Single Needle Lockstitch Machine"
                disabled
                className="select-picker"
              >
                <option>Industrial Single Needle Lockstitch Machine</option>
              </select>
              <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          {/* 3-Column dynamic tags columns mapping */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {/* Column 1: Machines Mapped */}
            <div className="bordered-column-grid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Machines Mapped</strong>
                <button 
                  onClick={() => {
                    setShowSpareAddDrop(false);
                    setShowIndAddDrop(false);
                    setShowSkillAddDrop(!showSkillAddDrop);
                  }}
                  style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#111827', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="animate-btn"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {showSkillAddDrop && (
                <div className="add-field-box">
                  <select 
                    value={selectedSkillInput}
                    onChange={(e) => setSelectedSkillInput(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    {skillsOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <button onClick={() => handleAddField('skills')} style={{ background: '#111827', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', overflowY: 'auto', maxHeight: '250px' }}>
                {machineData.skills.map((item) => (
                  <div key={item.id} className="tag-pill">
                    <span>{item.name}</span>
                    <span onClick={() => handleRemoveField('skills', item.id)} className="tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Spares Mapped */}
            <div className="bordered-column-grid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Spares Mapped</strong>
                <button 
                  onClick={() => {
                    setShowSkillAddDrop(false);
                    setShowIndAddDrop(false);
                    setShowSpareAddDrop(!showSpareAddDrop);
                  }}
                  style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#111827', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="animate-btn"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {showSpareAddDrop && (
                <div className="add-field-box">
                  <select 
                    value={selectedSpareInput}
                    onChange={(e) => setSelectedSpareInput(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    {sparesOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <button onClick={() => handleAddField('spares')} style={{ background: '#111827', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', overflowY: 'auto', maxHeight: '250px' }}>
                {machineData.spares.map((item) => (
                  <div key={item.id} className="tag-pill">
                    <span>{item.name}</span>
                    <span onClick={() => handleRemoveField('spares', item.id)} className="tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Skills Mapped */}
            <div className="bordered-column-grid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Skills Mapped</strong>
                <button 
                  onClick={() => {
                    setShowSkillAddDrop(false);
                    setShowSpareAddDrop(false);
                    setShowIndAddDrop(!showIndAddDrop);
                  }}
                  style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#111827', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="animate-btn"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {showIndAddDrop && (
                <div className="add-field-box">
                  <select 
                    value={selectedIndInput}
                    onChange={(e) => setSelectedIndInput(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    {indOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <button onClick={() => handleAddField('industries')} style={{ background: '#111827', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', overflowY: 'auto', maxHeight: '250px' }}>
                {machineData.industries.map((item) => (
                  <div key={item.id} className="tag-pill">
                    <span>{item.name}</span>
                    <span onClick={() => handleRemoveField('industries', item.id)} className="tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── RENDERING CONDITION E: Edit Skill ─── */}
      {editType === 'skill' && (
        <>
          {/* Visible Name Card */}
          <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Visible Name <span style={{ color: '#ef4444' }}>*</span></span>
            <div style={{ position: 'relative', maxWidth: '500px' }}>
              <select 
                value="Industrial Single Needle Lockstitch Machine"
                disabled
                className="select-picker"
              >
                <option>Industrial Single Needle Lockstitch Machine</option>
              </select>
              <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          {/* Columns Mapped */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {/* Machines Mapped */}
            <div className="bordered-column-grid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Machines Mapped</strong>
                <button 
                  onClick={() => setShowSkillAddDrop(!showSkillAddDrop)}
                  style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#111827', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="animate-btn"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {showSkillAddDrop && (
                <div className="add-field-box">
                  <select 
                    value={selectedSkillInput}
                    onChange={(e) => setSelectedSkillInput(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    {skillsOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <button onClick={() => handleAddField('skillMachines')} style={{ background: '#111827', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', overflowY: 'auto', maxHeight: '250px' }}>
                {skillMachines.map((item) => (
                  <div key={item.id} className="tag-pill">
                    <span>{item.name}</span>
                    <span onClick={() => handleRemoveField('skillMachines', item.id)} className="tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Industries Mapped */}
            <div className="bordered-column-grid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Industries Mapped</strong>
                <button 
                  onClick={() => setShowIndAddDrop(!showIndAddDrop)}
                  style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#111827', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="animate-btn"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {showIndAddDrop && (
                <div className="add-field-box">
                  <select 
                    value={selectedIndInput}
                    onChange={(e) => setSelectedIndInput(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    {indOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <button onClick={() => handleAddField('skillIndustries')} style={{ background: '#111827', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', overflowY: 'auto', maxHeight: '250px' }}>
                {skillIndustries.map((item) => (
                  <div key={item.id} className="tag-pill">
                    <span>{item.name}</span>
                    <span onClick={() => handleRemoveField('skillIndustries', item.id)} className="tag-remove">×</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
