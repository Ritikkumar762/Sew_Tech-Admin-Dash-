// ============================================================
// Shared TypeScript Types for the entire Admin Panel
// Add new types here as you expand modules
// ============================================================

export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}>;

// --- USER ---
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinedAt: string;
  avatar?: string;
};

// --- ORDER ---
export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  createdAt: string;
  items: number;
};

// --- SPARE PART ---
export type Spare = {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

// --- ALERT ---
export type Alert = {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'error' | 'info' | 'success';
  createdAt: string;
  read: boolean;
};

// --- FINANCE ---
export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
};

// --- SUPPORT TICKET ---
export type SupportTicket = {
  id: string;
  subject: string;
  raisedBy: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
};

// --- MECHANIC ---
export type Mechanic = {
  id: string;
  name: string;
  phone: string;
  location: string;
  expertise: string;
  status: 'Available' | 'Busy' | 'Offline';
  rating: number;
  totalJobs: number;
};

// --- ACADEMY COURSE ---
export type Course = {
  id: string;
  title: string;
  instructor: string;
  enrollments: number;
  status: 'Published' | 'Draft' | 'Archived';
  category: string;
  createdAt: string;
};

// --- MARKETING CAMPAIGN ---
export type Campaign = {
  id: string;
  name: string;
  type: 'Email' | 'SMS' | 'Push' | 'Banner';
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  reach: number;
  conversions: number;
  startDate: string;
  endDate: string;
};
