'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export interface SelectionItem {
  id: string;
  name: string;
}

export interface MachineDetail {
  id: string;
  name: string;
  machineType: string;
  brand: string;
  modelName: string;
  images: string[];
  skills: SelectionItem[];
  spares: SelectionItem[];
  industries: SelectionItem[];
}

const DEFAULT_MACHINE: MachineDetail = {
  id: 'mach-1',
  name: 'Industrial Single Needle Lockstitch Machine',
  machineType: 'Locksmith Machine',
  brand: 'Singer',
  modelName: 'Enter Model Name',
  images: [
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=120&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=120&auto=format&fit=crop&q=60'
  ],
  skills: [
    { id: 'sk-1', name: 'Bobbin winding & insertion' },
    { id: 'sk-2', name: 'Bobbin winding & insertion' },
    { id: 'sk-3', name: 'Bobbin winding & insertion' },
    { id: 'sk-4', name: 'Bobbin winding & insertion' },
    { id: 'sk-5', name: 'Bobbin winding & insertion' },
    { id: 'sk-6', name: 'Bobbin winding & insertion' },
    { id: 'sk-7', name: 'Bobbin winding & insertion' }
  ],
  spares: [
    { id: 'sp-1', name: 'Bobbin winding & insertion' },
    { id: 'sp-2', name: 'Bobbin winding & insertion' },
    { id: 'sp-3', name: 'Bobbin winding & insertion' },
    { id: 'sp-4', name: 'Bobbin winding & insertion' },
    { id: 'sp-5', name: 'Bobbin winding & insertion' },
    { id: 'sp-6', name: 'Bobbin winding & insertion' },
    { id: 'sp-7', name: 'Bobbin winding & insertion' }
  ],
  industries: [
    { id: 'in-1', name: 'Bobbin winding & insertion' },
    { id: 'in-2', name: 'Bobbin winding & insertion' },
    { id: 'in-3', name: 'Bobbin winding & insertion' },
    { id: 'in-4', name: 'Bobbin winding & insertion' },
    { id: 'in-5', name: 'Bobbin winding & insertion' },
    { id: 'in-6', name: 'Bobbin winding & insertion' },
    { id: 'in-7', name: 'Bobbin winding & insertion' }
  ]
};

