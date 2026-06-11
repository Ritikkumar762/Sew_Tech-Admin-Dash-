import React from 'react';
import styles from './SpareDetails.module.css';

interface Variant {
  name: string;
  isDefault?: boolean;
  images: string[];
}

interface ProductImagesCardProps {
  variants: Variant[];
}

export function ProductImagesCard({ variants }: ProductImagesCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Product Images</h2>
      </div>

      <div className={styles.infoGrid} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Variants:</div>
          <div className={styles.infoValue}>{variants.length}</div>
        </div>
        
        <div className={styles.infoBlock}>
          <div className={styles.infoLabel}>Variant Type:</div>
          <div className={styles.infoValue}>Size</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {variants.map((variant, vIdx) => (
          <div key={vIdx} className={styles.variantSection}>
            <div className={styles.variantTitle}>
              {variant.name} {variant.isDefault && '(Default)'}
            </div>
            
            <div className={styles.imageGrid}>
              {variant.images.map((img, imgIdx) => (
                <div key={imgIdx} className={styles.imageWrapper}>
                  {/* Render the realistic generated product image */}
                  <img 
                    src="/rotary_hook.png" 
                    alt={`${variant.name} Rotary Hook Assembly`}
                    className={styles.productImg} 
                  />
                  {imgIdx === 0 && (
                    <div className={styles.coverBadge}>
                      <span className={styles.coverBadgeCheck}>✓</span> Cover Photo
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
