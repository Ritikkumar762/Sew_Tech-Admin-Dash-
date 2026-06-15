'use client';
import { useMdm } from './_hooks/useMdm';

export default function MasterDataManagementPage() {
  const {
    activeTab,
    setActiveTab,
    machineSubTab,
    setMachineSubTab,
    sparesSubTab,
    setSparesSubTab,
    industrySearch,
    setIndustrySearch,
    machineSearch,
    setMachineSearch,
    spareSearch,
    setSpareSearch,
    categorySearch,
    setCategorySearch,
    skillSearch,
    setSkillSearch,
    loading,
    filteredIndustries,
    filteredMachines,
    filteredSpares,
    filteredCategories,
    filteredSkills,
    handleEditClick,
    handleAddNew,
    leftTabs
  } = useMdm();

  const getAddBtnLabel = () => {
    if (activeTab === 'Industry') return 'Add Industry';
    if (activeTab === 'Machine & Machine Type') {
      return machineSubTab === 'Machines' ? 'Add Machine' : 'Add Machine Type';
    }
    if (activeTab === 'Spares & Categories') {
      return sparesSubTab === 'Spares' ? 'Add Spare' : 'Add Category';
    }
    if (activeTab === 'Skills') return 'Add Skill';
    return `Add ${activeTab}`;
  };

  const getAddType = () => {
    if (activeTab === 'Industry') return 'industry';
    if (activeTab === 'Machine & Machine Type') {
      return machineSubTab === 'Machines' ? 'machine' : 'machineType';
    }
    if (activeTab === 'Spares & Categories') {
      return sparesSubTab === 'Spares' ? 'spare' : 'category';
    }
    if (activeTab === 'Skills') return 'skill';
    return 'industry';
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-btn { transition: all 0.2s ease; }
        .animate-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .animate-btn:active { transform: translateY(1px); }
        
        .left-tab-btn {
          width: 100%;
          padding: 1rem 1.25rem;
          border: none;
          outline: none;
          background: #fff;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #4b5563;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .left-tab-btn-active {
          background: #eff6ff !important;
          color: #1e40af !important;
          border-color: #bfdbfe !important;
          font-weight: 700 !important;
        }
        .tab-badge {
          background: #eff6ff;
          color: #3b82f6;
          border: 1px solid #bfdbfe;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          min-width: 24px;
          text-align: center;
        }
        .tab-badge-active {
          background: #3b82f6 !important;
          color: #fff !important;
          border-color: #3b82f6 !important;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          outline: none;
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
          background: #fff;
          transition: all 0.2s ease;
        }
        .search-input:focus {
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
        }

        .tr-hover { transition: background-color 0.2s ease; }
        .tr-hover:hover { background-color: #f9fafb !important; }

        .sub-tab-btn {
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          transition: all 0.2s ease;
        }
      `}</style>

      {/* ─── COLUMN 1: Sidebar Tabs (Frame 1561849194) ─── */}
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#fff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
        {leftTabs.map((x) => {
          const isAct = activeTab === x.name;
          return (
            <button
              key={x.name}
              onClick={() => setActiveTab(x.name)}
              className={`left-tab-btn ${isAct ? 'left-tab-btn-active' : ''}`}
            >
              <span>{x.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`tab-badge ${isAct ? 'tab-badge-active' : ''}`}>{x.count}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── COLUMN 2: Data Tables Grid ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Main Header title bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#111827' }}>Master Data Management</h1>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Master Data Management <span style={{ margin: '0 0.5rem' }}>•</span> <span style={{ fontWeight: 600, color: '#111827' }}>{activeTab}</span>
            </div>
          </div>
          
          <button 
            onClick={() => handleAddNew(getAddType() as any)}
            style={{ background: '#111827', color: '#fff', border: 'none', padding: '0.65rem 1.4rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            className="animate-btn"
          >
            {getAddBtnLabel()}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          </button>
        </div>

        {/* ─── TAB VIEW 1: Industry Table Grid ─── */}
        {activeTab === 'Industry' && (
          <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Industry</h2>
            <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

            {/* Inner Bordered Card Wrapper */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', background: '#f9fafb' }}>
              
              {/* Search Field */}
              <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
                <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  placeholder="Search Industry" 
                  value={industrySearch}
                  onChange={(e) => setIndustrySearch(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Grid Table */}
              <div style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>Loading industries...</td>
                      </tr>
                    )}
                    {!loading && filteredIndustries.map((ind) => (
                      <tr key={ind.id} className="tr-hover" style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#111827', width: '60px' }}>{ind.index}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>{ind.name}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#9ca3af', textAlign: 'right' }}>
                          Skills Mapped: <strong style={{ color: '#111827', marginRight: '1rem' }}>{ind.skillsCount}</strong>
                          | Machines Mapped: <strong style={{ color: '#111827', marginLeft: '4px' }}>{ind.machinesCount}</strong>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', width: '60px', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleEditClick('industry', ind.id)}
                            style={{ border: 'none', background: '#111827', color: '#fff', width: '32px', height: '32px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            className="animate-btn"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Figma Styled Double Pagination details row */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', padding: '0 0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Rows per page:</span>
                  <select style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}>
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>1–10 of 165</span>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&lt;</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&gt;</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1.5rem' }}>
                  <span>Rows per page:</span>
                  <select style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}>
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>1–10 of 165</span>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&lt;</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&gt;</button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ─── TAB VIEW 2: Machine & Machine Type Grid ─── */}
        {activeTab === 'Machine & Machine Type' && (
          <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            
            {/* inner tabs secondary nav header */}
            <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
              {(['Machines', 'MachineType'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMachineSubTab(tab)}
                  className="sub-tab-btn"
                  style={{
                    color: machineSubTab === tab ? '#3b82f6' : '#6b7280',
                    borderBottom: machineSubTab === tab ? '2.5px solid #3b82f6' : '2.5px solid transparent',
                    paddingBottom: '1rem',
                    marginBottom: '-1px'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Inner Table container wrapper */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', background: '#f9fafb' }}>
              
              {/* Search Field */}
              <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
                <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  placeholder="Search Machine Name" 
                  value={machineSearch}
                  onChange={(e) => setMachineSearch(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Grid Table */}
              <div style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>Loading machines...</td>
                      </tr>
                    )}
                    {!loading && filteredMachines.map((mach) => (
                      <tr key={mach.id} className="tr-hover" style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#111827', width: '60px' }}>{mach.index}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>{mach.name}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#9ca3af', textAlign: 'right' }}>
                          Skills Mapped: <strong style={{ color: '#111827', marginRight: '1rem' }}>{mach.skillsCount}</strong>
                          | Spares Mapped: <strong style={{ color: '#111827', marginLeft: '4px' }}>{mach.sparesCount}</strong>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', width: '60px', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleEditClick('machine', mach.id)}
                            style={{ border: 'none', background: '#111827', color: '#fff', width: '32px', height: '32px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            className="animate-btn"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Figma Styled Double Pagination details row */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', padding: '0 0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Rows per page:</span>
                  <select style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}>
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>1–10 of 165</span>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&lt;</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&gt;</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1.5rem' }}>
                  <span>Rows per page:</span>
                  <select style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}>
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>1–10 of 165</span>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&lt;</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&gt;</button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ─── TAB VIEW 3: Spares & Categories Grid ─── */}
        {activeTab === 'Spares & Categories' && (
          <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            
            {/* inner tabs secondary nav header */}
            <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
              {(['Spares', 'Categories'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSparesSubTab(tab)}
                  className="sub-tab-btn"
                  style={{
                    color: sparesSubTab === tab ? '#3b82f6' : '#6b7280',
                    borderBottom: sparesSubTab === tab ? '2.5px solid #3b82f6' : '2.5px solid transparent',
                    paddingBottom: '1rem',
                    marginBottom: '-1px'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Inner Table container wrapper */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', background: '#f9fafb' }}>
              
              {/* Search Field */}
              <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
                <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  placeholder={sparesSubTab === 'Spares' ? "Search Spare" : "Search Category"} 
                  value={sparesSubTab === 'Spares' ? spareSearch : categorySearch}
                  onChange={(e) => sparesSubTab === 'Spares' ? setSpareSearch(e.target.value) : setCategorySearch(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Grid Table */}
              <div style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>Loading...</td>
                      </tr>
                    )}
                    
                    {/* Render Spares Subtab List */}
                    {!loading && sparesSubTab === 'Spares' && filteredSpares.map((spr) => (
                      <tr key={spr.id} className="tr-hover" style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#111827', width: '60px' }}>{spr.index}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>{spr.name}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#9ca3af', textAlign: 'right' }}>
                          Skills Mapped: <strong style={{ color: '#111827', marginRight: '1rem' }}>{spr.skillsCount}</strong>
                          | Machines Mapped: <strong style={{ color: '#111827', marginRight: '1rem' }}>{spr.machinesCount}</strong>
                          | Industries Mapped: <strong style={{ color: '#111827', marginLeft: '4px' }}>{spr.industriesCount}</strong>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', width: '60px', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleEditClick('spare', spr.id)}
                            style={{ border: 'none', background: '#111827', color: '#fff', width: '32px', height: '32px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            className="animate-btn"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Render Categories Subtab List */}
                    {!loading && sparesSubTab === 'Categories' && filteredCategories.map((cat) => (
                      <tr key={cat.id} className="tr-hover" style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#111827', width: '60px' }}>{cat.index}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>{cat.name}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#9ca3af', textAlign: 'right' }}>
                          Spares Mapped: <strong style={{ color: '#111827', marginLeft: '4px' }}>{cat.sparesCount}</strong>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', width: '60px', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleEditClick('category', cat.id)}
                            style={{ border: 'none', background: '#111827', color: '#fff', width: '32px', height: '32px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            className="animate-btn"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Figma Styled Double Pagination details row */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', padding: '0 0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Rows per page:</span>
                  <select style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}>
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>1–10 of 165</span>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&lt;</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&gt;</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1.5rem' }}>
                  <span>Rows per page:</span>
                  <select style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}>
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>1–10 of 165</span>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&lt;</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&gt;</button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ─── TAB VIEW 4: Skills Grid ─── */}
        {activeTab === 'Skills' && (
          <div className="card" style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: '#111827' }}>Skills</h2>
            <div style={{ borderTop: '1px dashed #e5e7eb', margin: '1rem 0 1.5rem 0' }}></div>

            {/* Inner Bordered Card Wrapper */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', background: '#f9fafb' }}>
              
              {/* Search Field */}
              <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
                <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  placeholder="Search Skills" 
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Grid Table */}
              <div style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>Loading skills...</td>
                      </tr>
                    )}
                    {!loading && filteredSkills.map((sk) => (
                      <tr key={sk.id} className="tr-hover" style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#111827', width: '60px' }}>{sk.index}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>{sk.name}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#9ca3af', textAlign: 'right' }}>
                          Machines Mapped: <strong style={{ color: '#111827', marginRight: '1rem' }}>{sk.machinesCount}</strong>
                          | Industries Mapped: <strong style={{ color: '#111827', marginLeft: '4px' }}>{sk.industriesCount}</strong>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', width: '60px', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleEditClick('skill', sk.id)}
                            style={{ border: 'none', background: '#111827', color: '#fff', width: '32px', height: '32px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            className="animate-btn"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Figma Styled Double Pagination details row */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', padding: '0 0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Rows per page:</span>
                  <select style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}>
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>1–10 of 165</span>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&lt;</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&gt;</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1.5rem' }}>
                  <span>Rows per page:</span>
                  <select style={{ border: 'none', background: 'none', outline: 'none', fontWeight: 700, color: '#111827', cursor: 'pointer' }}>
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>1–10 of 165</span>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&lt;</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>&gt;</button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