export function useMdmDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const editType = searchParams ? searchParams.get('type') : 'industry';

  const [machineData, setMachineData] = useState<MachineDetail>(DEFAULT_MACHINE);
  const [loading, setLoading] = useState(false);

  // Industry Specific Edit state
  const [industryName, setIndustryName] = useState('Apparel & Fashion');
  const [industrySpares, setIndustrySpares] = useState<SelectionItem[]>([
    { id: 'isp-1', name: 'Bobbin winding & insertion' },
    { id: 'isp-2', name: 'Bobbin winding & insertion' },
    { id: 'isp-3', name: 'Bobbin winding & insertion' },
    { id: 'isp-4', name: 'Bobbin winding & insertion' },
    { id: 'isp-5', name: 'Bobbin winding & insertion' },
    { id: 'isp-6', name: 'Bobbin winding & insertion' },
    { id: 'isp-7', name: 'Bobbin winding & insertion' }
  ]);
  const [industryMachines, setIndustryMachines] = useState<SelectionItem[]>([
    { id: 'im-1', name: 'Bobbin winding & insertion' },
    { id: 'im-2', name: 'Bobbin winding & insertion' },
    { id: 'im-3', name: 'Bobbin winding & insertion' },
    { id: 'im-4', name: 'Bobbin winding & insertion' },
    { id: 'im-5', name: 'Bobbin winding & insertion' },
    { id: 'im-6', name: 'Bobbin winding & insertion' },
    { id: 'im-7', name: 'Bobbin winding & insertion' }
  ]);

  // Skill tab edits specific state
  const [skillName, setSkillName] = useState('New machine installation');
  const [skillMachines, setSkillMachines] = useState<SelectionItem[]>([
    { id: 'sm-1', name: 'Bobbin winding & insertion' },
    { id: 'sm-2', name: 'Bobbin winding & insertion' },
    { id: 'sm-3', name: 'Bobbin winding & insertion' },
    { id: 'sm-4', name: 'Bobbin winding & insertion' },
    { id: 'sm-5', name: 'Bobbin winding & insertion' },
    { id: 'sm-6', name: 'Bobbin winding & insertion' },
    { id: 'sm-7', name: 'Bobbin winding & insertion' }
  ]);
  const [skillIndustries, setSkillIndustries] = useState<SelectionItem[]>([
    { id: 'si-1', name: 'Bobbin winding & insertion' },
    { id: 'si-2', name: 'Bobbin winding & insertion' },
    { id: 'si-3', name: 'Bobbin winding & insertion' },
    { id: 'si-4', name: 'Bobbin winding & insertion' },
    { id: 'si-5', name: 'Bobbin winding & insertion' },
    { id: 'si-6', name: 'Bobbin winding & insertion' },
    { id: 'si-7', name: 'Bobbin winding & insertion' }
  ]);

  // Skill Add drop controls
  const [showSkillAddDrop, setShowSkillAddDrop] = useState(false);
  const [skillsOptions] = useState(['Needle installation', 'Bobbin winding & insertion', 'Looper timing adjustment', 'Thread tension calibration']);
  const [selectedSkillInput, setSelectedSkillInput] = useState('Bobbin winding & insertion');

  const [showSpareAddDrop, setShowSpareAddDrop] = useState(false);
  const [sparesOptions] = useState(['Rotary Hook HC3000', 'Needle Plate standard', 'Bobbin Case heavy', 'Tension Disc']);
  const [selectedSpareInput, setSelectedSpareInput] = useState('Rotary Hook HC3000');

  const [showIndAddDrop, setShowIndAddDrop] = useState(false);
  const [indOptions] = useState(['Apparel & Fashion', 'Medical Textiles', 'Heavy duty canvas', 'Automotive Upholstery']);
  const [selectedIndInput, setSelectedIndInput] = useState('Apparel & Fashion');

  useEffect(() => {
    if (!id || id.startsWith('ind') || id.startsWith('mach') || id.startsWith('skill')) return; // skip default mock records on local development
    
    const fetchMdmDetails = async () => {
      setLoading(true);
      try {
        let endpoint = '';
        if (editType === 'industry') {
          endpoint = ENDPOINTS.mdm.industryById(id);
        } else if (editType === 'skill') {
          endpoint = `${ENDPOINTS.mdm.skills}/${id}`;
        } else {
          endpoint = ENDPOINTS.mdm.machineById(id);
        }

        const res = await apiClient.get<{ success: boolean; data: any }>(endpoint);
        if (res && res.success && res.data) {
          if (editType === 'industry') {
            setIndustryName(res.data.name || '');
            if (res.data.spares) setIndustrySpares(res.data.spares);
            if (res.data.machines) setIndustryMachines(res.data.machines);
          } else if (editType === 'skill') {
            setSkillName(res.data.name || '');
            if (res.data.machines) setSkillMachines(res.data.machines);
            if (res.data.industries) setSkillIndustries(res.data.industries);
          } else {
            setMachineData(res.data);
          }
        }
      } catch (err) {
        console.warn('Backend server offline. Displaying static MDM summaries.');
      } finally {
        setLoading(false);
      }
    };
    fetchMdmDetails();
  }, [id, editType]);

  const handleAddField = (target: 'skills' | 'spares' | 'industries' | 'indSpares' | 'indMachines' | 'skillMachines' | 'skillIndustries') => {
    const newItem = { id: `new-${Date.now()}`, name: '' };
    if (target === 'skills') {
      newItem.name = selectedSkillInput;
      setMachineData(prev => ({ ...prev, skills: [...prev.skills, newItem] }));
      setShowSkillAddDrop(false);
    } else if (target === 'spares') {
      newItem.name = selectedSpareInput;
      setMachineData(prev => ({ ...prev, spares: [...prev.spares, newItem] }));
      setShowSpareAddDrop(false);
    } else if (target === 'industries') {
      newItem.name = selectedIndInput;
      setMachineData(prev => ({ ...prev, industries: [...prev.industries, newItem] }));
      setShowIndAddDrop(false);
    } else if (target === 'indSpares') {
      newItem.name = selectedSpareInput;
      setIndustrySpares(prev => [...prev, newItem]);
      setShowSpareAddDrop(false);
    } else if (target === 'indMachines') {
      newItem.name = selectedSkillInput;
      setIndustryMachines(prev => [...prev, newItem]);
      setShowSkillAddDrop(false);
    } else if (target === 'skillMachines') {
      newItem.name = selectedSkillInput;
      setSkillMachines(prev => [...prev, newItem]);
      setShowSkillAddDrop(false);
    } else if (target === 'skillIndustries') {
      newItem.name = selectedIndInput;
      setSkillIndustries(prev => [...prev, newItem]);
      setShowIndAddDrop(false);
    }
  };

  const handleRemoveField = (target: 'skills' | 'spares' | 'industries' | 'indSpares' | 'indMachines' | 'skillMachines' | 'skillIndustries', itemId: string) => {
    if (target === 'skills') {
      setMachineData(prev => ({ ...prev, skills: prev.skills.filter(x => x.id !== itemId) }));
    } else if (target === 'spares') {
      setMachineData(prev => ({ ...prev, spares: prev.spares.filter(x => x.id !== itemId) }));
    } else if (target === 'industries') {
      setMachineData(prev => ({ ...prev, industries: prev.industries.filter(x => x.id !== itemId) }));
    } else if (target === 'indSpares') {
      setIndustrySpares(prev => prev.filter(x => x.id !== itemId));
    } else if (target === 'indMachines') {
      setIndustryMachines(prev => prev.filter(x => x.id !== itemId));
    } else if (target === 'skillMachines') {
      setSkillMachines(prev => prev.filter(x => x.id !== itemId));
    } else if (target === 'skillIndustries') {
      setSkillIndustries(prev => prev.filter(x => x.id !== itemId));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      let payload: any = {};
      if (editType === 'industry') {
        endpoint = ENDPOINTS.mdm.industryById(id);
        payload = {
          name: industryName,
          spares: industrySpares,
          machines: industryMachines,
        };
      } else if (editType === 'skill') {
        endpoint = `${ENDPOINTS.mdm.skills}/${id}`;
        payload = {
          name: skillName,
          machines: skillMachines,
          industries: skillIndustries,
        };
      } else {
        endpoint = ENDPOINTS.mdm.machineById(id);
        payload = machineData;
      }
      
      await apiClient.put(endpoint, payload);
      router.push('/mdm');
    } catch (err) {
      console.error('Failed to commit MDM alterations:', err);
      router.push('/mdm');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
