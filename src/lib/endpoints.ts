/**
 * API Endpoints — Single Source of Truth
 * Update BASE_URL in your .env.local: NEXT_PUBLIC_API_URL=https://your-api.com
 * All API routes are defined here. Never hardcode URLs in hooks.
 */

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';
export const MARKETING_BASE_URL = 'https://project-sewtech-mart.onrender.com';
// Alerts backend — change this URL once deployed; everything else uses BASE_URL
export const ALERTS_BASE_URL = 'http://127.0.0.1:8000';

export const ENDPOINTS = {
  // ── Dashboard ────────────────────────────────────────────────
  dashboard: {
    metrics:     `${BASE_URL}/dashboard/metrics`,
    funnel:      `${BASE_URL}/dashboard/funnel`,
    trend:       `${BASE_URL}/dashboard/trend`,
    pie:         `${BASE_URL}/dashboard/order-outcome`,
    inventory:   `${BASE_URL}/dashboard/inventory-insights`,
    revenue:     `${BASE_URL}/dashboard/revenue`,
    performance: `${BASE_URL}/dashboard/performance`,
  },

  // ── Alerts ───────────────────────────────────────────────────
  alerts: {
    list:         `${ALERTS_BASE_URL}/alerts`,
    byId:         (id: string) => `${ALERTS_BASE_URL}/alerts/${id}`,
    markRead:     (id: string) => `${ALERTS_BASE_URL}/alerts/${id}/read`,
    markAll:      `${ALERTS_BASE_URL}/alerts/mark-all-read`,
    unreadCount:  `${ALERTS_BASE_URL}/alerts/unread-count`,
  },

  // ── Spares ───────────────────────────────────────────────────
  spares: {
    list:       `${BASE_URL}/spares`,
    byId:       (id: string) => `${BASE_URL}/spares/${id}`,
    create:     `${BASE_URL}/spares`,
    update:     (id: string) => `${BASE_URL}/spares/${id}`,
    delete:     (id: string) => `${BASE_URL}/spares/${id}`,
    orders:     `${BASE_URL}/v1/admin/spares/orders`,
    orderById:  (id: string) => `${BASE_URL}/v1/admin/spares/orders/${id}`,
    requests:   `${BASE_URL}/spares/requests`,
    inventory:  `${BASE_URL}/admin/products`,
    updateVariant: (productId: string, variantId: string) => `${BASE_URL}/admin/products/${productId}/variants/${variantId}`,
  },

  // ── Users ────────────────────────────────────────────────────
  users: {
    list:       `${BASE_URL}/users`,
    byId:       (id: string) => `${BASE_URL}/users/${id}`,
    create:     `${BASE_URL}/users`,
    update:     (id: string) => `${BASE_URL}/users/${id}`,
    delete:     (id: string) => `${BASE_URL}/users/${id}`,
    updateStatus: (id: string) => `${BASE_URL}/users/${id}/status`,
  },

  // ── Finance ──────────────────────────────────────────────────
  finance: {
    transactions: `${BASE_URL}/finance/transactions`,
    byId:         (id: string) => `${BASE_URL}/finance/transactions/${id}`,
    summary:      `${BASE_URL}/finance/summary`,
  },

  // ── Mechanics ────────────────────────────────────────────────
  mechanics: {
    list:         `${BASE_URL}/mechanics`,
    byId:         (id: string) => `${BASE_URL}/mechanics/${id}`,
    create:       `${BASE_URL}/mechanics`,
    update:       (id: string) => `${BASE_URL}/mechanics/${id}`,
    assignJob:    (id: string) => `${BASE_URL}/mechanics/${id}/assign`,
    // Real API — mechanic applications (care module)
    applications:    `${BASE_URL}/v1/admin/care/mechanics/applications`,
    applicationById: (id: string) => `${BASE_URL}/v1/admin/care/mechanics/applications/${id}`,
    applicationStatus: (id: string) => `${BASE_URL}/v1/admin/care/mechanics/applications/${id}/status`,
    applicationJobs:   (id: string) => `${BASE_URL}/v1/admin/care/mechanics/applications/${id}/jobs`,
    applicationPerf:   (id: string) => `${BASE_URL}/v1/admin/care/mechanics/applications/${id}/performance`,
  },

  // ── Support ──────────────────────────────────────────────────
  support: {
    tickets:    `${BASE_URL}/support/tickets`,
    byId:       (id: string) => `${BASE_URL}/support/tickets/${id}`,
    create:     `${BASE_URL}/support/tickets`,
    resolve:    (id: string) => `${BASE_URL}/support/tickets/${id}/resolve`,
    escalate:   (id: string) => `${BASE_URL}/support/tickets/${id}/escalate`,
  },

  // ── Marketing ────────────────────────────────────────────────
  marketing: {
    // Campaign & Banner Management
    stats:        `${MARKETING_BASE_URL}/api/v1/marketing/stats`,            // GET - Metrics & Performance summary
    banners:      `${MARKETING_BASE_URL}/api/v1/marketing/banners`,          // GET, POST - Active/Live Banners List
    bannerById:   (id: string) => `${MARKETING_BASE_URL}/api/v1/marketing/banners/${id}`, // GET, PUT, DELETE - Banner Wizard

    // Saved Creative Assets Library
    creatives:    `${MARKETING_BASE_URL}/api/v1/marketing/creatives`,        // GET, POST - Assets Grid
    creativeById: (id: string) => `${MARKETING_BASE_URL}/api/v1/marketing/creatives/${id}`, // GET, PUT, DELETE
    creativeCopy: (id: string) => `${MARKETING_BASE_URL}/api/v1/marketing/creatives/${id}/copy`, // POST - Duplication Node
    
    // Media Upload Node
    upload:       `${MARKETING_BASE_URL}/api/v1/marketing/upload`,           // POST (multipart/form-data)
  },

  // ── Exchange ─────────────────────────────────────────────────
  exchange: {
    listings:   `${BASE_URL}/exchange/listings`,
    byId:       (id: string) => `${BASE_URL}/exchange/listings/${id}`,
    create:     `${BASE_URL}/exchange/listings`,
  },

  // ── Kaarigar ─────────────────────────────────────────────────
  kaarigar: {
    list:       `${BASE_URL}/kaarigar`,
    byId:       (id: string) => `${BASE_URL}/kaarigar/${id}`,
    jobs:       `${BASE_URL}/kaarigar/jobs`,
  },

  // ── Academy ──────────────────────────────────────────────────
  academy: {
    courses:    `${BASE_URL}/academy/courses`,
    byId:       (id: string) => `${BASE_URL}/academy/courses/${id}`,
    create:     `${BASE_URL}/academy/courses`,
  },

  // ── MDM ──────────────────────────────────────────────────────
  mdm: {
    industries: `${BASE_URL}/v1/mdm/industries`,
    industryById: (id: string) => `${BASE_URL}/v1/mdm/industries/${id}`,
    machines:   `${BASE_URL}/v1/mdm/machines`,
    machineById: (id: string) => `${BASE_URL}/v1/mdm/machines/${id}`,
    categories: `${BASE_URL}/mdm/categories`,
    locations:  `${BASE_URL}/mdm/locations`,
    pricing:    `${BASE_URL}/mdm/pricing`,
    skills:     `${BASE_URL}/mdm/skills`,
  },

  // ── Admin ───────────────────────────────────────────────────
  admin: {
    dashboard: {
      smartView: `${BASE_URL}/v1/admin/dashboard/smart-view`,
    },
    sellerApplications: {
      list: `${BASE_URL}/v1/admin/seller-applications`,
      byId: (id: string) => `${BASE_URL}/v1/admin/seller-applications/${id}`,
      review: (id: string) => `${BASE_URL}/v1/admin/seller-applications/${id}/review`,
    },
    sellers: `${BASE_URL}/v1/admin/sellers`,
    products: `${BASE_URL}/v1/admin/products`,
    productStatus: (id: string) => `${BASE_URL}/v1/admin/products/${id}/status`,
  },

  // ── Settings ─────────────────────────────────────────────────
  settings: {
    get:    `${BASE_URL}/settings`,
    update: `${BASE_URL}/settings`,
  },
} as const;
