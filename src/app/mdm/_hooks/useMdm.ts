'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient as baseApiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

const formatUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (API_BASE) {
    const cleanBase = API_BASE.replace(/\/+$/, '');
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    if (cleanBase.endsWith('/api/v1') && cleanUrl.startsWith('/api/v1')) {
      return `${cleanBase}${cleanUrl.substring(7)}`;
    }
    if (cleanBase.endsWith('/api') && cleanUrl.startsWith('/api/')) {
      return `${cleanBase}${cleanUrl.substring(4)}`;
    }
    return `${cleanBase}${cleanUrl}`;
  }
  return url;
};

const apiClient = {
  get: <T>(url: string, opts?: any) => baseApiClient.get<T>(formatUrl(url), opts),
  post: <T>(url: string, body: unknown, opts?: any) => baseApiClient.post<T>(formatUrl(url), body, opts),
  put: <T>(url: string, body: unknown, opts?: any) => baseApiClient.put<T>(formatUrl(url), body, opts),
  delete: <T = void>(url: string, opts?: any) => baseApiClient.delete<T>(formatUrl(url), opts),
};

export interface IndustryItem {
  id: string;
  index: string;
  name: string;
  skillsCount: number;
  machinesCount: number;
  sparesCount: number;
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
  mechanicsCount: number;
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

const INITIAL_INDUSTRIES: IndustryItem[] = [];

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
  { id: 'skill-1', index: '01', name: 'New machine installation', mechanicsCount: 0, machinesCount: 12, industriesCount: 12 },
  { id: 'skill-2', index: '02', name: 'Table & motor fitting (industrial machines)', mechanicsCount: 0, machinesCount: 12, industriesCount: 12 },
  { id: 'skill-3', index: '03', name: 'Threading & calibration', mechanicsCount: 0, machinesCount: 12, industriesCount: 12 },
  { id: 'skill-4', index: '04', name: 'Demo / basic training for users', mechanicsCount: 0, machinesCount: 12, industriesCount: 12 },
  { id: 'skill-5', index: '05', name: 'Table & motor fitting (industrial machines)', mechanicsCount: 0, machinesCount: 12, industriesCount: 12 },
  { id: 'skill-6', index: '06', name: 'Table & motor fitting (industrial machines)', mechanicsCount: 0, machinesCount: 12, industriesCount: 12 },
  { id: 'skill-7', index: '07', name: 'Table & motor fitting (industrial machines)', mechanicsCount: 0, machinesCount: 12, industriesCount: 12 },
  { id: 'skill-8', index: '08', name: 'Table & motor fitting (industrial machines)', mechanicsCount: 0, machinesCount: 12, industriesCount: 12 },
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
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [machines, setMachines] = useState<MachineItem[]>([]);
  const [spares, setSpares] = useState<SpareItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper to parse relations count from serialized description JSON
  const parseRelations = (x: any) => {
    let skillsCount = x.skills?.length || 0;
    let sparesCount = x.spares?.length || 0;
    let machinesCount = x.machines?.length || 0;
    let industriesCount = x.industries?.length || 0;
    let industries = x.industries || [];
    let skills = x.skills || [];
    let spares = x.spares || [];
    let machines = x.machines || [];

    const description = x.description;
    if (description && description.includes('|||')) {
      try {
        const parts = description.split('|||');
        const jsonStr = parts[parts.length - 1];
        const data = JSON.parse(jsonStr);
        if (data.skills) {
          skills = data.skills;
          skillsCount = data.skills.length;
        }
        if (data.spares) {
          spares = data.spares;
          sparesCount = data.spares.length;
        }
        if (data.machines) {
          machines = data.machines;
          machinesCount = data.machines.length;
        }
        if (data.industries) {
          industries = data.industries;
          industriesCount = data.industries.length;
        }
      } catch (e) {
        // ignore
      }
    }
    return { skillsCount, sparesCount, machinesCount, industriesCount, industries, skills, spares, machines };
  };

