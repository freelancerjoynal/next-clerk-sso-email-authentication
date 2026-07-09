// src/lib/redux/features/sidebarSlice.ts
// (এই ফাইলটি আগে থেকেই আছে, কিন্তু চেক করে নিন)
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SidebarState {
  isOpen: boolean
  isMobileOpen: boolean
}

const initialState: SidebarState = {
  isOpen: true,
  isMobileOpen: false,
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen
    },
    setMobileOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileOpen = action.payload
    },
    closeMobile: (state) => {
      state.isMobileOpen = false
    },
  },
})

export const { toggleSidebar, setMobileOpen, closeMobile } = sidebarSlice.actions
export default sidebarSlice.reducer