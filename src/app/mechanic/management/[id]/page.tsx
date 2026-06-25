'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Copy, 
  Check, 
  Play, 
  Volume2, 
  Download, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Calendar,
  ChevronDown,
  RotateCw,
  Zap,
  Video,
  MessageSquare,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar
} from 'recharts';

// Mock data matching useMechanics definitions
const MOCK_MECHANIC_DETAILS: Record<string, any> = {
  'm1': {
    id: 'm1',
    name: 'Nishant Kumar',
    phone: '+91 9876543210',
    email: 'nishant.kumar@gmail.com',
    location: 'Delhi NCR',
    dob: '21 Jan 1990',
    selectedLanguage: 'Hindi, English, Punjabi',
    joiningDate: '21 Jan 2026',
    acceptanceRate: '90%',
    completionRate: '80%',
    rating: 4.5,
    lastJob: "21 Jan' 26",
    status: 'Active',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    experience: '3',
    availability: 'Mon, Tue, Wed, Thu, Fri',
    skills: ['Skill Tag 1', 'Skill Tag 2'],
    machinesFamiliar: ['Machine Tag 1', 'Machine Tag 1', 'Machine Tag 1', 'Brand Tag 1', 'Brand Tag 2'],
    aadharName: 'Nishant Kumar',
    aadharNumber: '1234 5678 1234',
    panName: 'Nishant Kumar',
    panNumber: 'BFMPV2222I',
    panCardFile: 'nishant-pan-card.pdf',
    activeServices: ['Video Call Assistance', 'Instant Smart Booking', 'Invite Quote']
  },
  'm2': {
    id: 'm2',
    name: 'Suresh Yadav',
    phone: '+91 9765432109',
    email: 'suresh.yadav@gmail.com',
    location: 'Mumbai NCR',
    dob: '15 May 1988',
    selectedLanguage: 'Hindi, Marathi',
    joiningDate: '12 Feb 2026',
    acceptanceRate: '85%',
    completionRate: '95%',
    rating: 4.5,
    lastJob: "20 Jan' 26",
    status: 'Busy',
    bio: 'Experienced sewing machine repair mechanic based in Mumbai. Specializes in domestic and heavy industrial models.',
    experience: '8',
    availability: 'Mon, Tue, Wed, Thu, Fri, Sat',
    skills: ['Domestic Machines', 'Overlock Specialist'],
    machinesFamiliar: ['Singer', 'Usha', 'Brother'],
    aadharName: 'Suresh Yadav',
    aadharNumber: '9876 5432 1098',
    panName: 'Suresh Yadav',
    panNumber: 'CHJPS4321K',
    panCardFile: 'suresh-pan-card.pdf',
    activeServices: ['Instant Smart Booking', 'Invite Quote']
  },
  'm3': {
    id: 'm3',
    name: 'Ajay Nair',
    phone: '+91 9654321098',
    email: 'ajay.nair@gmail.com',
    location: 'Bangalore',
    dob: '08 Dec 1992',
    selectedLanguage: 'English, Kannada, Malayalam',
    joiningDate: '01 Mar 2026',
    acceptanceRate: '92%',
    completionRate: '88%',
    rating: 4.2,
    lastJob: "18 Jan' 26",
    status: 'Offline',
    bio: 'Professional technician offering multi-brand repair services. Certified in electronics sewing machinery and automation.',
    experience: '5',
    availability: 'Mon, Wed, Fri',
    skills: ['Electronic Repairs', 'High-Speed Machines'],
    machinesFamiliar: ['Juki', 'Brother', 'Pegasus'],
    aadharName: 'Ajay Nair',
    aadharNumber: '5678 1234 9876',
    panName: 'Ajay Nair',
    panNumber: 'ALOPN8765L',
    panCardFile: 'ajay-pan-card.pdf',
    activeServices: ['Video Call Assistance', 'Invite Quote']
  },
  'm4': {
    id: 'm4',
    name: 'Vijay Pandey',
    phone: '+91 9543210987',
    email: 'vijay.pandey@gmail.com',
    location: 'Pune',
    dob: '01 Jan 1985',
    selectedLanguage: 'Hindi, Marathi, English',
    joiningDate: '10 Jan 2026',
    acceptanceRate: '96%',
    completionRate: '94%',
    rating: 4.9,
    lastJob: "22 Jan' 26",
    status: 'Active',
    bio: 'Veteran mechanic with 12+ years experience in embroidery machines, mechanical calibrations, and workshop setups.',
    experience: '12',
    availability: 'Mon, Tue, Wed, Thu, Fri',
    skills: ['Embroidery Calibration', 'Calibrations'],
    machinesFamiliar: ['Barudan', 'Tajima', 'ZSK'],
    aadharName: 'Vijay Pandey',
    aadharNumber: '3456 7890 1234',
    panName: 'Vijay Pandey',
    panNumber: 'POIUY5678M',
    panCardFile: 'vijay-pan-card.pdf',
    activeServices: ['Video Call Assistance', 'Instant Smart Booking', 'Invite Quote']
  }
};

