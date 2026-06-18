'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import styles from '@/components/spare-details/SpareDetails.module.css';
import { SpareDetailsHeader } from '@/components/spare-details/SpareDetailsHeader';
import { SpareTopStats } from '@/components/spare-details/SpareTopStats';
import { BasicInfoCard } from '@/components/spare-details/BasicInfoCard';
import { TechnicalDetailsCard } from '@/components/spare-details/TechnicalDetailsCard';
import { PriceDetailsCard } from '@/components/spare-details/PriceDetailsCard';
import { StockDetailsCard } from '@/components/spare-details/StockDetailsCard';
import { CompatibilityCard } from '@/components/spare-details/CompatibilityCard';
import { ProductImagesCard } from '@/components/spare-details/ProductImagesCard';
import { AuditLog } from '@/components/spare-details/AuditLog';
import { SpareDetailData } from '@/components/spare-details/Types';

const MOCK_SPARE: SpareDetailData = {
  id: 'sth-rh-2045',
  sku: 'STH-RH-2045',
  name: 'High-Speed Rotary Hook Assembly',
  category: 'Rotary Hook',
  stock: 10,
  ordersLast30Days: 500,
  activeVendors: 10,
  currentSellingPrice: 15000,
  description: 'Elevate your sewing experience with the Presser Bar Spring Housing Support! This essential component is designed for use in sewing machines, ensuring optimal performance.',
  mappedIndustry: 'Demo Industry',
  manufacturer: 'HASTHIP, cs.service01@outlook.com',
  warranty: '-',
  tags: ['Rotary Hook', 'Rotary Hook'],
  visibility: 'Live',
  dimensions: '48 mm x 42 mm x 28 mm',
  itemWeight: '185 g',
  netQuantity: '1 Unit',
  material: 'Hardened Alloy Steel',
  listingPrice: 1500,
  salePrice: 1500,
  isReturnable: true,
  stockInventory: 100,
  stockAlertQuantity: 12,
  compatibilities: [
    { id: '1', brand: 'Juki Single Needle Lockstitch', machineModel: 'HC3000' },
    { id: '2', brand: 'Juki Single Needle Lockstitch', machineModel: 'HC3000' },
    { id: '3', brand: 'Juki Single Needle Lockstitch', machineModel: 'HC3000' }
  ],
  variants: [
    {
      name: '5mm',
      isDefault: true,
      images: ['img1', 'img2', 'img3']
    },
    {
      name: '10mm',
      images: ['img4', 'img5', 'img6']
    }
  ]
};

export default function SpareDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'details' | 'audit'>('details');
  const [spareData, setSpareData] = useState<SpareDetailData>(MOCK_SPARE);

  // If you ever want to fetch actual data, this structure allows simple fetching:
  // useEffect(() => {
  //   fetch(`/api/spares/${params.id}`).then(res => res.json()).then(data => setSpareData(data))
  // }, [params.id])

  return (
    <div className={styles.pageContainer}>
      <SpareDetailsHeader id={spareData.id} name={spareData.name} sku={spareData.sku} />
      
      <SpareTopStats 
        category={spareData.category}
        stock={spareData.stock}
        orders={spareData.ordersLast30Days}
        vendors={spareData.activeVendors}
        price={spareData.currentSellingPrice}
      />

      <div className={styles.tabsContainer}>
        <div 
          className={`${styles.tab} ${activeTab === 'details' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Spare Details
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'audit' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          Audit Log
        </div>
      </div>

      {activeTab === 'details' ? (
        <div>
          <BasicInfoCard 
            description={spareData.description}
            mappedIndustry={spareData.mappedIndustry}
            manufacturer={spareData.manufacturer}
            warranty={spareData.warranty}
            tags={spareData.tags}
            visibility={spareData.visibility}
          />
          
          <TechnicalDetailsCard 
            dimensions={spareData.dimensions}
            itemWeight={spareData.itemWeight}
            netQuantity={spareData.netQuantity}
            material={spareData.material}
          />

          <PriceDetailsCard 
            listingPrice={spareData.listingPrice}
            salePrice={spareData.salePrice}
            isReturnable={spareData.isReturnable}
          />

          <StockDetailsCard 
            stockInventory={spareData.stockInventory}
            stockAlertQuantity={spareData.stockAlertQuantity}
          />

          <CompatibilityCard 
            compatibilities={spareData.compatibilities}
          />

          <ProductImagesCard 
            variants={spareData.variants}
          />
        </div>
      ) : (
        <AuditLog />
      )}
    </div>
  );
}
