'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMechanics } from '../../_hooks/useMechanics';
import { 
  ChevronLeft, 
  Copy, 
  Check, 
  Play, 
  Volume2, 
  VolumeX,
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
  List,
  MoreVertical,
  ChevronsUpDown,
  IndianRupee,
  Briefcase,
  Clock,
  Award,
  Flag,
  Star
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = outerRadius + 8;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const percentageVal = Math.round(percent * 100);
  if (percentageVal === 0) return null;

  return (
    <g>
      <rect
        x={x - 10}
        y={y - 6}
        width={20}
        height={12}
        rx={3}
        fill="white"
        stroke="#e5e7eb"
        strokeWidth={1}
      />
      <text
        x={x}
        y={y + 0.5}
        fill="#374151"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="7px"
        fontWeight="bold"
      >
        {`${percentageVal}%`}
      </text>
    </g>
  );
};

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

// ── Custom Audio Pitch Player Component ──────────────────────────────────────────
type AudioPitchPlayerProps = {
  src: string;
  onDelete?: () => void;
};

function AudioPitchPlayer({ src, onDelete }: AudioPitchPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.error("Audio play error:", err));
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    let newTime = audioRef.current.currentTime + seconds;
    if (newTime < 0) newTime = 0;
    if (newTime > duration) newTime = duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      flex: 1
    }}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Mechanic Audio Pitch</span>
        {onDelete && (
          <button 
            type="button"
            onClick={onDelete}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)',
              transition: 'background-color 0.2s, transform 0.1s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            Delete Pitch
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '3rem 2rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        minHeight: '260px',
        justifyContent: 'center'
      }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ position: 'relative', width: '100%', height: '8px', display: 'flex', alignItems: 'center' }}>
            <input 
              type="range" 
              min={0} 
              max={duration || 100} 
              value={currentTime} 
              onChange={handleSeek}
              className="player-range-slider"
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                appearance: 'none',
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(currentTime / (duration || 100)) * 100}%, #e2e8f0 ${(currentTime / (duration || 100)) * 100}%, #e2e8f0 100%)`,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '0.5rem' }}>
          <button 
            type="button"
            onClick={toggleMute}
            style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#1e40af', display: 'flex', padding: '0.5rem' }}
          >
            {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>

          <button 
            type="button"
            onClick={() => skip(-10)}
            style={{ 
              border: 'none', 
              backgroundColor: 'transparent', 
              cursor: 'pointer', 
              color: '#1e40af', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              position: 'relative'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 2v6h6" />
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 13.5" />
            </svg>
            <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 900, top: '9px', color: '#1e40af' }}>10</span>
          </button>

          <button 
            type="button"
            onClick={togglePlay}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#1e40af',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(30, 64, 175, 0.3)',
              transition: 'transform 0.15s, background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="4" height="16" /><rect x="16" y="4" width="4" height="16" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '4px' }}><polygon points="5 3 19 12 5 21" /></svg>
            )}
          </button>

          <button 
            type="button"
            onClick={() => skip(10)}
            style={{ 
              border: 'none', 
              backgroundColor: 'transparent', 
              cursor: 'pointer', 
              color: '#1e40af', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              position: 'relative'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6" />
              <path d="M3 11.5a8.38 8.38 0 0 0 .9 3.8 8.5 8.5 0 0 0 7.6 4.7 8.38 8.38 0 0 0 3.8-.9L21 13.5" />
            </svg>
            <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 900, top: '9px', color: '#1e40af' }}>10</span>
          </button>

          <a 
            href={src} 
            download="audio_pitch.mp3"
            style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#1e40af', display: 'flex', padding: '0.5rem' }}
          >
            <Download size={22} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Custom Video Pitch Player Component ──────────────────────────────────────────
type VideoPitchPlayerProps = {
  src: string;
  onDelete?: () => void;
};