// Colors for Pie Charts
const PIE_COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

export default function MechanicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string);

  // Initialize data, fallback to Nishant Kumar (m1)
  const defaultData = MOCK_MECHANIC_DETAILS[id] || MOCK_MECHANIC_DETAILS['m1'];
  
  // State variables
  const [mechanic, setMechanic] = useState<any>(defaultData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'jobs' | 'performance'>('details');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Form edit temporary states
  const [editForm, setEditForm] = useState<any>(defaultData);

  // Subtabs & filters inside Jobs Tab
  const [jobsSubtab, setJobsSubtab] = useState<'All' | 'Instant Smart Booking' | 'Invite Quote' | 'Video Call Assistance' | 'Assisted Booking'>('All');
  const [jobsFilter, setJobsFilter] = useState<'All' | 'Ongoing' | 'Completed' | 'Diagnosis Available' | 'Cancelled'>('All');

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 1500);
  };

  // Switch to edit mode
  const handleStartEdit = () => {
    setEditForm({ ...mechanic });
    setIsEditing(true);
  };

  // Save changes
  const handleSaveChanges = () => {
    setMechanic({ ...editForm });
    setIsEditing(false);
  };

  // Cancel edit
  const handleCancelChanges = () => {
    setIsEditing(false);
  };

  // Mock charts data for performance tab
  const revenueTrendData = [
    { name: '1 Feb', Revenue: 4000 },
    { name: '2 Feb', Revenue: 8000 },
    { name: '3 Feb', Revenue: 6000 },
    { name: '4 Feb', Revenue: 10000 },
    { name: '5 Feb', Revenue: 9000 },
    { name: '6 Feb', Revenue: 7500 },
    { name: '7 Feb', Revenue: 9500 },
  ];

  const performanceBreakdownData = [
    { name: 'Completed', value: 80 },
    { name: 'Cancelled', value: 20 },
  ];

  const typeBreakdownData = [
    { name: 'Invite Quote', value: 30 },
    { name: 'Instant Smart Booking', value: 20 },
    { name: 'Video Call Assistance', value: 10 },
    { name: 'Assisted Booking', value: 40 },
  ];

  const jobTrendData = [
    { name: '1 Feb', 'Total Orders': 100, Return: 25, Replacement: 10, Cancellation: 5 },
    { name: '2 Feb', 'Total Orders': 120, Return: 30, Replacement: 15, Cancellation: 8 },
    { name: '3 Feb', 'Total Orders': 90, Return: 20, Replacement: 12, Cancellation: 4 },
    { name: '4 Feb', 'Total Orders': 140, Return: 35, Replacement: 20, Cancellation: 10 },
    { name: '5 Feb', 'Total Orders': 110, Return: 28, Replacement: 14, Cancellation: 6 },
    { name: '6 Feb', 'Total Orders': 130, Return: 32, Replacement: 18, Cancellation: 7 },
    { name: '7 Feb', 'Total Orders': 150, Return: 38, Replacement: 22, Cancellation: 9 },
  ];

  // Mock jobs list data
  const MOCK_JOBS = [
    { id: 'JOB-2041', customerName: 'Aditya Bhargav', type: 'Instant Smart Booking', location: 'Bangalore', date: "10:30 PM, 21 Jan' 26", status: 'Ongoing', feedback: '' },
    { id: 'JOB-2042', customerName: 'Aditya Bhargav', type: 'Instant Smart Booking', location: 'Bangalore', date: "10:30 PM, 21 Jan' 26", status: 'Completed', feedback: '4.5 ★' },
    { id: 'JOB-2043', customerName: 'Aditya Bhargav', type: 'Invite Quote', location: 'Bangalore', date: "10:30 PM, 21 Jan' 26", status: 'Diagnosis Available', feedback: '' },
    { id: 'JOB-2044', customerName: 'Aditya Bhargav', type: 'Video Call Assistance', location: 'Bangalore', date: "10:30 PM, 21 Jan' 26", status: 'Cancelled', feedback: '' },
    { id: 'JOB-2045', customerName: 'Rohan Sharma', type: 'Assisted Booking', location: 'Delhi NCR', date: "09:15 AM, 20 Jan' 26", status: 'Completed', feedback: '5.0 ★' },
    { id: 'JOB-2046', customerName: 'Priya Patel', type: 'Invite Quote', location: 'Mumbai', date: "04:30 PM, 19 Jan' 26", status: 'Ongoing', feedback: '' }
  ];

  const filteredJobs = MOCK_JOBS.filter(job => {
    // Subtab filter
    if (jobsSubtab !== 'All' && job.type !== jobsSubtab) return false;
    
    // Status filter
    if (jobsFilter === 'All') return true;
    return job.status === jobsFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease-out' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .stats-bar {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 1px solid #e2e8f0;
            border-radius: 0.75rem;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            padding: 1.25rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          }
          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-right: 1px solid #e2e8f0;
            padding: 0 1rem;
          }
          .stat-item:last-child {
            border-right: none;
          }
          .card-premium {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
          }
          .tab-btn-prem {
            border: none;
            background: none;
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
          }
          .tab-btn-prem-active {
            color: #2563eb;
            font-weight: 600;
            border-bottom-color: #2563eb;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px dashed #f3f4f6;
            font-size: 0.875rem;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .tag-pill {
            display: inline-flex;
            align-items: center;
            padding: 0.375rem 0.75rem;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: 500;
          }
          .tag-pill-active { background-color: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
          .tag-pill-smart { background-color: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
          .tag-pill-video { background-color: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }
          .tag-pill-quote { background-color: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
          .form-input-prem {
            width: 100%;
            padding: 0.625rem 0.875rem;
            border: 1px solid #cbd5e1;
            border-radius: 0.5rem;
            outline: none;
            font-size: 0.875rem;
            font-weight: 500;
            background-color: white;
            transition: border-color 0.15s;
          }
          .form-input-prem:focus {
            border-color: #3b82f6;
          }
        `}
      </style>

      {/* Dynamic Header Block based on Edit Mode */}
      {!isEditing ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={() => router.push('/mechanic/management')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                cursor: 'pointer',
                color: '#4b5563',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <ChevronLeft size={18} />
            </button>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>{mechanic.name}</h2>
            <div 
              onClick={() => handleCopy(mechanic.id.toUpperCase(), 'mechId')}
              style={{
                fontSize: '0.75rem',
                color: '#2563eb',
                border: '1px dashed #bfdbfe',
                borderRadius: '0.375rem',
                padding: '0.125rem 0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
                backgroundColor: '#eff6ff',
                fontWeight: 600,
                position: 'relative'
              }}
            >
              Mechanic ID
              {copiedText === 'mechId' ? <Check size={10} style={{ color: '#16a34a' }} /> : <Copy size={10} />}
            </div>
            
            <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginLeft: '0.5rem' }}>
              Sewtech Mechanic <span style={{ margin: '0 0.25rem' }}>•</span> Mechanic Management <span style={{ margin: '0 0.25rem' }}>•</span> {mechanic.name}
            </div>
          </div>
          <div>
            <button 
              onClick={handleStartEdit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#111827',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111827'}
            >
              Edit Mechanic Details
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              Edit Details <span style={{ fontWeight: 500, color: '#6b7280', margin: '0 0.5rem' }}>&gt;</span> {editForm.name}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={handleCancelChanges}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #ef4444',
                backgroundColor: 'white',
                color: '#ef4444',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Discard Changes
            </button>
            <button 
              onClick={handleSaveChanges}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: '#10b981',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Main View Block */}
      {!isEditing ? (
        <>
          {/* Quick Stats Grid Bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>City Coverage</span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b' }}>{mechanic.location}</span>
            </div>
            <div className="stat-item">
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>Acceptance Rate</span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b' }}>{mechanic.acceptanceRate}</span>
            </div>
            <div className="stat-item">
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>Completion Rate</span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b' }}>{mechanic.completionRate}</span>
            </div>
            <div className="stat-item">
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>Avg Rating</span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f59e0b' }}>{mechanic.rating} ★</span>
            </div>
            <div className="stat-item">
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>Last Job</span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b' }}>{mechanic.lastJob}</span>
            </div>
            <div className="stat-item">
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>Status</span>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                padding: '0.125rem 0.625rem',
                borderRadius: '1rem',
                backgroundColor: mechanic.status === 'Active' ? '#d1fae5' : '#fee2e2',
                color: mechanic.status === 'Active' ? '#065f46' : '#991b1b'
              }}>
                {mechanic.status}
              </span>
            </div>
          </div>

          {/* Primary View Tabs Row */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', overflowX: 'auto' }}>
            <button 
              onClick={() => setActiveTab('details')}
              className={`tab-btn-prem ${activeTab === 'details' ? 'tab-btn-prem-active' : ''}`}
            >
              Details
            </button>
            <button 
              onClick={() => setActiveTab('jobs')}
              className={`tab-btn-prem ${activeTab === 'jobs' ? 'tab-btn-prem-active' : ''}`}
            >
              Jobs
            </button>
            <button 
              onClick={() => setActiveTab('performance')}
              className={`tab-btn-prem ${activeTab === 'performance' ? 'tab-btn-prem-active' : ''}`}
            >
              Performance
            </button>
          </div>

          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Active Services */}
              <div className="card-premium">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '1.25rem' }}>Active Services</h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {mechanic.activeServices.map((service: string) => {
                    let pillClass = 'tag-pill-active';
                    let svgSrc = '/instant smart Booking.svg';
                    let statusDotColor = '#22c55e';
                    if (service.includes('Smart')) {
                      pillClass = 'tag-pill-smart';
                      svgSrc = '/instant smart Booking.svg';
                      statusDotColor = '#22c55e';
                    } else if (service.includes('Video')) {
                      pillClass = 'tag-pill-video';
                      svgSrc = '/video call _assistance.svg';
                      statusDotColor = '#f59e0b';
                    } else if (service.includes('Quote')) {
                      pillClass = 'tag-pill-quote';
                      svgSrc = '/invite quote.svg';
                      statusDotColor = '#3b82f6';
                    }
                    
                    return (
                      <span key={service} className={`tag-pill ${pillClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', borderRadius: '2rem' }}>
                        <img src={svgSrc} alt={service} style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                        {service}
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusDotColor, marginLeft: '0.25rem' }} />
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Basic Details */}
              <div className="card-premium">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>Basic Details</h3>
                  <div style={{
                    padding: '0.375rem 1rem',
                    border: '1px solid #bfdbfe',
                    borderRadius: '0.5rem',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    Live
                    <ChevronDown size={14} style={{ color: '#2563eb' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Email</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.email}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Phone Number</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.phone}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>DOB</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.dob}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Selected Language</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.selectedLanguage}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Joining Date</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.joiningDate}</span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="card-premium">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '1.25rem' }}>Profile Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Bio</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', lineHeight: 1.6 }}>{mechanic.bio}</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Experience (in years)</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.experience}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Availability</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.availability}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Location Preference</span>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontWeight: 600 }}>
                          {mechanic.location}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Skills</span>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {mechanic.skills.map((skill: string) => (
                          <span key={skill} style={{ fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontWeight: 600 }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Machines / Brands familiar with</span>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {mechanic.machinesFamiliar.slice(0, 3).map((mach: string, idx: number) => (
                          <span key={idx} style={{ fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontWeight: 600 }}>
                            {mach}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Audio & Video Pitch Players */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '0.5rem' }}>
                    {/* Audio Pitch SVG */}
                    <div style={{ display: 'block', borderRadius: '12px', overflow: 'hidden' }}>
                      <img src="/recording.svg" alt="Mechanic Audio Pitch" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>

                    {/* Video Pitch SVG */}
                    <div style={{ display: 'block', borderRadius: '12px', overflow: 'hidden' }}>
                      <img src="/mm_video.svg" alt="Mechanic Video Pitch" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Documents Card (Stretching full-width at the bottom) */}
              <div className="card-premium">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '1.25rem' }}>Documents</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Row 1 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Name as on Aadhar Card</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.aadharName}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Aadhar Number</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.aadharNumber}</span>
                    </div>
                  </div>
                  
                  <div style={{ borderTop: '1px dashed #f3f4f6' }} />

                  {/* Row 2 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Name as on PAN Card</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.panName}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>PAN Number</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.panNumber}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>PAN Card Uploaded</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {mechanic.panCardFile}
                          <ExternalLink size={12} />
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: JOBS */}
          {activeTab === 'jobs' && (
            <div className="card-premium">
              {/* Jobs subtabs row */}
              <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
                {[
                  { id: 'All', label: 'All (1085)' },
                  { id: 'Instant Smart Booking', label: 'Instant Smart Booking (1085)' },
                  { id: 'Invite Quote', label: 'Invite Quote (1085)' },
                  { id: 'Video Call Assistance', label: 'Video Call Assistance (1085)' },
                  { id: 'Assisted Booking', label: 'Assisted Booking (1085)' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setJobsSubtab(sub.id as any)}
                    style={{
                      border: 'none',
                      background: jobsSubtab === sub.id ? '#1f2937' : '#f3f4f6',
                      color: jobsSubtab === sub.id ? 'white' : '#4b5563',
                      padding: '0.375rem 0.875rem',
                      borderRadius: '2rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* Jobs status filters row */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'All', label: 'All' },
                  { id: 'Ongoing', label: 'Ongoing' },
                  { id: 'Completed', label: 'Completed' },
                  { id: 'Diagnosis Available', label: 'Diagnosis Available' },
                  { id: 'Cancelled', label: 'Cancelled' }
                ].map(pill => (
                  <button
                    key={pill.id}
                    onClick={() => setJobsFilter(pill.id as any)}
                    style={{
                      border: '1px solid #e5e7eb',
                      background: jobsFilter === pill.id ? '#eff6ff' : 'white',
                      color: jobsFilter === pill.id ? '#2563eb' : '#4b5563',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '2rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Jobs Table */}
              <div style={{ overflowX: 'auto', margin: '0 -1.5rem -1.5rem -1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                      <th style={{ padding: '1rem 1.5rem', width: '40px' }}>
                        <input type="checkbox" style={{ accentColor: '#111827' }} />
                      </th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Order</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Location</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Created On</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Feedback</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <tr key={job.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <input type="checkbox" style={{ accentColor: '#111827' }} />
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div>
                              <div style={{ fontWeight: 600, color: '#111827' }}>{job.customerName}</div>
                              <span style={{ 
                                fontSize: '10px', 
                                color: '#6b7280', 
                                border: '1px solid #d1d5db', 
                                borderRadius: '0.25rem', 
                                padding: '0.05rem 0.25rem',
                                backgroundColor: '#f9fafb',
                                display: 'inline-block',
                                marginTop: '0.125rem'
                              }}>
                                Request ID
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', fontWeight: 500, color: '#4b5563' }}>{job.location}</td>
                          <td style={{ padding: '1rem', fontWeight: 500, color: '#4b5563' }}>{job.date}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.25rem 0.625rem',
                              borderRadius: '1rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: job.status === 'Ongoing' ? '#eff6ff' : job.status === 'Completed' ? '#ecfdf5' : job.status === 'Diagnosis Available' ? '#f5f3ff' : '#fef2f2',
                              color: job.status === 'Ongoing' ? '#2563eb' : job.status === 'Completed' ? '#059669' : job.status === 'Diagnosis Available' ? '#7c3aed' : '#dc2626'
                            }}>
                              {job.status}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', fontWeight: 600, color: '#f59e0b' }}>{job.feedback || '--'}</td>
                          <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                            <button style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.25rem 0.5rem',
                              border: '1px solid #cbd5e1',
                              borderRadius: '0.375rem',
                              backgroundColor: 'white',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}>
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af', fontWeight: 500 }}>
                          No jobs found matching criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Performance Mini KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                <div className="kpi-card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>Total Jobs</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>12</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginTop: '0.25rem' }}>Completed &amp; Ongoing</span>
                </div>
                <div className="kpi-card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>Revenue</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>₹15,000</span>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.25rem' }}>▲ 5% (L7D)</span>
                </div>
                <div className="kpi-card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>Payout Pending</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>₹1,500</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginTop: '0.25rem' }}>Settle in next cycle</span>
                </div>
                <div className="kpi-card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>SLA adherence</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>90%</span>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.25rem' }}>Above target</span>
                </div>
                <div className="kpi-card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>Flags</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#dc2626' }}>10</span>
                  <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: '0.25rem' }}>▲ 5% (L7D)</span>
                </div>
              </div>

              {/* Charts grid 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                {/* Doughnut 1: Job Performance Breakdown */}
                <div className="card-premium">
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: '1.25rem' }}>Job Performance Breakdown</h3>
                  <div style={{ height: '220px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={performanceBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {performanceBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#f8fafc' }} />
                    )}
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>400</div>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Accepted</div>
                    </div>
                  </div>
                  {/* Legend */}
                  <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                      Completed (80%)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                      Cancelled (20%)
                    </div>
                  </div>
                </div>

                {/* Line Chart: Revenue Trend */}
                <div className="card-premium">
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: '1.25rem' }}>Revenue Trend</h3>
                  <div style={{ height: '240px' }}>
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip />
                          <Line type="monotone" dataKey="Revenue" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#f8fafc' }} />
                    )}
                  </div>
                </div>
              </div>

              {/* Charts grid 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                {/* Doughnut 2: Job Type Breakdown */}
                <div className="card-premium">
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: '1.25rem' }}>Job Type Breakdown</h3>
                  <div style={{ height: '220px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={typeBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {typeBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#f8fafc' }} />
                    )}
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>400</div>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Total Jobs</div>
                    </div>
                  </div>
                  {/* Custom Legend */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem', fontSize: '0.6875rem', fontWeight: 600, color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                      Invite Quote (30%)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                      Smart Booking (20%)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                      Video Call (10%)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                      Assisted Booking (40%)
                    </div>
                  </div>
                </div>

                {/* Bar Chart: Job Trend */}
                <div className="card-premium">
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: '1.25rem' }}>Job Trend</h3>
                  <div style={{ height: '260px' }}>
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={jobTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip />
                          <Bar dataKey="Total Orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Return" fill="#10b981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Replacement" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Cancellation" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#f8fafc' }} />
                    )}
                  </div>
                </div>
              </div>

              {/* Feedback Keywords */}
              <div className="card-premium">
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: '1.25rem' }}>Feedback Keywords</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Product quality', count: 25, percentage: '50%' },
                    { label: 'Wrong size ordered', count: 25, percentage: '50%' },
                    { label: 'Product damaged', count: 25, percentage: '50%' },
                    { label: 'Received wrong item', count: 25, percentage: '50%' },
                  ].map((kw, idx) => (
                    <span key={idx} style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      backgroundColor: '#eff6ff', 
                      color: '#2563eb', 
                      border: '1px solid #bfdbfe', 
                      borderRadius: '0.5rem', 
                      padding: '0.5rem 1rem', 
                      fontSize: '0.8125rem',
                      fontWeight: 600
                    }}>
                      {kw.label} <span style={{ color: '#1e40af', fontWeight: 700 }}>{kw.count} ({kw.percentage})</span>
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}
        </>
      ) : (
        /* EDIT VIEW MODE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Active Services Checkbox toggles */}
          <div className="card-premium">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '1.25rem' }}>Active Services</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Video Call Assistance', bgActive: '#fffbeb', colorActive: '#d97706', borderActive: '#fef3c7', svgSrc: '/video call _assistance.svg' },
                { name: 'Instant Smart Booking', bgActive: '#f0fdf4', colorActive: '#16a34a', borderActive: '#bbf7d0', svgSrc: '/instant smart Booking.svg' },
                { name: 'Invite Quote', bgActive: '#eff6ff', colorActive: '#2563eb', borderActive: '#bfdbfe', svgSrc: '/invite quote.svg' }
              ].map(service => {
                const isSelected = editForm.activeServices.includes(service.name);
                return (
                  <button
                    key={service.name}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setEditForm({ ...editForm, activeServices: editForm.activeServices.filter((s: string) => s !== service.name) });
                      } else {
                        setEditForm({ ...editForm, activeServices: [...editForm.activeServices, service.name] });
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '2rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? `1px solid ${service.borderActive}` : '1px dashed #cbd5e1',
                      backgroundColor: isSelected ? service.bgActive : '#f8fafc',
                      color: isSelected ? service.colorActive : '#64748b',
                      transition: 'all 0.15s'
                    }}
                  >
                    <img 
                      src={service.svgSrc} 
                      alt={service.name} 
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        objectFit: 'contain',
                        opacity: isSelected ? 1 : 0.4
                      }} 
                    />
                    {service.name}
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? service.colorActive : '#94a3b8',
                      marginLeft: '0.25rem'
                    }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic Details Form Inputs */}
          <div className="card-premium">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>Basic Details</h3>
              <div style={{ position: 'relative' }}>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  style={{
                    appearance: 'none',
                    padding: '0.375rem 2rem 0.375rem 1rem',
                    border: '1px solid #bfdbfe',
                    borderRadius: '0.5rem',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Active">Live</option>
                  <option value="Busy">Busy</option>
                  <option value="Offline">Offline</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#2563eb', pointerEvents: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Email <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="email" 
                  value={editForm.email} 
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="form-input-prem"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="form-input-prem"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>DOB <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={editForm.dob} 
                    onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                    className="form-input-prem"
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <Calendar size={14} style={{ position: 'absolute', right: '0.875rem', color: '#64748b', pointerEvents: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Selected Language <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.375rem 0.875rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.5rem',
                  backgroundColor: '#f8fafc',
                  minHeight: '38px',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                      borderRadius: '0.25rem',
                      padding: '0.125rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      Hindi
                      <span style={{ marginLeft: '0.25rem', color: '#2563eb', fontWeight: 'bold' }}>×</span>
                    </span>
                  </div>
                  <ChevronDown size={14} style={{ color: '#64748b' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Inputs */}
          <div className="card-premium">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '1.25rem' }}>Profile Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Bio rich editor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Bio <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  {/* Rich Text Toolbar */}
                  <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #cbd5e1', padding: '0.5rem', backgroundColor: '#f8fafc', alignItems: 'center' }}>
                    <select style={{ border: 'none', background: 'transparent', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', outline: 'none' }}>
                      <option>14</option>
                    </select>
                    <span style={{ width: '1px', height: '12px', backgroundColor: '#cbd5e1' }} />
                    <button type="button" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', padding: '2px 4px' }}>T</button>
                    <button type="button" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: '#4b5563', padding: '2px 4px' }}><Bold size={10} /></button>
                    <button type="button" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#4b5563', padding: '2px 4px' }}><Italic size={10} /></button>
                    <button type="button" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#4b5563', padding: '2px 4px' }}><Underline size={10} /></button>
                    <span style={{ width: '1px', height: '12px', backgroundColor: '#cbd5e1' }} />
                    <button type="button" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#4b5563', padding: '2px 4px' }}><AlignLeft size={10} /></button>
                    <button type="button" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#4b5563', padding: '2px 4px' }}><AlignCenter size={10} /></button>
                    <button type="button" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#4b5563', padding: '2px 4px' }}><AlignRight size={10} /></button>
                    <button type="button" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#4b5563', padding: '2px 4px' }}><List size={10} /></button>
                  </div>
                  
                  {/* Bio Text Area */}
                  <div style={{ position: 'relative' }}>
                    <textarea 
                      value={editForm.bio} 
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem 1.75rem 0.875rem',
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        lineHeight: 1.5,
                        resize: 'none'
                      }}
                      placeholder="Add Body to your post"
                    />
                    <div style={{ position: 'absolute', right: '0.75rem', bottom: '0.375rem', fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                      {editForm.bio.length} / 200
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid elements */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Experience (in years) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="text" 
                    value={editForm.experience} 
                    onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                    className="form-input-prem"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Availability <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={editForm.availability}
                      onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
                      style={{
                        appearance: 'none',
                        width: '100%',
                        padding: '0.625rem 2rem 0.625rem 0.875rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.5rem',
                        outline: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Demo Manufacturer">Demo Manufacturer</option>
                      <option value="Mon, Tue, Wed, Thu, Fri">Mon, Tue, Wed, Thu, Fri</option>
                      <option value="Mon, Tue, Wed, Thu, Fri, Sat">Mon, Tue, Wed, Thu, Fri, Sat</option>
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Location Preference <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.375rem 0.875rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    minHeight: '38px',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        borderRadius: '0.25rem',
                        padding: '0.125rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        Delhi NCR
                        <span style={{ marginLeft: '0.25rem', color: '#2563eb', fontWeight: 'bold' }}>×</span>
                      </span>
                    </div>
                    <ChevronDown size={14} style={{ color: '#64748b' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Skills <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.375rem 0.875rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    minHeight: '38px',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        borderRadius: '0.25rem',
                        padding: '0.125rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        Skill Tag 1
                        <span style={{ marginLeft: '0.25rem', color: '#2563eb', fontWeight: 'bold' }}>×</span>
                      </span>
                    </div>
                    <ChevronDown size={14} style={{ color: '#64748b' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Machines / Brands familiar with <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.375rem 0.875rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    minHeight: '38px',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        borderRadius: '0.25rem',
                        padding: '0.125rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        Machine Tag 1
                        <span style={{ marginLeft: '0.25rem', color: '#2563eb', fontWeight: 'bold' }}>×</span>
                      </span>
                    </div>
                    <ChevronDown size={14} style={{ color: '#64748b' }} />
                  </div>
                </div>
              </div>

              {/* Audio & Video Pitch Players with Delete Pitch buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '0.5rem' }}>
                {/* Audio Pitch SVG */}
                <div style={{ display: 'block', borderRadius: '12px', overflow: 'hidden' }}>
                  <img src="/recording.svg" alt="Mechanic Audio Pitch" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>

                {/* Video Pitch SVG */}
                <div style={{ display: 'block', borderRadius: '12px', overflow: 'hidden' }}>
                  <img src="/mm_video.svg" alt="Mechanic Video Pitch" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              </div>

            </div>
          </div>

          {/* Documents Card (full-width at the bottom) */}
          <div className="card-premium">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '1.25rem' }}>Documents</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Row 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Name as on Aadhar Card <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="text" 
                    value={editForm.aadharName} 
                    onChange={(e) => setEditForm({ ...editForm, aadharName: e.target.value })}
                    className="form-input-prem"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Aadhar Number <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="text" 
                    value={editForm.aadharNumber} 
                    onChange={(e) => setEditForm({ ...editForm, aadharNumber: e.target.value })}
                    className="form-input-prem"
                  />
                </div>
              </div>
              
              <div style={{ borderTop: '1px dashed #cbd5e1' }} />

              {/* Row 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1.5rem', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Name as on PAN Card <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="text" 
                    value={editForm.panName} 
                    onChange={(e) => setEditForm({ ...editForm, panName: e.target.value })}
                    className="form-input-prem"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PAN Number <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="text" 
                    value={editForm.panNumber} 
                    onChange={(e) => setEditForm({ ...editForm, panNumber: e.target.value })}
                    className="form-input-prem"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PAN Card Uploaded <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      flex: 1,
                      height: '38px'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        {editForm.panCardFile}
                        <span style={{ display: 'inline-flex', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>✓</span>
                      </span>
                    </div>
                    <button 
                      type="button"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'white',
                        color: '#dc2626',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        height: '38px'
                      }}
                    >
                      Replaced
                      <RotateCw size={12} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
