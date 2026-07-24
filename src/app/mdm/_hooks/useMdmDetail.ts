'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { apiClient as baseApiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

const apiClient = {
  get: <T>(url: string, opts?: any) => baseApiClient.get<T>(url.startsWith('/api') ? `http://localhost:8000${url}` : url, opts),
  post: <T>(url: string, body: unknown, opts?: any) => baseApiClient.post<T>(url.startsWith('/api') ? `http://localhost:8000${url}` : url, body, opts),
  put: <T>(url: string, body: unknown, opts?: any) => baseApiClient.put<T>(url.startsWith('/api') ? `http://localhost:8000${url}` : url, body, opts),
  delete: <T = void>(url: string, opts?: any) => baseApiClient.delete<T>(url.startsWith('/api') ? `http://localhost:8000${url}` : url, opts),
};

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

const EMPTY_MACHINE: MachineDetail = {
  id: 'add',
  name: '',
  machineType: '',
  brand: '',
  modelName: '',
  images: [
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=120&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=120&auto=format&fit=crop&q=60'
  ],
  skills: [],
  spares: [],
  industries: []
};

export function useMdmDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const editType = searchParams ? searchParams.get('type') : 'industry';

  const [machineData, setMachineData] = useState<MachineDetail>(EMPTY_MACHINE);
  const [loading, setLoading] = useState(false);

  // Separate states for names of types that aren't using machineData
  const [industryName, setIndustryName] = useState('');
  const [industrySpares, setIndustrySpares] = useState<SelectionItem[]>([]);
  const [industryMachines, setIndustryMachines] = useState<SelectionItem[]>([]);
  const [industrySkills, setIndustrySkills] = useState<SelectionItem[]>([]);

  const [skillName, setSkillName] = useState('');
  const [skillMachines, setSkillMachines] = useState<SelectionItem[]>([]);
  const [skillIndustries, setSkillIndustries] = useState<SelectionItem[]>([]);

  const [categoryName, setCategoryName] = useState('');
  const [categorySpares, setCategorySpares] = useState<SelectionItem[]>([]);
  const [machineTypeName, setMachineTypeName] = useState('');
  const [machineTypeMachines, setMachineTypeMachines] = useState<SelectionItem[]>([]);
  const [machineTypeSpares, setMachineTypeSpares] = useState<SelectionItem[]>([]);
  const [machineTypeSkills, setMachineTypeSkills] = useState<SelectionItem[]>([]);

  // Dropdown options lists loaded from backend
  const [skillsList, setSkillsList] = useState<any[]>([]);
  const [sparesList, setSparesList] = useState<any[]>([]);
  const [indList, setIndList] = useState<any[]>([]);
  const [machinesList, setMachinesList] = useState<any[]>([]);
  const [brandsList, setBrandsList] = useState<any[]>([]);
  const [machineTypesList, setMachineTypesList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  // Simple string arrays for dropdown rendering
  const [skillsOptions, setSkillsOptions] = useState<string[]>([]);
  const [sparesOptions, setSparesOptions] = useState<string[]>([]);
  const [indOptions, setIndOptions] = useState<string[]>([]);
  const [machineOptions, setMachineOptions] = useState<string[]>([]);
  const [brandsOptions, setBrandsOptions] = useState<string[]>([]);
  const [machineTypesOptions, setMachineTypesOptions] = useState<string[]>([]);
  const [categoriesOptions, setCategoriesOptions] = useState<string[]>([]);

  // Selected values for mapped additions
  const [selectedSkillInput, setSelectedSkillInput] = useState('');
  const [selectedSpareInput, setSelectedSpareInput] = useState('');
  const [selectedIndInput, setSelectedIndInput] = useState('');
  const [selectedMachineInput, setSelectedMachineInput] = useState('');

  // Add dropdown open states
  const [showSkillAddDrop, setShowSkillAddDrop] = useState(false);
  const [showSpareAddDrop, setShowSpareAddDrop] = useState(false);
  const [showIndAddDrop, setShowIndAddDrop] = useState(false);
  const [showMachineAddDrop, setShowMachineAddDrop] = useState(false);

  // Helper to parse relations count from serialized description JSON
  const parseDescriptionRelations = (description: string | null) => {
    if (description && description.includes('|||')) {
      try {
        const parts = description.split('|||');
        const jsonStr = parts[parts.length - 1];
        return JSON.parse(jsonStr);
      } catch (e) {
        // ignore
      }
    }
    return {};
  };

  // Helper to find ID by name
  const findIdByName = (name: string, list: any[], idKey: string) => {
    const found = list.find((x: any) => x.name === name);
    return found ? String(found[idKey]) : `new-${Date.now()}`;
  };

  // Load dropdown options on mount
  useEffect(() => {
    const loadDropdownOptions = async () => {
      try {
        const skillsRes = await apiClient.get<any>(ENDPOINTS.mdm.skills);
        const sData = Array.isArray(skillsRes) ? skillsRes : (skillsRes && Array.isArray(skillsRes.data) ? skillsRes.data : []);
        setSkillsList(sData);
        const sOpts = sData.map((x: any) => x.name).sort();
        setSkillsOptions(sOpts);
        if (sOpts.length > 0) setSelectedSkillInput(sOpts[0]);

        const sparesRes = await apiClient.get<any>('/api/v1/spares');
        const spData = Array.isArray(sparesRes) ? sparesRes : (sparesRes && Array.isArray(sparesRes.data) ? sparesRes.data : []);
        setSparesList(spData);
        const spOpts = spData.map((x: any) => x.name).sort();
        setSparesOptions(spOpts);
        if (spOpts.length > 0) setSelectedSpareInput(spOpts[0]);

        const indRes = await apiClient.get<any>(ENDPOINTS.mdm.industries);
        const iData = Array.isArray(indRes) ? indRes : (indRes && Array.isArray(indRes.data) ? indRes.data : []);
        setIndList(iData);
        const iOpts = iData.map((x: any) => x.name).sort();
        setIndOptions(iOpts);
        if (iOpts.length > 0) setSelectedIndInput(iOpts[0]);

        const machRes = await apiClient.get<any>(ENDPOINTS.mdm.machines);
        const mData = Array.isArray(machRes) ? machRes : (machRes && Array.isArray(machRes.data) ? machRes.data : []);
        setMachinesList(mData);
        const mOpts = mData.map((x: any) => x.name).sort();
        setMachineOptions(mOpts);
        if (mOpts.length > 0) setSelectedMachineInput(mOpts[0]);

        const brandsRes = editType === 'machine'
          ? await apiClient.get<any>('/api/v1/mdm/machine-brands')
          : await apiClient.get<any>('/api/v1/mart/brands');
        const bData = Array.isArray(brandsRes) ? brandsRes : (brandsRes && Array.isArray(brandsRes.data) ? brandsRes.data : []);
        setBrandsList(bData);
        setBrandsOptions(bData.map((x: any) => x.name).sort());

        const typesRes = await apiClient.get<any>('/api/v1/mdm/machine-types');
        const tData = Array.isArray(typesRes) ? typesRes : (typesRes && Array.isArray(typesRes.data) ? typesRes.data : []);
        setMachineTypesList(tData);
        setMachineTypesOptions(tData.map((x: any) => x.name).sort());

        const catsRes = await apiClient.get<any>(ENDPOINTS.mdm.categories);
        const cData = Array.isArray(catsRes) ? catsRes : (catsRes && Array.isArray(catsRes.data) ? catsRes.data : []);
        setCategoriesList(cData);
        setCategoriesOptions(cData.map((x: any) => x.name).sort());
      } catch (err) {
        console.error('Failed to load dropdown options:', err);
      }
    };
    loadDropdownOptions();
  }, [editType]);

  // Fetch record detail if editing
  useEffect(() => {
    if (!id || id === 'add') {
      const defaultCatOrType = editType === 'spare'
        ? (categoriesList.length > 0 ? String(categoriesList[0].category_id) : '')
        : (machineTypesList.length > 0 ? String(machineTypesList[0].machine_type_id) : '');
      const defaultBrand = brandsList.length > 0
        ? String(brandsList[0].brand_id || brandsList[0].machine_brand_id)
        : '';
      setMachineData({
        ...EMPTY_MACHINE,
        machineType: defaultCatOrType,
        brand: defaultBrand
      });
      setIndustryName('');
      setIndustrySpares([]);
      setIndustryMachines([]);
      setIndustrySkills([]);
      setSkillName('');
      setSkillMachines([]);
      setSkillIndustries([]);
      setCategoryName('');
      setMachineTypeName('');
      setMachineTypeMachines([]);
      setMachineTypeSpares([]);
      setMachineTypeSkills([]);
      return;
    }

    const fetchMdmDetails = async () => {
      setLoading(true);
      try {
        let endpoint = '';
        if (editType === 'industry') {
          endpoint = ENDPOINTS.mdm.industryById(id);
        } else if (editType === 'skill') {
          endpoint = `${ENDPOINTS.mdm.skills}/${id}`;
        } else if (editType === 'machineType') {
          endpoint = `/api/v1/mdm/machine-types/${id}`;
        } else if (editType === 'category') {
          endpoint = `/api/v1/mdm/categories/${id}`;
        } else if (editType === 'spare') {
          endpoint = `/api/v1/mdm/spares/${id}`;
        } else {
          endpoint = ENDPOINTS.mdm.machineById(id);
        }

        const res = await apiClient.get<any>(endpoint);
        const rawData = res && res.success && res.data ? res.data : res;

        if (rawData) {
          if (editType === 'industry') {
            setIndustryName(rawData.name || '');
            setIndustrySpares(rawData.spares || []);
            setIndustryMachines(rawData.machines || []);
            setIndustrySkills(rawData.skills || []);
          } else if (editType === 'skill') {
            setSkillName(rawData.name || '');
            const rels = parseDescriptionRelations(rawData.description);
            setSkillMachines(rawData.machines || rels.machines || []);
            setSkillIndustries(rawData.industries || rels.industries || []);
          } else if (editType === 'machineType') {
            setMachineTypeName(rawData.name || '');
            const rels = parseDescriptionRelations(rawData.description);

            let machinesMapped = rawData.machines;
            let sparesMapped = rawData.spares;
            let skillsMapped = rawData.skills || rels.skills;

            if (!machinesMapped) {
              const machRes = await apiClient.get<any>(ENDPOINTS.mdm.machines);
              const mData = Array.isArray(machRes) ? machRes : (machRes && Array.isArray(machRes.data) ? machRes.data : []);
              machinesMapped = mData.filter((x: any) => String(x.machine_type_id) === String(id)).map((x: any) => ({ id: String(x.machine_model_id), name: x.name }));
            }
            if (!sparesMapped) {
              const sparesRes = await apiClient.get<any>('/api/v1/mdm/spares');
              const spData = Array.isArray(sparesRes) ? sparesRes : (sparesRes && Array.isArray(sparesRes.data) ? sparesRes.data : []);
              sparesMapped = spData.filter((x: any) => String(x.machine_type_id) === String(id)).map((x: any) => ({ id: String(x.product_id), name: x.name }));
            }

            setMachineTypeMachines(machinesMapped || []);
            setMachineTypeSpares(sparesMapped || []);
            setMachineTypeSkills(skillsMapped || []);
          } else if (editType === 'category') {
            setCategoryName(rawData.name || '');
            let sparesMapped = rawData.spares;
            if (!sparesMapped) {
              const sparesRes = await apiClient.get<any>('/api/v1/mdm/spares');
              const spData = Array.isArray(sparesRes) ? sparesRes : (sparesRes && Array.isArray(sparesRes.data) ? sparesRes.data : []);
              sparesMapped = spData.filter((x: any) => String(x.category_id) === String(id)).map((x: any) => ({ id: String(x.product_id), name: x.name }));
            }
            setCategorySpares(sparesMapped || []);
          } else if (editType === 'spare') {
            const rels = parseDescriptionRelations(rawData.description);
            const selectedCat = String(rawData.category_id || (categoriesList.length > 0 ? categoriesList[0].category_id : ''));
            const selectedBrand = String(rawData.brand_id || (brandsList.length > 0 ? (brandsList[0].brand_id || brandsList[0].machine_brand_id) : ''));
            setMachineData({
              id: String(rawData.product_id),
              name: rawData.name || '',
              machineType: selectedCat,
              brand: selectedBrand,
              modelName: '',
              images: rawData.images || [],
              skills: rawData.skills || rels.skills || [],
              spares: rawData.spares || rels.spares || [],
              industries: rawData.industries || rels.industries || []
            });
          } else {
            // Machine
            const rels = parseDescriptionRelations(rawData.description);
            setMachineData({
              id: String(rawData.machine_model_id),
              name: rawData.name || '',
              machineType: String(rawData.machine_type_id || ''),
              brand: String(rawData.brand_id || ''),
              modelName: rawData.description || '',
              images: rawData.images || [
                'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=120&auto=format&fit=crop&q=60'
              ],
              skills: rawData.skills || rels.skills || [],
              spares: rawData.spares || rels.spares || [],
              industries: rawData.industries || rels.industries || []
            });
          }
        }
      } catch (err) {
        console.warn('Backend detail load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMdmDetails();
  }, [id, editType, machineTypesList.length, brandsList.length]);

  const handleAddField = (target: 'skills' | 'spares' | 'industries' | 'indSpares' | 'indMachines' | 'indSkills' | 'machTypeMachines' | 'machTypeSpares' | 'machTypeSkills' | 'categorySpares' | 'skillMachines' | 'skillIndustries') => {
    const newItem = { id: `new-${Date.now()}`, name: '' };
    if (target === 'categorySpares') {
      newItem.name = selectedSpareInput;
      newItem.id = findIdByName(selectedSpareInput, sparesList, 'product_id');
      setCategorySpares(prev => {
        if (prev.some(x => String(x.id) === String(newItem.id) || x.name === newItem.name)) return prev;
        return [...prev, newItem];
      });
      setShowSpareAddDrop(false);
    } else if (target === 'machTypeMachines') {
      newItem.name = selectedMachineInput;
      newItem.id = findIdByName(selectedMachineInput, machinesList, 'machine_model_id');
      setMachineTypeMachines(prev => {
        if (prev.some(x => String(x.id) === String(newItem.id) || x.name === newItem.name)) return prev;
        return [...prev, newItem];
      });
      setShowMachineAddDrop(false);
    } else if (target === 'machTypeSpares') {
      newItem.name = selectedSpareInput;
      newItem.id = findIdByName(selectedSpareInput, sparesList, 'product_id');
      setMachineTypeSpares(prev => {
        if (prev.some(x => String(x.id) === String(newItem.id) || x.name === newItem.name)) return prev;
        return [...prev, newItem];
      });
      setShowSpareAddDrop(false);
    } else if (target === 'machTypeSkills') {
      newItem.name = selectedSkillInput;
      newItem.id = findIdByName(selectedSkillInput, skillsList, 'skill_id');
      setMachineTypeSkills(prev => {
        if (prev.some(x => String(x.id) === String(newItem.id) || x.name === newItem.name)) return prev;
        return [...prev, newItem];
      });
      setShowSkillAddDrop(false);
    } else if (target === 'indSpares') {
      newItem.name = selectedSpareInput;
      newItem.id = findIdByName(selectedSpareInput, sparesList, 'product_id');
      setIndustrySpares(prev => {
        if (prev.some(x => String(x.id) === String(newItem.id) || x.name === newItem.name)) return prev;
        return [...prev, newItem];
      });
      setShowSpareAddDrop(false);
    } else if (target === 'indMachines') {
      newItem.name = selectedMachineInput;
      newItem.id = findIdByName(selectedMachineInput, machinesList, 'machine_model_id');
      setIndustryMachines(prev => {
        if (prev.some(x => String(x.id) === String(newItem.id) || x.name === newItem.name)) return prev;
        return [...prev, newItem];
      });
      setShowMachineAddDrop(false);
    } else if (target === 'indSkills') {
      newItem.name = selectedSkillInput;
      newItem.id = findIdByName(selectedSkillInput, skillsList, 'skill_id');
      setIndustrySkills(prev => {
        if (prev.some(x => String(x.id) === String(newItem.id) || x.name === newItem.name)) return prev;
        return [...prev, newItem];
      });
      setShowSkillAddDrop(false);
    } else if (target === 'skillMachines') {
      newItem.name = selectedMachineInput;
      newItem.id = findIdByName(selectedMachineInput, machinesList, 'machine_model_id');
      setSkillMachines(prev => {
        if (prev.some(x => String(x.id) === String(newItem.id) || x.name === newItem.name)) return prev;
        return [...prev, newItem];
      });
      setShowMachineAddDrop(false);
    } else if (target === 'skillIndustries') {
      newItem.name = selectedIndInput;
      newItem.id = findIdByName(selectedIndInput, indList, 'industry_id');
      setSkillIndustries(prev => {
        if (prev.some(x => String(x.id) === String(newItem.id) || x.name === newItem.name)) return prev;
        return [...prev, newItem];
      });
      setShowIndAddDrop(false);
    } else if (target === 'skills') {
      newItem.name = selectedSkillInput;
      newItem.id = findIdByName(selectedSkillInput, skillsList, 'skill_id');
      setMachineData(prev => {
        if (prev.skills.some(x => String(x.id) === String(newItem.id) || x.name === newItem.name)) return prev;
        return { ...prev, skills: [...prev.skills, newItem] };
      });
      setShowSkillAddDrop(false);
    } else if (target === 'spares') {
      newItem.name = selectedSpareInput;
      newItem.id = findIdByName(selectedSpareInput, sparesList, 'product_id');
      setMachineData(prev => {
        if (prev.spares.some(x => String(x.id) === String(newItem.id) || x.name === newItem.name)) return prev;
        return { ...prev, spares: [...prev.spares, newItem] };
      });
      setShowSpareAddDrop(false);
    } else if (target === 'industries') {
      newItem.name = selectedIndInput;
      newItem.id = findIdByName(selectedIndInput, indList, 'industry_id');
      setMachineData(prev => {
        if (prev.industries.some(x => String(x.id) === String(newItem.id) || x.name === newItem.name)) return prev;
        return { ...prev, industries: [...prev.industries, newItem] };
      });
      setShowIndAddDrop(false);
    }
  };

  const handleRemoveField = (target: 'skills' | 'spares' | 'industries' | 'indSpares' | 'indMachines' | 'indSkills' | 'machTypeMachines' | 'machTypeSpares' | 'machTypeSkills' | 'categorySpares' | 'skillMachines' | 'skillIndustries', itemId: string) => {
    if (target === 'categorySpares') {
      setCategorySpares(prev => prev.filter(x => String(x.id) !== String(itemId)));
    } else if (target === 'machTypeMachines') {
      setMachineTypeMachines(prev => prev.filter(x => String(x.id) !== String(itemId)));
    } else if (target === 'machTypeSpares') {
      setMachineTypeSpares(prev => prev.filter(x => String(x.id) !== String(itemId)));
    } else if (target === 'machTypeSkills') {
      setMachineTypeSkills(prev => prev.filter(x => String(x.id) !== String(itemId)));
    } else if (target === 'indSkills') {
      setIndustrySkills(prev => prev.filter(x => String(x.id) !== String(itemId)));
    } else if (target === 'indSpares') {
      setIndustrySpares(prev => prev.filter(x => String(x.id) !== String(itemId)));
    } else if (target === 'indMachines') {
      setIndustryMachines(prev => prev.filter(x => String(x.id) !== String(itemId)));
    } else if (target === 'skillMachines') {
      setSkillMachines(prev => prev.filter(x => String(x.id) !== String(itemId)));
    } else if (target === 'skillIndustries') {
      setSkillIndustries(prev => prev.filter(x => String(x.id) !== String(itemId)));
    } else if (target === 'skills') {
      setMachineData(prev => ({ ...prev, skills: prev.skills.filter(x => x.id !== itemId) }));
    } else if (target === 'spares') {
      setMachineData(prev => ({ ...prev, spares: prev.spares.filter(x => x.id !== itemId) }));
    } else if (target === 'industries') {
      setMachineData(prev => ({ ...prev, industries: prev.industries.filter(x => x.id !== itemId) }));
    }
  };

  const buildDescriptionWithRelations = (visibleDesc: string, relations: any) => {
    return `${visibleDesc || ''} ||| ${JSON.stringify(relations)}`;
  };


    const updateSpareSafely = async (item: any, patchFields: any) => {
      const rels = parseDescriptionRelations(item.description);
      const currentSkills = item.skills || rels.skills || [];
      const currentSpares = item.spares || rels.spares || [];
      const currentIndustries = item.industries || rels.industries || [];

      const updatedCategoryId = 'category_id' in patchFields ? patchFields.category_id : item.category_id;
      const updatedIndustryId = 'industry_id' in patchFields ? patchFields.industry_id : item.industry_id;
      const updatedMachineTypeId = 'machine_type_id' in patchFields ? patchFields.machine_type_id : item.machine_type_id;

      const updatedRelations = {
        skills: currentSkills,
        spares: currentSpares,
        industries: currentIndustries
      };

      const payload = {
        name: item.name,
        category_id: updatedCategoryId,
        categoryId: updatedCategoryId,
        brand_id: item.brand_id || item.brandId || null,
        brandId: item.brand_id || item.brandId || null,
        machine_type_id: updatedMachineTypeId,
        industry_id: updatedIndustryId,
        description: `${item.description ? item.description.split('|||')[0].trim() : ''} ||| ${JSON.stringify(updatedRelations)}`,
        skills: currentSkills,
        spares: currentSpares,
        industries: currentIndustries
      };

      await apiClient.put(`/api/v1/mdm/spares/${item.product_id}`, payload);
    };

    const updateMachineSafely = async (item: any, patchFields: any) => {
      const rels = parseDescriptionRelations(item.description);
      const currentSkills = 'skills' in patchFields ? patchFields.skills : (item.skills || rels.skills || []);
      const currentSpares = 'spares' in patchFields ? patchFields.spares : (item.spares || rels.spares || []);
      const currentIndustries = 'industries' in patchFields ? patchFields.industries : (item.industries || rels.industries || []);

      const updatedMachineTypeId = 'machine_type_id' in patchFields ? patchFields.machine_type_id : item.machine_type_id;

      const updatedRelations = {
        skills: currentSkills,
        spares: currentSpares,
        industries: currentIndustries
      };

      const payload = {
        name: item.name,
        machine_type_id: updatedMachineTypeId,
        brand_id: item.brand_id || item.brandId || null,
        description: `${item.description ? item.description.split('|||')[0].trim() : ''} ||| ${JSON.stringify(updatedRelations)}`,
        skills: currentSkills,
        spares: currentSpares,
        industries: currentIndustries
      };

      await apiClient.put(ENDPOINTS.mdm.machineById(item.machine_model_id), payload);
    };

    const updateSkillSafely = async (skillItem: any, patchFields: any) => {
      const rels = parseDescriptionRelations(skillItem.description);
      const currentMachines = 'machines' in patchFields ? patchFields.machines : (skillItem.machines || rels.machines || []);
      const currentIndustries = skillItem.industries || rels.industries || [];

      const updatedRelations = {
        machines: currentMachines,
        industries: currentIndustries
      };

      const payload = {
        name: skillItem.name,
        description: `${skillItem.description ? skillItem.description.split('|||')[0].trim() : ''} ||| ${JSON.stringify(updatedRelations)}`,
        machines: currentMachines,
        industries: currentIndustries,
        display_order: skillItem.display_order || 0
      };

      await apiClient.put(`${ENDPOINTS.mdm.skills}/${skillItem.skill_id}`, payload);
    };

  const handleSave = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      let payload: any = {};
      const isEdit = id !== 'add';

      if (editType === 'industry') {
        endpoint = isEdit ? ENDPOINTS.mdm.industryById(id) : ENDPOINTS.mdm.industries;
        payload = {
          name: industryName,
          is_active: true,
          spares: industrySpares,
          machines: industryMachines,
          skills: industrySkills
        };
        await (isEdit ? apiClient.put(endpoint, payload) : apiClient.post(endpoint, payload));
      } else if (editType === 'skill') {
        endpoint = isEdit ? `${ENDPOINTS.mdm.skills}/${id}` : ENDPOINTS.mdm.skills;
        const relations = {
          machines: skillMachines,
          industries: skillIndustries
        };
        payload = {
          name: skillName,
          description: buildDescriptionWithRelations('', relations),
          machines: skillMachines,
          industries: skillIndustries,
          display_order: 0
        };
        const res: any = isEdit ? await apiClient.put(endpoint, payload) : await apiClient.post(endpoint, payload);
        const savedId = String(res?.skill_id || id);

        // Update machines mapping
        for (const item of machinesList) {
          const isMapped = skillMachines.some(x => x.id === String(item.machine_model_id));
          const rels = parseDescriptionRelations(item.description);
          let machineSkills = item.skills || rels.skills || [];
          const alreadyLinked = machineSkills.some((x: any) => x.id === savedId);

          if (isMapped && !alreadyLinked) {
            const updatedSkills = [...machineSkills, { id: savedId, name: skillName }];
            await updateMachineSafely(item, { skills: updatedSkills });
          } else if (!isMapped && alreadyLinked) {
            const updatedSkills = machineSkills.filter((x: any) => x.id !== savedId);
            await updateMachineSafely(item, { skills: updatedSkills });
          }
        }
      } else if (editType === 'machineType') {
        endpoint = isEdit ? `/api/v1/mdm/machine-types/${id}` : '/api/v1/mdm/machine-types';
        const relations = {
          skills: machineTypeSkills
        };
        payload = {
          name: machineTypeName || machineData.name,
          description: buildDescriptionWithRelations('', relations),
          skills: machineTypeSkills,
          machines: machineTypeMachines,
          spares: machineTypeSpares
        };
        const res: any = isEdit ? await apiClient.put(endpoint, payload) : await apiClient.post(endpoint, payload);
        const savedId = String(res?.machine_type_id || id);

        // Update machines mapping
        for (const item of machinesList) {
          const isMapped = machineTypeMachines.some(x => x.id === String(item.machine_model_id));
          if (isMapped && String(item.machine_type_id) !== savedId) {
            await updateMachineSafely(item, { machine_type_id: parseInt(savedId) });
          } else if (!isMapped && String(item.machine_type_id) === savedId) {
            await updateMachineSafely(item, { machine_type_id: null });
          }
        }

        // Update spares mapping
        for (const item of sparesList) {
          const isMapped = machineTypeSpares.some(x => x.id === String(item.product_id));
          if (isMapped && String(item.machine_type_id) !== savedId) {
            await updateSpareSafely(item, { machine_type_id: parseInt(savedId) });
          } else if (!isMapped && String(item.machine_type_id) === savedId) {
            await updateSpareSafely(item, { machine_type_id: null });
          }
        }
      } else if (editType === 'category') {
        endpoint = isEdit ? `/api/v1/mdm/categories/${id}` : '/api/v1/mdm/categories';
        payload = {
          name: categoryName,
          spares: categorySpares
        };
        const res: any = isEdit ? await apiClient.put(endpoint, payload) : await apiClient.post(endpoint, payload);
        const savedId = String(res?.category_id || id);

        // Update spares mapping
        for (const item of sparesList) {
          const isMapped = categorySpares.some(x => x.id === String(item.product_id));
          if (isMapped && String(item.category_id) !== savedId) {
            await updateSpareSafely(item, { category_id: parseInt(savedId) });
          } else if (!isMapped && String(item.category_id) === savedId) {
            await updateSpareSafely(item, { category_id: null });
          }
        }
      } else if (editType === 'spare') {
        endpoint = isEdit ? `/api/v1/mdm/spares/${id}` : '/api/v1/mdm/spares';
        const categoryId = machineData.machineType;
        const brandId = machineData.brand;
        const relations = {
          skills: machineData.skills,
          spares: machineData.spares,
          industries: machineData.industries
        };

        payload = {
          name: machineData.name,
          category_id: parseInt(categoryId) || null,
          categoryId: parseInt(categoryId) || null,
          brand_id: parseInt(brandId) || null,
          brandId: parseInt(brandId) || null,
          description: buildDescriptionWithRelations('', relations),
          skills: machineData.skills,
          spares: machineData.spares,
          industries: machineData.industries
        };
        const res: any = isEdit ? await apiClient.put(endpoint, payload) : await apiClient.post(endpoint, payload);
        const savedId = String(res?.product_id || id);

        // Update machines mapping
        for (const item of machinesList) {
          const isMapped = machineData.spares.some(x => x.id === String(item.machine_model_id));
          const rels = parseDescriptionRelations(item.description);
          let machineSpares = item.spares || rels.spares || [];
          const alreadyLinked = machineSpares.some((x: any) => x.id === savedId);

          if (isMapped && !alreadyLinked) {
            const updatedSpares = [...machineSpares, { id: savedId, name: machineData.name }];
            await updateMachineSafely(item, { spares: updatedSpares });
          } else if (!isMapped && alreadyLinked) {
            const updatedSpares = machineSpares.filter((x: any) => x.id !== savedId);
            await updateMachineSafely(item, { spares: updatedSpares });
          }
        }
      } else {
        // Machine
        endpoint = isEdit ? ENDPOINTS.mdm.machineById(id) : ENDPOINTS.mdm.machines;
        const typeId = machineData.machineType;
        const brandId = machineData.brand;
        const relations = {
          skills: machineData.skills,
          spares: machineData.spares,
          industries: machineData.industries
        };

        payload = {
          name: machineData.name,
          machine_type_id: parseInt(typeId) || null,
          brand_id: parseInt(brandId) || null,
          description: buildDescriptionWithRelations(machineData.modelName, relations),
          skills: machineData.skills,
          spares: machineData.spares,
          industries: machineData.industries
        };
        const res: any = isEdit ? await apiClient.put(endpoint, payload) : await apiClient.post(endpoint, payload);
        const savedId = String(res?.machine_model_id || id);

        // Update skills mapping
        for (const item of skillsList) {
          const isMapped = machineData.skills.some(x => x.id === String(item.skill_id));
          const rels = parseDescriptionRelations(item.description);
          let skillMachs = item.machines || rels.machines || [];
          const alreadyLinked = skillMachs.some((x: any) => x.id === savedId);

          if (isMapped && !alreadyLinked) {
            const updatedMachs = [...skillMachs, { id: savedId, name: machineData.name }];
            await updateSkillSafely(item, { machines: updatedMachs });
          } else if (!isMapped && alreadyLinked) {
            const updatedMachs = skillMachs.filter((x: any) => x.id !== savedId);
            await updateSkillSafely(item, { machines: updatedMachs });
          }
        }
      }

      router.push('/mdm');
    } catch (err) {
      console.error('Failed to save MDM record:', err);
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
    setIndustrySpares,
    industryMachines,
    setIndustryMachines,
    industrySkills,
    setIndustrySkills,
    skillName,
    setSkillName,
    skillMachines,
    setSkillMachines,
    skillIndustries,
    setSkillIndustries,
    categoryName,
    setCategoryName,
    categorySpares,
    setCategorySpares,
    machineTypeName,
    setMachineTypeName,
    machineTypeMachines,
    setMachineTypeMachines,
    machineTypeSpares,
    setMachineTypeSpares,
    machineTypeSkills,
    setMachineTypeSkills,
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
    machineOptions,
    selectedMachineInput,
    setSelectedMachineInput,
    showMachineAddDrop,
    setShowMachineAddDrop,
    brandsList,
    machineTypesList,
    categoriesList,
    brandsOptions,
    machineTypesOptions,
    categoriesOptions,
    handleAddField,
    handleRemoveField,
    handleSave,
  };
}