function VideoPitchPlayer({ src, onDelete }: VideoPitchPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartPlay = () => {
    if (!src) return;
    setIsPlaying(true);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      flex: 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Mechanic Video Pitch</span>
        {onDelete && (
          <button 
            type="button"
            onClick={onDelete}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)',
              transition: 'background-color 0.2s, transform 0.1s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            Delete Pitch
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        backgroundColor: '#0f172a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '260px'
      }}>
        {isPlaying ? (
          <video
            src={src}
            controls
            autoPlay
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div 
            onClick={handleStartPlay}
            style={{ 
              width: '100%', 
              height: '100%', 
              cursor: 'pointer', 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img 
              src="/mm_video.svg" 
              alt="Mechanic Video Pitch Preview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}


export default function MechanicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string);

  // Load API helper methods
  const { fetchMechanicDetails, updateMechanic, fetchMechanicJobs, fetchMechanicPerformance, updateMechanicStatus } = useMechanics();

  // Empty default — all data comes from the API
  const defaultData = {};
  
  // State variables
  const [mechanic, setMechanic] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'jobs' | 'performance'>('details');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [openServiceMenu, setOpenServiceMenu] = useState<string | null>(null);
  const [openJobDropdownId, setOpenJobDropdownId] = useState<string | null>(null);

  // API states
  const [apiJobs, setApiJobs] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any>(null);
  const [timeframe, setTimeframe] = useState('this_week');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  React.useEffect(() => {
    setIsMounted(true);
    const handleClickOutside = () => {
      setOpenServiceMenu(null);
      setOpenJobDropdownId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Fetch Mechanic Profile details from API
  useEffect(() => {
    let active = true;
    const loadDetails = async () => {
      let data = await fetchMechanicDetails(id);
      if (!data) {
        // Last-resort fallback to local mocks
        const mockMatch = MOCK_MECHANIC_DETAILS[id];
        if (mockMatch) {
          data = mockMatch;
        } else {
          // Synthesize a fallback so UI components don't crash
          const name = `Mechanic Profile #${id.replace(/^m-?/i, '')}`;
          data = {
            display_name: name,
            city: 'Delhi NCR',
            phone: '+91 98765 43210',
            email: 'mechanic@sewtech.in',
            dob: '1990-01-01',
            languages: ['Hindi', 'English'],
            joiningDate: new Date().toISOString(),
            status: 'Active',
            rating: 4.5,
            acceptanceRate: 90,
            completionRate: 85,
            experience: 5,
            bio: 'Profile under registration. Details will be shown once verified by administrator.',
            skills: ['Lockstitch Machinery'],
            machinesFamiliar: ['Singer', 'Juki'],
            activeServices: ['Instant Smart Booking', 'Invite Quote'],
            documents: {
              aadharName: name,
              aadharNumber: 'XXXX XXXX 1234',
              panName: name,
              panNumber: 'ABCDE1234F'
            }
          };
        }
      }

      if (active) {
        const resolved = {
          ...data,
          // Core identity
          name:             data.display_name        ?? data.name             ?? '',
          location:         data.city || data.location || 'Delhi NCR',
          // Contact / basic details (all API spec field variants)
          email:            data.email               ?? '',
          phone:            data.phone               ?? data.mobile            ?? '',
          dob:              (() => {
            const raw = data.dob ?? data.date_of_birth ?? data.dateOfBirth ?? '';
            if (!raw) return '';
            try { return new Date(raw).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return raw; }
          })(),
          selectedLanguage: Array.isArray(data.languages)
                              ? data.languages.join(', ')
                              : (data.languages ?? data.selectedLanguage ?? data.language ?? ''),
          joiningDate:      (() => {
            const raw = data.joiningDate ?? data.joining_date ?? data.created_at ?? data.createdAt ?? '';
            if (!raw) return '';
            try { return new Date(raw).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return raw; }
          })(),
          status:           data.status ?? '',
          acceptanceRate:   data.acceptanceRate  !== undefined ? `${data.acceptanceRate}%`  : '',
          completionRate:   data.completionRate  !== undefined ? `${data.completionRate}%`  : '',
          // Profile fields
          rating:           data.rating          ?? 0,
          totalJobs:        data.jobsCompleted   ?? data.totalJobs ?? 0,
          lastJob:          data.lastJob         ?? data.lastActivity ?? data.availability ?? '',
          experience:       data.experience      ?? '',
          bio:              data.bio             ?? '',
          skills:           data.skills          ?? [],
          machinesFamiliar: data.machinesFamiliar ?? [],
          activeServices:   data.activeServices  ?? [],
          // KYC documents
          aadharName:       data.documents?.aadharName    ?? '',
          aadharNumber:     data.documents?.aadharNumber  ?? '',
          panName:          data.documents?.panName       ?? '',
          panNumber:        data.documents?.panNumber     ?? '',
          panCardFile:      data.documents?.panCardFileUrl ?? '',
          // Media
          audioPitchUrl:    data.media?.audioPitchUrl ?? '',
          videoPitchUrl:    data.media?.videoPitchUrl ?? '',
        };
        setMechanic(resolved);
        setEditForm(resolved);
      }
    };
    loadDetails();
    return () => { active = false; };
  }, [id, fetchMechanicDetails]);

  // Form edit temporary states
  const [editForm, setEditForm] = useState<any>(null);

  // Subtabs & filters inside Jobs Tab
  const [jobsSubtab, setJobsSubtab] = useState<'All' | 'Instant Smart Booking' | 'Invite Quote' | 'Video Call Assistance' | 'Assisted Booking'>('All');
  const [jobsFilter, setJobsFilter] = useState<'All' | 'Ongoing' | 'Completed' | 'Diagnosis Available' | 'Cancelled'>('All');

  // Fetch Jobs dynamically
  useEffect(() => {
    if (activeTab !== 'jobs') return;
    let active = true;
    const loadJobs = async () => {
      const res = await fetchMechanicJobs(id, {
        tab: jobsSubtab === 'All' ? undefined : jobsSubtab,
        status: jobsFilter === 'All' ? undefined : jobsFilter
      });
      if (active && res && res.success) {
        setApiJobs(res.data);
      }
    };
    loadJobs();
    return () => { active = false; };
  }, [id, activeTab, jobsSubtab, jobsFilter, fetchMechanicJobs]);

  // Fetch Performance dynamically
  useEffect(() => {
    if (activeTab !== 'performance') return;
    let active = true;
    const loadPerformance = async () => {
      const res = await fetchMechanicPerformance(id, timeframe);
      if (active && res && res.success) {
        setPerformance(res.data);
      }
    };
    loadPerformance();
    return () => { active = false; };
  }, [id, activeTab, timeframe, fetchMechanicPerformance]);

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
  const handleSaveChanges = async () => {
    // Mock IDs are "m1", "m2", etc. — everything else is a real API numeric ID
    const mockRecord = /^m\d+$/i.test(String(id));

    try {
      let latestStatus = mechanic.status;

      // 1. If status changed, call PATCH /status endpoint
      if (editForm.status !== mechanic.status) {
        const statusRes = await updateMechanicStatus(
          id,
          editForm.status,
          `Status updated to ${editForm.status} from detail edit page.`
        );
        if (statusRes && statusRes.success) {
          latestStatus = editForm.status;
        } else {
          setToastMessage(statusRes?.error || 'Failed to update status. Please try again.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
          return;
        }
      }

      // 2. Call PUT /applications/{id} to save profile fields
      const payload: any = {
        display_name: editForm.name || editForm.display_name,
        phone:        editForm.phone,
        email:        editForm.email,
        city:         editForm.location || editForm.city,
        bio:          editForm.bio,
        experience:   editForm.experience,
        jobsCompleted: editForm.totalJobs ?? 0,
        skills:       Array.isArray(editForm.skills) ? editForm.skills : [],
        machinesFamiliar: Array.isArray(editForm.machinesFamiliar) ? editForm.machinesFamiliar : [],
        documents: {
          aadharName:   editForm.aadharName   || '',
          aadharNumber: editForm.aadharNumber || '',
          panName:      editForm.panName      || '',
          panNumber:    editForm.panNumber    || '',
        },
      };

      const res = await updateMechanic(id, payload);

      if (res && res.success) {
        // Merge returned data (or echoed payload) back into local state
        const returnedData = res.data ?? payload;
        const resolved = {
          ...mechanic,
          ...editForm,
          name:         returnedData.display_name      ?? returnedData.name      ?? editForm.name,
          location:     returnedData.city              ?? returnedData.location  ?? editForm.location,
          bio:          returnedData.bio               ?? editForm.bio,
          experience:   returnedData.experience        ?? editForm.experience,
          totalJobs:    returnedData.jobsCompleted     ?? returnedData.totalJobs ?? editForm.totalJobs,
          lastJob:      returnedData.lastJob           ?? returnedData.lastActivity ?? editForm.lastJob,
          skills:       returnedData.skills            ?? editForm.skills,
          machinesFamiliar: returnedData.machinesFamiliar ?? editForm.machinesFamiliar,
          aadharName:   returnedData.documents?.aadharName   ?? returnedData.aadharName   ?? editForm.aadharName,
          aadharNumber: returnedData.documents?.aadharNumber ?? returnedData.aadharNumber ?? editForm.aadharNumber,
          panName:      returnedData.documents?.panName      ?? returnedData.panName      ?? editForm.panName,
          panNumber:    returnedData.documents?.panNumber    ?? returnedData.panNumber    ?? editForm.panNumber,
          panCardFile:  returnedData.documents?.panCardFileUrl ?? returnedData.panCardFile ?? editForm.panCardFile,
          status:       latestStatus,
        };
        setMechanic(resolved);
        setToastMessage(
          mockRecord
            ? 'Changes saved locally!'
            : 'Mechanic details updated successfully in database!'
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setToastMessage(res?.error || 'Failed to save details. Please try again.');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }
    } catch (err: any) {
      console.error('[MechanicDetailPage] Failed to save changes:', err);
      setToastMessage(err?.message || 'Failed to save changes. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
    setIsEditing(false);
  };

  // Cancel edit
  const handleCancelChanges = () => {
    setIsEditing(false);
  };

  // Local state update when a job is marked completed
  const handleMarkJobCompleted = async (jobId: string) => {
    // 1. Update the job status in apiJobs state
    setApiJobs(prevJobs =>
      prevJobs.map(j => {
        const idMatch = String(j.id || j.jobId || j._id) === String(jobId);
        if (idMatch) {
          return { ...j, status: 'Completed' };
        }
        return j;
      })
    );

    // 2. Increment the total jobs count in mechanic details state
    let updatedJobsCount = 0;
    setMechanic((prevMech: any) => {
      if (!prevMech) return prevMech;
      updatedJobsCount = (prevMech.totalJobs ?? 0) + 1;
      return {
        ...prevMech,
        totalJobs: updatedJobsCount
      };
    });

    // 3. Update the database in real-time
    const mockRecord = /^m\d+$/i.test(String(id));
    if (!mockRecord && mechanic) {
      const payload = {
        display_name: mechanic.name,
        phone:        mechanic.phone,
        email:        mechanic.email,
        city:         mechanic.location,
        jobsCompleted: updatedJobsCount || ((mechanic.totalJobs ?? 0) + 1),
        bio:          mechanic.bio,
        experience:   mechanic.experience,
        skills:       mechanic.skills || [],
        machinesFamiliar: mechanic.machinesFamiliar || [],
      };
      await updateMechanic(id, payload);
    }
  };

  // Mock charts data for performance tab
  const revenueTrendData = performance?.revenueTrend 
    ? performance.revenueTrend.map((r: any) => ({ name: r.date, Revenue: r.revenue }))
    : performance?.ratingTrend 
      ? performance.ratingTrend.map((r: any) => ({ name: r.date, Revenue: Math.round(r.rating * 1000) }))
      : [
          { name: '1 Feb', Revenue: 4000 },
          { name: '2 Feb', Revenue: 8000 },
          { name: '3 Feb', Revenue: 6000 },
          { name: '4 Feb', Revenue: 10000 },
          { name: '5 Feb', Revenue: 9000 },
          { name: '6 Feb', Revenue: 7500 },
          { name: '7 Feb', Revenue: 9500 },
        ];

  const completedJobsCount = performance?.completionBreakdown?.find((c: any) => c.status === 'Completed')?.count ?? 
                             apiJobs.filter(j => j.status === 'Completed').length;
  const cancelledJobsCount = performance?.completionBreakdown?.find((c: any) => c.status === 'Cancelled')?.count ?? 
                             apiJobs.filter(j => j.status === 'Cancelled').length;

  const performanceBreakdownData = [
    { name: 'Completed', value: completedJobsCount || 80 },
    { name: 'Cancelled', value: cancelledJobsCount || 20 },
  ];

  const typeBreakdownData = performance?.serviceTypeBreakdown
    ? performance.serviceTypeBreakdown.map((s: any) => ({ name: s.type, value: s.count }))
    : performance?.earnings?.categoryWise
      ? performance.earnings.categoryWise.map((c: any) => ({ name: c.category, value: c.earnings }))
      : [
          { name: 'Invite Quote', value: 30 },
          { name: 'Instant Smart Booking', value: 20 },
          { name: 'Video Call Assistance', value: 10 },
          { name: 'Assisted Booking', value: 40 },
        ];

  const jobTrendData = performance?.jobTrend
    ? performance.jobTrend.map((j: any) => ({ name: j.day, 'Total Orders': j.jobs, Return: 0, Replacement: 0, Cancellation: 0 }))
    : performance?.jobsTrend
      ? performance.jobsTrend.map((j: any) => ({ name: j.day, 'Total Orders': j.jobs, Return: 0, Replacement: 0, Cancellation: 0 }))
      : [
          { name: '1 Feb', 'Total Orders': 100, Return: 25, Replacement: 10, Cancellation: 5 },
          { name: '2 Feb', 'Total Orders': 120, Return: 30, Replacement: 15, Cancellation: 8 },
          { name: '3 Feb', 'Total Orders': 90, Return: 20, Replacement: 12, Cancellation: 4 },
          { name: '4 Feb', 'Total Orders': 140, Return: 35, Replacement: 20, Cancellation: 10 },
          { name: '5 Feb', 'Total Orders': 110, Return: 28, Replacement: 14, Cancellation: 6 },
          { name: '6 Feb', 'Total Orders': 130, Return: 32, Replacement: 18, Cancellation: 7 },
          { name: '7 Feb', 'Total Orders': 150, Return: 38, Replacement: 22, Cancellation: 9 },
        ];

  const displayTotalJobs = mechanic?.totalJobs || mechanic?.jobsCompleted || (completedJobsCount + cancelledJobsCount) || 0;
  const typeTotal = typeBreakdownData.reduce((acc: number, curr: any) => acc + curr.value, 0);
  const displayRevenue = performance?.earnings?.totalRevenue !== undefined ? performance.earnings.totalRevenue : 15000;
  const displayPayoutPending = performance?.earnings?.totalRevenue !== undefined ? Math.round(performance.earnings.totalRevenue * 0.1) : 15.00;
  const displayChartTotal = completedJobsCount + cancelledJobsCount;

  // Mock jobs list data
  const MOCK_JOBS = [
    { id: 'JOB-2041', customerName: 'Aditya Bhargav', type: 'Instant Smart Booking', location: 'Bangalore', date: "10:30 PM, 21 Jan' 26", status: 'Ongoing', feedback: '' },
    { id: 'JOB-2042', customerName: 'Aditya Bhargav', type: 'Instant Smart Booking', location: 'Bangalore', date: "10:30 PM, 21 Jan' 26", status: 'Completed', feedback: '4.5 ★' },
    { id: 'JOB-2043', customerName: 'Aditya Bhargav', type: 'Invite Quote', location: 'Bangalore', date: "10:30 PM, 21 Jan' 26", status: 'Diagnosis Available', feedback: '' },
    { id: 'JOB-2044', customerName: 'Aditya Bhargav', type: 'Video Call Assistance', location: 'Bangalore', date: "10:30 PM, 21 Jan' 26", status: 'Cancelled', feedback: '' },
    { id: 'JOB-2045', customerName: 'Rohan Sharma', type: 'Assisted Booking', location: 'Delhi NCR', date: "09:15 AM, 20 Jan' 26", status: 'Completed', feedback: '5.0 ★' },
    { id: 'JOB-2046', customerName: 'Priya Patel', type: 'Invite Quote', location: 'Mumbai', date: "04:30 PM, 19 Jan' 26", status: 'Ongoing', feedback: '' }
  ];

  const displayJobs = apiJobs.map(j => ({
    id: j.job_id ?? j.jobId ?? j.id,
    customerName: j.customerName,
    type: j.service ?? j.serviceType,
    location: j.location,
    date: j.date ? new Date(j.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '-',
    status: j.status,
    feedback: j.feedbackRating ? `${j.feedbackRating} ★` : j.feedbackText || ''
  }));

  const filteredJobs = displayJobs.filter(job => {
    // Subtab filter
    if (jobsSubtab !== 'All' && job.type !== jobsSubtab) return false;
    
    // Status filter
    if (jobsFilter === 'All') return true;
    return job.status === jobsFilter;
  });

  // Show loading while API fetches mechanic data
  if (!mechanic) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#6b7280', fontSize: '1rem' }}>
        Loading mechanic details...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease-out' }}>
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          {toastMessage}
        </div>
      )}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .player-range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #2563eb;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .player-range-slider::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #2563eb;
            cursor: pointer;
            border: none;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111827'}
            >
              Edit Mechanic Details
              <Edit3 size={14} />
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
                backgroundColor:
                  mechanic.status === 'Bid Live' ? '#d1fae5' :
                  mechanic.status === 'Under Review' ? '#fffbeb' :
                  mechanic.status === 'Services Paused' ? '#f3f4f6' : '#fef2f2',
                color:
                  mechanic.status === 'Bid Live' ? '#065f46' :
                  mechanic.status === 'Under Review' ? '#d97706' :
                  mechanic.status === 'Services Paused' ? '#4b5563' : '#991b1b'
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
                  {(mechanic.activeServices || []).map((service: string) => {
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
                      <span key={service} className={`tag-pill ${pillClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.625rem 0.375rem 0.875rem', borderRadius: '2rem', fontSize: '0.8125rem', fontWeight: 600, position: 'relative' }}>
                        <img src={svgSrc} alt={service} style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                        {service}
                        <MoreVertical 
                          size={14} 
                          style={{ color: '#9ca3af', marginLeft: '0.25rem', cursor: 'pointer' }} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenServiceMenu(openServiceMenu === service ? null : service);
                          }}
                        />
                        {openServiceMenu === service && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '0.25rem',
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            zIndex: 100,
                            minWidth: '220px',
                            overflow: 'hidden',
                            textAlign: 'left'
                          }} onClick={(e) => e.stopPropagation()}>
                            <div 
                              style={{ padding: '0.625rem 1.25rem', fontSize: '0.75rem', color: '#374151', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                              onClick={() => {
                                // Mock behavior
                                setOpenServiceMenu(null);
                              }}
                            >
                              Pause Service
                            </div>
                            <div 
                              style={{ padding: '0.625rem 1.25rem', fontSize: '0.75rem', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                              onClick={() => {
                                // Mock behavior
                                setOpenServiceMenu(null);
                              }}
                            >
                              Suspend Mechanic From This Service
                            </div>
                          </div>
                        )}
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
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Bio:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', lineHeight: 1.6 }}>{mechanic.bio}</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Experience (in years):</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.experience}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Availability:</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.availability}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Location Preference:</span>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', backgroundColor: 'transparent', color: '#1f2937', fontWeight: 600 }}>
                          {mechanic.location}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Skills:</span>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {(mechanic.skills || []).map((skill: string) => (
                          <span key={skill} style={{ fontSize: '0.75rem', backgroundColor: 'white', color: '#4b5563', border: '1px solid #e5e7eb', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontWeight: 600 }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Machines/Brands familiar with:</span>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {(mechanic.machinesFamiliar || []).slice(0, 3).map((mach: string, idx: number) => (
                          <span key={idx} style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: 'white', color: '#4b5563', border: '1px solid #e5e7eb', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontWeight: 600 }}>
                            {mach}
                            <ExternalLink size={10} style={{ color: '#9ca3af' }} />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Audio & Video Pitch Players */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                    <AudioPitchPlayer 
                      src={mechanic?.media?.audioPitchUrl || mechanic?.audioPitchUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'} 
                      onDelete={() => {
                        setToastMessage("Audio pitch deleted successfully!");
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                    />
                    <VideoPitchPlayer 
                      src={mechanic?.media?.videoPitchUrl || mechanic?.videoPitchUrl || 'https://assets.mixkit.co/videos/preview/mixkit-mechanical-gears-close-up-40432-large.mp4'} 
                      onDelete={() => {
                        setToastMessage("Video pitch deleted successfully!");
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                    />
                  </div>

                </div>
              </div>

              {/* Documents Card (Stretching full-width at the bottom) */}
              <div className="card-premium">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '1rem' }}>Documents</h3>
                <div style={{ borderBottom: '1px dashed #d1d5db', marginBottom: '1.5rem' }} />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Row 1 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Name as on Aadhar Card:</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.aadharName}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Aadhar Number:</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.aadharNumber}</span>
                    </div>
                  </div>
                  
                  {/* Row 2 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>Name as on PAN Card:</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.panName}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>PAN Number:</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{mechanic.panNumber}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>PAN Card Uploaded:</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#eff6ff', border: 'none', borderRadius: '0.375rem', padding: '0.375rem 0.625rem', width: 'fit-content' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
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
                  { id: 'All', label: 'All (1086)' },
                  { id: 'Instant Smart Booking', label: 'Instant Smart Booking (1086)' },
                  { id: 'Invite Quote', label: 'Invite Quote (1086)' },
                  { id: 'Video Call Assistance', label: 'Video Call Assistance (1086)' },
                  { id: 'Assisted Booking', label: 'Assisted Booking (1086)' }
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
                ].map(pill => {
                  const isActive = jobsFilter === pill.id;
                  const isAll = pill.id === 'All';
                  
                  return (
                    <button
                      key={pill.id}
                      onClick={() => setJobsFilter(pill.id as any)}
                      style={{
                        border: isActive ? '1px solid #111827' : '1px solid #cbd5e1',
                        background: isActive ? '#111827' : 'white',
                        color: isActive ? 'white' : '#4b5563',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '2rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {isActive ? (
                        <Check size={12} style={{ color: 'white' }} />
                      ) : (
                        !isAll && <span style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: '10px' }}>+</span>
                      )}
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {/* Jobs Table */}
              <div style={{ overflowX: 'auto', margin: '0 -1.5rem -1.5rem -1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                      <th style={{ padding: '1rem 1.5rem', width: '40px' }}>
                        <input type="checkbox" style={{ accentColor: '#111827', cursor: 'pointer' }} />
                      </th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          Order
                          <ChevronsUpDown size={12} style={{ color: '#9ca3af' }} />
                        </div>
                      </th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          Location
                          <ChevronsUpDown size={12} style={{ color: '#9ca3af' }} />
                        </div>
                      </th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          Created On
                          <ChevronsUpDown size={12} style={{ color: '#9ca3af' }} />
                        </div>
                      </th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          Status
                          <ChevronsUpDown size={12} style={{ color: '#9ca3af' }} />
                        </div>
                      </th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          Feedback
                          <ChevronsUpDown size={12} style={{ color: '#9ca3af' }} />
                        </div>
                      </th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <tr key={job.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <input type="checkbox" style={{ accentColor: '#111827', cursor: 'pointer' }} />
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img 
                                src="/avatar-clean.svg" 
                                alt="avatar" 
                                style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  borderRadius: '50%', 
                                  border: '2px solid #3b82f6',
                                  objectFit: 'contain'
                                }} 
                              />
                              <div>
                                <div style={{ fontWeight: 600, color: '#111827' }}>{job.customerName}</div>
                                <span style={{ 
                                  fontSize: '10px', 
                                  color: '#2563eb', 
                                  border: '1px solid #bfdbfe', 
                                  borderRadius: '0.25rem', 
                                  padding: '0.05rem 0.375rem',
                                  backgroundColor: '#eff6ff',
                                  display: 'inline-block',
                                  marginTop: '0.125rem',
                                  fontWeight: 600
                                }}>
                                  Request ID
                                </span>
                              </div>
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
                          <td style={{ padding: '1rem' }}>
                            {job.feedback ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.125rem', color: '#f59e0b', fontWeight: 600 }}>
                                {job.feedback.replace(' ★', '')}
                                <Star size={12} fill="#f59e0b" stroke="none" />
                              </span>
                            ) : (
                              <span style={{ color: '#9ca3af' }}>--</span>
                            )}
                          </td>
                          <td style={{ padding: '1rem 1.5rem', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                              <button style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.375rem 0.75rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '0.375rem',
                                backgroundColor: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                color: '#374151'
                              }}>
                                View
                                <ExternalLink size={12} />
                              </button>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenJobDropdownId(openJobDropdownId === job.id ? null : job.id);
                                }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: '0.375rem',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '0.375rem',
                                  backgroundColor: 'white',
                                  cursor: 'pointer',
                                  color: '#4b5563'
                                }}
                              >
                                <MoreVertical size={14} />
                              </button>

                              {/* Dropdown Menu */}
                              {openJobDropdownId === job.id && (
                                <div 
                                  style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: '1.5rem',
                                    marginTop: '0.25rem',
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                    zIndex: 50,
                                    minWidth: '160px',
                                    overflow: 'hidden',
                                    textAlign: 'left'
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {job.status !== 'Completed' && (
                                    <div 
                                      style={{ padding: '0.625rem 1rem', fontSize: '0.75rem', color: '#059669', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}
                                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
                                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                      onClick={() => {
                                        handleMarkJobCompleted(job.id);
                                        setOpenJobDropdownId(null);
                                      }}
                                    >
                                      Mark Completed
                                    </div>
                                  )}
                                  <div 
                                    style={{ padding: '0.625rem 1rem', fontSize: '0.75rem', color: '#374151', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    onClick={() => {
                                      router.push(`/jobs/${job.id}`);
                                      setOpenJobDropdownId(null);
                                    }}
                                  >
                                    View Details
                                  </div>

                                </div>
                              )}
                            </div>
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
              
              {/* Filter Row */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
                <div style={{
                  padding: '0.375rem 1rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer'
                }}>
                  Last 7 Days
                  <ChevronDown size={12} style={{ color: '#64748b' }} />
                </div>
              </div>

              {/* Performance Mini KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                {/* Total Jobs */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '0.25rem', borderRadius: '0.25rem', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                      <Briefcase size={12} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Total Jobs</span>
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>{displayTotalJobs}</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '0.6875rem', fontWeight: 600 }}>
                    <Briefcase size={10} />
                    {displayTotalJobs}
                  </div>
                </div>

                {/* Revenue */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '0.25rem', borderRadius: '0.25rem', backgroundColor: '#fffbeb', color: '#d97706' }}>
                      <IndianRupee size={12} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Revenue</span>
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>₹{displayRevenue.toLocaleString('en-IN')}</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', backgroundColor: '#fffbeb', color: '#d97706', fontSize: '0.6875rem', fontWeight: 600 }}>
                    <IndianRupee size={10} />
                    ₹{displayRevenue.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Payout Pending */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '0.25rem', borderRadius: '0.25rem', backgroundColor: '#fffbeb', color: '#d97706' }}>
                      <Clock size={12} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Payout Pending</span>
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>₹{displayPayoutPending.toLocaleString('en-IN')}</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', backgroundColor: '#fffbeb', color: '#d97706', fontSize: '0.6875rem', fontWeight: 600 }}>
                    <Clock size={10} />
                    ₹{displayPayoutPending.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* SLA Adherence */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '0.25rem', borderRadius: '0.25rem', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                      <Award size={12} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>SLA adherence</span>
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>90%</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', backgroundColor: '#f0fdf4', color: '#16a34a', fontSize: '0.6875rem', fontWeight: 600 }}>
                    <Award size={10} />
                    90%
                  </div>
                </div>

                {/* Flags */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '0.25rem', borderRadius: '0.25rem', backgroundColor: '#fef2f2', color: '#dc2626' }}>
                      <Flag size={12} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Flags</span>
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.25rem' }}>10</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '0.6875rem', fontWeight: 600 }}>
                    <Flag size={10} />
                    10
                  </div>
                </div>
              </div>

              {/* Charts grid 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                {/* Doughnut 1: Job Performance Breakdown */}
                <div className="card-premium">
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: '1.25rem' }}>Job Performance Breakdown</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', width: '100%', minHeight: '200px', flexWrap: 'wrap' }}>
                    {/* Donut Chart */}
                    <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {isMounted ? (
                        <PieChart width={200} height={200}>
                          <Pie
                            data={performanceBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                            label={renderCustomizedLabel}
                            labelLine={false}
                            stroke="none"
                          >
                            {performanceBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      ) : (
                        <div style={{ width: '200px', height: '200px', backgroundColor: '#f8fafc' }} />
                      )}
                      <div style={{ position: 'absolute', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{displayChartTotal}</div>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Accepted</div>
                      </div>
                    </div>

                    {/* Side Legend */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#4b5563', fontWeight: 600 }}>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                        Completed
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#4b5563', fontWeight: 600 }}>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                        Cancelled
                      </div>
                    </div>
                  </div>
                </div>

                {/* Line Chart: Revenue Trend */}
                <div className="card-premium">
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: '1.25rem' }}>Revenue Trend</h3>
                  <div style={{ height: '240px' }}>
                    {isMounted ? (
                      <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height="100%">
                        <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip />
                          <Area type="monotone" dataKey="Revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" dot={{ fill: '#f59e0b', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </AreaChart>
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', width: '100%', minHeight: '200px', flexWrap: 'wrap' }}>
                    {/* Donut Chart */}
                    <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {isMounted ? (
                        <PieChart width={200} height={200}>
                          <Pie
                            data={typeBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                            label={renderCustomizedLabel}
                            labelLine={false}
                            stroke="none"
                          >
                            {typeBreakdownData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      ) : (
                        <div style={{ width: '200px', height: '200px', backgroundColor: '#f8fafc' }} />
                      )}
                      <div style={{ position: 'absolute', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>{typeTotal}</div>
                        <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>Total Jobs</div>
                      </div>
                    </div>
                    
                    {/* Side Legend */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                        Invite Quote
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                        Smart Booking
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                        Video Call
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                        Assisted Booking
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bar Chart: Job Trend */}
                <div className="card-premium">
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: '1.25rem' }}>Job Trend</h3>
                  <div style={{ height: '260px' }}>
                    {isMounted ? (
                      <ResponsiveContainer minWidth={0} minHeight={0} width="100%" height="100%">
                        <BarChart data={jobTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div style={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    padding: '0.75rem',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                  }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>{label} Feb 2026</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>
                                      {payload.map((p, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                                          <span style={{ color: p.color }}>{p.name}:</span>
                                          <span style={{ color: '#111827' }}>{p.value}</span>
                                        </div>
                                      ))}
                                      <div style={{ marginTop: '0.375rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.375rem' }}>
                                        <span style={{ color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}>View Orders</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
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
                    { label: 'Product quality (15%)' },
                    { label: 'Product quality (15%)' },
                    { label: 'Wrong size ordered (15%)' },
                    { label: 'Product damaged (15%)' },
                    { label: 'Product damaged (15%)' },
                    { label: 'Received wrong item (15%)' }
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
                      {kw.label}
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
                  <option value="Active">Active</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Services Paused">Services Paused</option>
                  <option value="Suspended">Suspended</option>
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
                    value={editForm.dob || ""} 
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
                      value={Array.isArray(editForm.availability) ? editForm.availability.join(', ') : (editForm.availability || '')}
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
                  <input 
                    type="text" 
                    value={editForm.location || ""} 
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="form-input-prem"
                  />
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