  // API fetches on Tab/Subtab shifts
  const loadMdmData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'Industry') {
        const res = await apiClient.get<any>(ENDPOINTS.mdm.industries);
        const indData = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);

        const mapped = indData.map((x: any, i: number) => {
          const industryId = String(x.industry_id);
          return {
            id: industryId,
            index: String(i + 1).padStart(2, '0'),
            name: x.name,
            skillsCount: typeof x.skillsCount === 'number' ? x.skillsCount : (x.skills?.length || 0),
            machinesCount: typeof x.machinesCount === 'number' ? x.machinesCount : (x.machines?.length || 0),
            sparesCount: typeof x.sparesCount === 'number' ? x.sparesCount : (x.spares?.length || 0)
          };
        });
        setIndustries(mapped);
      } else if (activeTab === 'Machine & Machine Type') {
        if (machineSubTab === 'Machines') {
          const res = await apiClient.get<any>(ENDPOINTS.mdm.machines);
          const data = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
          const mapped = data.map((x: any, i: number) => {
            const rels = parseRelations(x);
            return {
              id: String(x.machine_model_id),
              index: String(i + 1).padStart(2, '0'),
              name: x.name,
              skillsCount: typeof x.skillsCount === 'number' ? x.skillsCount : rels.skillsCount,
              sparesCount: typeof x.sparesCount === 'number' ? x.sparesCount : rels.sparesCount
            };
          });
          setMachines(mapped);
        } else {
          // Machine Type
          const res = await apiClient.get<any>('/api/v1/mdm/machine-types');
          const data = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
          const mapped = data.map((x: any, i: number) => {
            const rels = parseRelations(x);
            return {
              id: String(x.machine_type_id),
              index: String(i + 1).padStart(2, '0'),
              name: x.name,
              skillsCount: typeof x.skillsCount === 'number' ? x.skillsCount : rels.skillsCount,
              sparesCount: typeof x.sparesCount === 'number' ? x.sparesCount : rels.sparesCount,
              machinesCount: typeof x.machinesCount === 'number' ? x.machinesCount : rels.machinesCount
            };
          });
          setMachines(mapped);
        }
      } else if (activeTab === 'Spares & Categories') {
        if (sparesSubTab === 'Spares') {
          const res = await apiClient.get<any>('/api/v1/mdm/spares');
          const data = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
          const mapped = data.map((x: any, i: number) => {
            const rels = parseRelations(x);
            return {
              id: String(x.product_id),
              index: String(i + 1).padStart(2, '0'),
              name: x.name,
              skillsCount: typeof x.skillsCount === 'number' ? x.skillsCount : rels.skillsCount,
              machinesCount: typeof x.machinesCount === 'number' ? x.machinesCount : rels.machinesCount,
              industriesCount: typeof x.industriesCount === 'number' ? x.industriesCount : rels.industriesCount
            };
          });
          setSpares(mapped);
        } else {
          // Categories
          const res = await apiClient.get<any>(ENDPOINTS.mdm.categories);
          const data = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
          const mapped = data.map((x: any, i: number) => ({
            id: String(x.category_id),
            index: String(i + 1).padStart(2, '0'),
            name: x.name,
            sparesCount: typeof x.sparesCount === 'number' ? x.sparesCount : 0
          }));
          setCategories(mapped);
        }
      } else if (activeTab === 'Skills') {
        const res = await apiClient.get<any>(ENDPOINTS.mdm.skills);
        const data = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
        const mapped = data.map((x: any, i: number) => {
          const rels = parseRelations(x);
          return {
            id: String(x.skill_id),
            index: String(i + 1).padStart(2, '0'),
            name: x.name,
            mechanicsCount: typeof x.mechanicsCount === 'number' ? x.mechanicsCount : ((rels as any).mechanicsCount || 0),
            machinesCount: typeof x.machinesCount === 'number' ? x.machinesCount : rels.machinesCount,
            industriesCount: typeof x.industriesCount === 'number' ? x.industriesCount : rels.industriesCount
          };
        });
        setSkills(mapped);
      }
    } catch (err) {
      console.warn('Backend server error or offline:', err);
      // Fallback
      setIndustries([]);
      setMachines([]);
      setSpares([]);
      setCategories([]);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMdmData();
  }, [activeTab, machineSubTab, sparesSubTab]);

  const handleEditClick = (type: 'industry' | 'machine' | 'machineType' | 'spare' | 'category' | 'skill', id: string) => {
    router.push(`/mdm/${id}?type=${type}`);
  };

  const handleAddNew = (type: 'industry' | 'machine' | 'machineType' | 'spare' | 'category' | 'skill') => {
    router.push(`/mdm/add?type=${type}`);
  };

  const handleDeleteClick = async (type: 'industry' | 'machine' | 'machineType' | 'spare' | 'category' | 'skill', id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }
    
    setLoading(true);
    try {
      let endpoint = '';
      if (type === 'industry') {
        endpoint = ENDPOINTS.mdm.industryById(id);
      } else if (type === 'machine') {
        endpoint = ENDPOINTS.mdm.machineById(id);
      } else if (type === 'machineType') {
        endpoint = `/api/v1/mdm/machine-types/${id}`;
      } else if (type === 'spare') {
        endpoint = `/api/v1/spares/${id}`;
      } else if (type === 'category') {
        endpoint = `/api/v1/mdm/categories/${id}`;
      } else if (type === 'skill') {
        endpoint = `${ENDPOINTS.mdm.skills}/${id}`;
      }

      await apiClient.delete(endpoint);
      await loadMdmData();
    } catch (err: any) {
      console.error('Failed to delete:', err);
      alert(err.message || 'Failed to delete the item. Please check dependent records.');
    } finally {
      setLoading(false);
    }
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
    { name: 'Industry', count: industries.length },
    { name: 'Machine & Machine Type', count: machines.length },
    { name: 'Spares & Categories', count: spares.length + categories.length },
    { name: 'Machine Issues', count: 20 },
    { name: 'Skills', count: skills.length },
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
    handleDeleteClick,
    leftTabs
  };
}
