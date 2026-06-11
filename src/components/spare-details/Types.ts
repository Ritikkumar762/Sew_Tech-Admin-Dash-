export interface SpareDetailData {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  ordersLast30Days: number;
  activeVendors: number;
  currentSellingPrice: number;
  description: string;
  mappedIndustry: string;
  manufacturer: string;
  warranty: string;
  tags: string[];
  visibility: 'Live' | 'Draft' | 'Archive' | 'Under Review';
  dimensions: string;
  itemWeight: string;
  netQuantity: string;
  material: string;
  listingPrice: number;
  salePrice: number;
  isReturnable: boolean;
  stockInventory: number;
  stockAlertQuantity: number;
  compatibilities: Array<{
    id: string;
    brand: string;
    machineModel: string;
    image?: string;
  }>;
  variants: Array<{
    name: string;
    isDefault?: boolean;
    images: string[];
  }>;
}
