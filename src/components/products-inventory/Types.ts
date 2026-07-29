export interface SpareProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand?: string;
  compatibleMachines: number;
  priceMin: number;
  priceMax: number;
  stock: number;
  stockStatus: 'In-Stock' | 'Out of Stock' | 'Low Stock' | 'Dead Stock';
  visibility: 'Live' | 'Draft' | 'Archive' | 'Under Review';
}

export interface FilterState {
  searchQuery: string;
  categories: string[];
  stockStatus: string[];
  compatibilityBrand: string;
  compatibilityMachineType: string;
  priceMin: string;
  priceMax: string;
  visibility: string[];
  createdOn: string;
  modifiedOn: string;
}
