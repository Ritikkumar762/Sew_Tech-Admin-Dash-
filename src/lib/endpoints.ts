/**
 * API Endpoints — Single Source of Truth
 * Update BASE_URL in your .env.local: NEXT_PUBLIC_API_URL=https://your-api.com
 * All API routes are defined here. Never hardcode URLs in hooks.
 */

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://project-sewtech-mart.onrender.com/api/v1';
export const temp = 'http://localhost:8000/api/v1';
export const MARKETING_BASE_URL = BASE_URL;
// Alerts backend — change this URL once deployed; everything else uses BASE_URL
export const ALERTS_BASE_URL = BASE_URL;

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
    list:              `${BASE_URL}/spares`,
    byId:              (id: string) => `${BASE_URL}/spares/${id}`,
    create:            `${BASE_URL}/spares`,
    update:            (id: string) => `${BASE_URL}/spares/${id}`,
    delete:            (id: string) => `${BASE_URL}/spares/${id}`,
    orders:            `${BASE_URL}/admin/spares/orders`,
    orderById:         (id: string) => `${BASE_URL}/admin/spares/orders/${id}`,
    requests:          `${BASE_URL}/spares/requests`,
    inventory:         `${BASE_URL}/admin/products`,
    updateVariant:     (productId: string, variantId: string) => `${BASE_URL}/admin/products/${productId}/variants/${variantId}`,
    bulkUploadPreview: `${temp}/admin/products/bulk-upload/preview`,
    bulkUploadConfirm: `${temp}/admin/products/bulk-upload/confirm`,
    bulkEdit:          `${temp}/admin/products/bulk-edit`,
  },

  // ── Orders & Invoices ─────────────────────────────────────────
  orders: {
    invoice:     (id: string) => `${BASE_URL}/admin/orders/${id}/invoice`,
    invoiceData: (id: string) => `${BASE_URL}/admin/orders/${id}/invoice-data`,
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
    applications:    `${BASE_URL}/admin/care/mechanics/applications`,
    applicationById: (id: string) => `${BASE_URL}/admin/care/mechanics/applications/${id}`,
    applicationStatus: (id: string) => `${BASE_URL}/admin/care/mechanics/applications/${id}/status`,
    applicationJobs:   (id: string) => `${BASE_URL}/admin/care/mechanics/applications/${id}/jobs`,
    applicationPerf:   (id: string) => `${BASE_URL}/admin/care/mechanics/applications/${id}/performance`,
  },

  // ── Support & Dispute ──────────────────────────────────────────
  support: {
    // Ticket Admin APIs
    tickets:             `${BASE_URL}/support/tickets`,
    byId:                (id: string) => `${BASE_URL}/support/tickets/${id}`,
    create:              `${BASE_URL}/support/tickets`,
    assign:              (id: string) => `${BASE_URL}/support/tickets/${id}/assign`,
    status:              (id: string) => `${BASE_URL}/support/tickets/${id}/status`,
    priority:            (id: string) => `${BASE_URL}/support/tickets/${id}/priority`,
    reply:               (id: string) => `${BASE_URL}/support/tickets/${id}/reply`,
    close:               (id: string) => `${BASE_URL}/support/tickets/${id}/close`,
    reopen:              (id: string) => `${BASE_URL}/support/tickets/${id}/reopen`,
    timeline:            (id: string) => `${BASE_URL}/support/tickets/${id}/timeline`,
    attachments:         (id: string) => `${BASE_URL}/support/tickets/${id}/attachments`,
    resolve:             (id: string) => `${BASE_URL}/support/tickets/${id}/resolve`,
    escalate:            (id: string) => `${BASE_URL}/support/tickets/${id}/escalate`,

    // Dispute & Refund Admin APIs
    disputes:            `${BASE_URL}/support/disputes`,
    disputeById:         (id: string) => `${BASE_URL}/support/disputes/${id}`,
    disputeAction:       (id: string) => `${BASE_URL}/support/disputes/${id}/action`,
    disputeModalAction:  (id: string) => `${BASE_URL}/support/disputes/${id}/modal-action`,
    disputeRefundInitiate: (id: string) => `${BASE_URL}/support/disputes/${id}/refund/initiate`,
    disputeRefundComplete: (id: string) => `${BASE_URL}/support/disputes/${id}/refund/complete`,
    disputeCancel:       (id: string) => `${BASE_URL}/support/disputes/${id}/cancel`,
    disputeTimeline:     (id: string) => `${BASE_URL}/support/disputes/${id}/timeline`,
    disputeEvidence:     (id: string) => `${BASE_URL}/support/disputes/${id}/evidence`,

    // Analytics & Outbox Worker APIs
    analyticsDashboard:  `${BASE_URL}/support/analytics/dashboard`,
    outboxStatus:        `${BASE_URL}/support/outbox/status`,
  },

  // ── Marketing ────────────────────────────────────────────────
  marketing: {
    // Campaign & Banner Management
    stats:        `${BASE_URL}/marketing/stats`,            // GET - Metrics & Performance summary
    banners:      `${BASE_URL}/marketing/banners`,          // GET, POST - Active/Live Banners List
    bannerById:   (id: string) => `${BASE_URL}/marketing/banners/${id}`, // GET, PUT, DELETE - Banner Wizard

    // Saved Creative Assets Library
    creatives:    `${BASE_URL}/marketing/creatives`,        // GET, POST - Assets Grid
    creativeById: (id: string) => `${BASE_URL}/marketing/creatives/${id}`, // GET, PUT, DELETE
    creativeCopy: (id: string) => `${BASE_URL}/marketing/creatives/${id}/copy`, // POST - Duplication Node
    
    // Media Upload Node
    upload:       `${BASE_URL}/marketing/upload`,           // POST (multipart/form-data)
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
    industries: `${BASE_URL}/mdm/industries`,
    industryById: (id: string) => `${BASE_URL}/mdm/industries/${id}`,
    machines:   `${BASE_URL}/mdm/machines`,
    machineById: (id: string) => `${BASE_URL}/mdm/machines/${id}`,
    categories: `${BASE_URL}/mdm/categories`,
    locations:  `${BASE_URL}/mdm/locations`,
    pricing:    `${BASE_URL}/mdm/pricing`,
    skills:     `${BASE_URL}/mdm/skills`,
  },

  // ── Admin ───────────────────────────────────────────────────
  admin: {
    dashboard: {
      smartView: `${BASE_URL}/admin/dashboard/smart-view`,
    },
    sellerApplications: {
      list: `${BASE_URL}/admin/seller-applications`,
      byId: (id: string) => `${BASE_URL}/admin/seller-applications/${id}`,
      review: (id: string) => `${BASE_URL}/admin/seller-applications/${id}/review`,
    },
    sellers: `${BASE_URL}/admin/sellers`,
    products: `${BASE_URL}/admin/products`,
    productStatus: (id: string) => `${BASE_URL}/admin/products/${id}/status`,
    productTags: (id: string) => `${BASE_URL}/admin/products/${id}/tags`,
  },
  
  seller: {
    products: `${BASE_URL}/seller/products`,
    variants: (productId: string) => `${BASE_URL}/seller/products/${productId}/variants`,
    variantDelete: (productId: string, variantId: string) => `${BASE_URL}/admin/products/${productId}/variants/${variantId}`,
  },

  mart: {
    categories: `${BASE_URL}/mart/categories`,
    brands:     `${BASE_URL}/mart/brands`,
    tags:       `${BASE_URL}/mart/tags`,
  },

  // ── Settings ─────────────────────────────────────────────────
  settings: {
    get:    `${BASE_URL}/settings`,
    update: `${BASE_URL}/settings`,
  },
} as const;
