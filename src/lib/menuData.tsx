// src/lib/menuData.tsx
import { Icons } from '@/components/ui/icons'
import { MenuItem, UserRole } from '@/types'

// Role-based menu items
export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Icons.dashboard className="w-5 h-5" />,
    href: '/dashboard',
    roles: ['admin', 'customer', 'user'], // সবাই দেখতে পাবে
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <Icons.chart className="w-5 h-5" />,
    href: '/analytics',
    roles: ['admin', 'customer'],
  },
  {
    id: 'divider-1',
    label: '',
    icon: null,
    href: '',
    divider: true,
  },
  {
    id: 'users',
    label: 'User Management',
    icon: <Icons.users className="w-5 h-5" />,
    href: '/users',
    roles: ['admin'], // শুধু admin দেখতে পাবে
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: <Icons.userCheck className="w-5 h-5" />,
    href: '/customers',
    roles: ['admin', 'customer'],
  },
  {
    id: 'divider-2',
    label: '',
    icon: null,
    href: '',
    divider: true,
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: <Icons.shopping className="w-5 h-5" />,
    href: '/orders',
    roles: ['admin', 'customer', 'user'],
    children: [
      {
        id: 'orders-list',
        label: 'All Orders',
        icon: <Icons.file className="w-4 h-4" />,
        href: '/orders/list',
        roles: ['admin', 'customer'],
      },
      {
        id: 'orders-pending',
        label: 'Pending Orders',
        icon: <Icons.alert className="w-4 h-4" />,
        href: '/orders/pending',
        roles: ['admin'],
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Icons.settings className="w-5 h-5" />,
    href: '/settings',
    roles: ['admin', 'customer', 'user'],
  },
]