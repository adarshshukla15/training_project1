export const initialCustomers = [
  {
    id: 1,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    service: 'Premium Support',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    phone: '+91 98201 23456',
    service: 'Cloud Backup',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    phone: '+91 98190 56789',
    service: 'Device Care',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Kavya Nair',
    email: 'kavya.nair@example.com',
    phone: '+91 98470 12345',
    service: 'Premium Support',
    status: 'Inactive',
  },
  {
    id: 5,
    name: 'Arjun Kapoor',
    email: 'arjun.kapoor@example.com',
    phone: '+91 98990 67890',
    service: 'Cloud Backup',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Meera Joshi',
    email: 'meera.joshi@example.com',
    phone: '+91 97654 32109',
    service: 'Device Care',
    status: 'Active',
  },
  {
    id: 7,
    name: 'Vikram Reddy',
    email: 'vikram.reddy@example.com',
    phone: '+91 98490 24680',
    service: 'Premium Support',
    status: 'Inactive',
  },
  {
    id: 8,
    name: 'Isha Banerjee',
    email: 'isha.banerjee@example.com',
    phone: '+91 98300 13579',
    service: 'Cloud Backup',
    status: 'Active',
  },
]

export const serviceRequests = [
  {
    id: 1001,
    customer: 'Aarav Sharma',
    service: 'Account access recovery',
    status: 'In Progress',
    date: '2026-09-29',
  },
  {
    id: 1002,
    customer: 'Ananya Iyer',
    service: 'Backup restore',
    status: 'Pending',
    date: '2026-09-28',
  },
  {
    id: 1003,
    customer: 'Rohan Mehta',
    service: 'Device diagnostics',
    status: 'Completed',
    date: '2026-09-25',
  },
  {
    id: 1004,
    customer: 'Arjun Kapoor',
    service: 'Plan upgrade assistance',
    status: 'Pending',
    date: '2026-09-20',
  },
  {
    id: 1005,
    customer: 'Meera Joshi',
    service: 'Warranty replacement',
    status: 'In Progress',
    date: '2026-09-14',
  },
  {
    id: 1006,
    customer: 'Isha Banerjee',
    service: 'Cloud sync issue',
    status: 'Completed',
    date: '2026-09-03',
  },
  {
    id: 1007,
    customer: 'Vikram Reddy',
    service: 'Billing question',
    status: 'Pending',
    date: '2026-08-29',
  },
]

export const dashboardMetrics = {
  Today: {
    totalCustomers: 2,
    activeServices: 2,
    pendingRequests: 1,
    revenue: 1380,
  },
  'This Week': {
    totalCustomers: 5,
    activeServices: 4,
    pendingRequests: 2,
    revenue: 7280,
  },
  'This Month': {
    totalCustomers: 8,
    activeServices: 6,
    pendingRequests: 3,
    revenue: 18940,
  },
}

export const servicePrices = {
  'Premium Support': 89,
  'Cloud Backup': 49,
  'Device Care': 29,
}
