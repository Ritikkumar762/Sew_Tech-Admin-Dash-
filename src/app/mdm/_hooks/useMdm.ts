'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export interface IndustryItem {
  id: string;
  index: string;
  name: string;
  skillsCount: number;
  machinesCount: number;
}

export interface MachineItem {
  id: string;
  index: string;
  name: string;
  skillsCount: number;
  sparesCount: number;
}

export interface SpareItem {
  id: string;
  index: string;
  name: string;
  skillsCount: number;
  machinesCount: number;
  industriesCount: number;
}

export interface CategoryItem {
  id: string;
  index: string;
  name: string;
  sparesCount: number;
}

export interface SkillItem {
  id: string;
  index: string;
  name: string;
  machinesCount: number;
  industriesCount: number;
}

export type TabType = 
  | 'Industry' 
  | 'Machine & Machine Type' 
  | 'Spares & Categories' 
  | 'Machine Issues' 
  | 'Skills' 
  | 'Brands' 
  | 'Service' 
  | 'Academic';

const INITIAL_INDUSTRIES: IndustryItem[] = [
  { id: 'ind-1', index: '01', name: 'Apparel & Fashion', skillsCount: 12, machinesCount: 12 },
  { id: 'ind-2', index: '02', name: 'Medical & Healthcare Textiles', skillsCount: 12, machinesCount: 12 },
  { id: 'ind-3', index: '03', name: 'Furniture & Upholstery', skillsCount: 12, machinesCount: 12 },
  { id: 'ind-4', index: '04', name: 'Bags & Luggage', skillsCount: 12, machinesCount: 12 },
  { id: 'ind-5', index: '05', name: 'Footwear Industry', skillsCount: 12, machinesCount: 12 },
  { id: 'ind-6', index: '06', name: 'Apparel & Fashion', skillsCount: 12, machinesCount: 12 },
  { id: 'ind-7', index: '07', name: 'Apparel & Fashion', skillsCount: 12, machinesCount: 12 },
  { id: 'ind-8', index: '08', name: 'Apparel & Fashion', skillsCount: 12, machinesCount: 12 },
];

const INITIAL_MACHINES: MachineItem[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `mach-${i + 1}`,
  index: `0${i + 1}`,
  name: 'Industrial Single Needle Lockstitch Machine',
  skillsCount: 12,
  sparesCount: 12
}));

const INITIAL_SPARES: SpareItem[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `spare-${i + 1}`,
  index: `0${i + 1}`,
  name: 'Industrial Sewing Machine Needle',
  skillsCount: 12,
  machinesCount: 12,
  industriesCount: 12
}));

const INITIAL_CATEGORIES: CategoryItem[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `category-${i + 1}`,
  index: `0${i + 1}`,
  name: 'Needle',
  sparesCount: 12
}));

const INITIAL_SKILLS: SkillItem[] = [
  { id: 'skill-1', index: '01', name: 'New machine installation', machinesCount: 12, industriesCount: 12 },
  { id: 'skill-2', index: '02', name: 'Table & motor fitting (industrial machines)', machinesCount: 12, industriesCount: 12 },
  { id: 'skill-3', index: '03', name: 'Threading & calibration', machinesCount: 12, industriesCount: 12 },
  { id: 'skill-4', index: '04', name: 'Demo / basic training for users', machinesCount: 12, industriesCount: 12 },
  { id: 'skill-5', index: '05', name: 'Table & motor fitting (industrial machines)', machinesCount: 12, industriesCount: 12 },
  { id: 'skill-6', index: '06', name: 'Table & motor fitting (industrial machines)', machinesCount: 12, industriesCount: 12 },
  { id: 'skill-7', index: '07', name: 'Table & motor fitting (industrial machines)', machinesCount: 12, industriesCount: 12 },
  { id: 'skill-8', index: '08', name: 'Table & motor fitting (industrial machines)', machinesCount: 12, industriesCount: 12 },
];

