// src/types/index.ts
export type UserRole = 'admin' | 'customer' | 'user'

export interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  roles?: UserRole[]  // কোন role access পাবে
  children?: MenuItem[]  // Dropdown items
  divider?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  imageUrl?: string
}