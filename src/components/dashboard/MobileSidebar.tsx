// src/components/dashboard/MobileSidebar.tsx
'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { closeMobile } from '@/lib/redux/features/sidebarSlice'
import { Sidebar } from './Sidebar'

export function MobileSidebar() {
  const dispatch = useAppDispatch()
  const isMobileOpen = useAppSelector((state) => state.sidebar.isMobileOpen)

  useEffect(() => {
    // Close on resize to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileOpen) {
        dispatch(closeMobile())
      }
    }

    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        dispatch(closeMobile())
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleEscape)
    
    // Prevent body scroll when mobile sidebar is open
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileOpen, dispatch])

  return (
    <>
      {/* Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => dispatch(closeMobile())}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 md:hidden
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>
    </>
  )
}