export function useMdm() {
  const router = useRouter();
  
  // Navigation Left sidebar tabs
  const [activeTab, setActiveTab] = useState<TabType>('Industry');
  
  // Machine secondary inner header tabs
  const [machineSubTab, setMachineSubTab] = useState<'Machines' | 'MachineType'>('Machines');

  // Spares & Categories secondary inner header tabs
  const [sparesSubTab, setSparesSubTab] = useState<'Spares' | 'Categories'>('Spares');

  // Search filter inputs
  const [industrySearch, setIndustrySearch] = useState('');
  const [machineSearch, setMachineSearch] = useState('');
  const [spareSearch, setSpareSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [skillSearch, setSkillSearch] = useState('');

  // States
  const [industries, setIndustries] = useState<IndustryItem[]>(INITIAL_INDUSTRIES);
  const [machines, setMachines] = useState<MachineItem[]>(INITIAL_MACHINES);
  const [spares, setSpares] = useState<SpareItem[]>(INITIAL_SPARES);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [loading, setLoading] = useState(false);

  // API fetches on Tab shifts
  useEffect(() => {
    const loadMdmData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'Industry') {
          const res = await apiClient.get<{ success: boolean; data: IndustryItem[] }>(ENDPOINTS.mdm.industries);
          if (res && res.success && Array.isArray(res.data)) {
            setIndustries(res.data);
          } else {
            setIndustries(INITIAL_INDUSTRIES);
          }
        } else if (activeTab === 'Machine & Machine Type') {
          const res = await apiClient.get<{ success: boolean; data: MachineItem[] }>(ENDPOINTS.mdm.machines);
          if (res && res.success && Array.isArray(res.data)) {
            setMachines(res.data);
          } else {
            setMachines(INITIAL_MACHINES);
          }
        } else if (activeTab === 'Spares & Categories') {
          // fetch both spares and categories, or fallback
          try {
            const sparesRes = await apiClient.get<{ success: boolean; data: SpareItem[] }>(`${ENDPOINTS.mdm.pricing}/spares`); // or whatever endpoint is appropriate, or custom
            if (sparesRes && sparesRes.success && Array.isArray(sparesRes.data)) {
              setSpares(sparesRes.data);
            } else {
              setSpares(INITIAL_SPARES);
            }
          } catch {
            setSpares(INITIAL_SPARES);
          }

          try {
            const catsRes = await apiClient.get<{ success: boolean; data: CategoryItem[] }>(ENDPOINTS.mdm.categories);
            if (catsRes && catsRes.success && Array.isArray(catsRes.data)) {
              setCategories(catsRes.data);
            } else {
              setCategories(INITIAL_CATEGORIES);
            }
          } catch {
            setCategories(INITIAL_CATEGORIES);
          }
        } else if (activeTab === 'Skills') {
          try {
            const skillsRes = await apiClient.get<{ success: boolean; data: SkillItem[] }>(ENDPOINTS.mdm.skills);
            if (skillsRes && skillsRes.success && Array.isArray(skillsRes.data)) {
              setSkills(skillsRes.data);
            } else {
              setSkills(INITIAL_SKILLS);
            }
          } catch {
            setSkills(INITIAL_SKILLS);
          }
        }
      } catch (err) {
        console.warn('Backend server offline. Displaying static MDM timeline history fallback.');
        setIndustries(INITIAL_INDUSTRIES);
        setMachines(INITIAL_MACHINES);
        setSpares(INITIAL_SPARES);
        setCategories(INITIAL_CATEGORIES);
        setSkills(INITIAL_SKILLS);
      } finally {
        setLoading(false);
      }
    };
    loadMdmData();
  }, [activeTab]);

  const handleEditClick = (type: 'industry' | 'machine' | 'machineType' | 'spare' | 'category' | 'skill', id: string) => {
    router.push(`/mdm/${id}?type=${type}`);
  };

  const handleAddNew = (type: 'industry' | 'machine' | 'machineType' | 'spare' | 'category' | 'skill') => {
    router.push(`/mdm/add?type=${type}`);
  };

  const filteredIndustries = useMemo(() => {
    return industries.filter(x => 
      x.name.toLowerCase().includes(industrySearch.toLowerCase())
    );
  }, [industries, industrySearch]);

  const filteredMachines = useMemo(() => {
    return machines.filter(x => 
      x.name.toLowerCase().includes(machineSearch.toLowerCase())
    );
  }, [machines, machineSearch]);

  const filteredSpares = useMemo(() => {
    return spares.filter(x => 
      x.name.toLowerCase().includes(spareSearch.toLowerCase())
    );
  }, [spares, spareSearch]);

  const filteredCategories = useMemo(() => {
    return categories.filter(x => 
      x.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categories, categorySearch]);

  const filteredSkills = useMemo(() => {
    return skills.filter(x => 
      x.name.toLowerCase().includes(skillSearch.toLowerCase())
    );
  }, [skills, skillSearch]);

  const leftTabs: { name: TabType; count: number }[] = useMemo(() => [
    { name: 'Industry', count: industries.length || 20 },
    { name: 'Machine & Machine Type', count: machines.length || 20 },
    { name: 'Spares & Categories', count: spares.length + categories.length || 20 },
    { name: 'Machine Issues', count: 20 },
    { name: 'Skills', count: skills.length || 20 },
    { name: 'Brands', count: 20 },
    { name: 'Service', count: 20 },
    { name: 'Academic', count: 20 },
  ], [industries.length, machines.length, spares.length, categories.length, skills.length]);

  return {
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
    industries,
    machines,
    spares,
    categories,
    skills,
    loading,
    filteredIndustries,
    filteredMachines,
    filteredSpares,
    filteredCategories,
    filteredSkills,
    handleEditClick,
    handleAddNew,
    leftTabs
  };
}
