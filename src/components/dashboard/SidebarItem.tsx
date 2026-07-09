// src/components/dashboard/SidebarItem.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MenuItem } from '@/types'
import { Icons } from '@/components/ui/icons'

interface SidebarItemProps {
  item: MenuItem
  isOpen: boolean
  pathname: string
}

export function SidebarItem({ item, isOpen, pathname }: SidebarItemProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
  const isChildActive = hasChildren && item.children?.some(child => 
    pathname === child.href || pathname?.startsWith(child.href + '/')
  )

  // Divider
  if (item.divider) {
    return <hr className="my-2 border-gray-200 dark:border-zinc-800" />
  }

  // Dropdown
  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg
            transition-colors duration-200
            ${isChildActive || isActive 
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }
          `}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          {isOpen && (
            <>
              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              <Icons.chevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
        
        {isOpen && isDropdownOpen && (
          <div className="ml-7 mt-1 space-y-1">
            {item.children?.map((child) => (
              <SidebarItem 
                key={child.id} 
                item={child} 
                isOpen={true}
                pathname={pathname}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Single Link
  return (
    <Link
      href={item.href || '#'}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg
        transition-colors duration-200
        ${isActive 
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
        }
      `}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {isOpen && <span className="text-sm font-medium">{item.label}</span>}
    </Link>
  )
}