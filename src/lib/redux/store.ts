// src/lib/redux/store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

// --- User Slice ---
interface UserState {
  name: string
  email: string
  role: 'admin' | 'customer' | 'user' | null
}

const userInitialState: UserState = {
  name: '',
  email: '',
  role: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string; email: string; role: 'admin' | 'customer' | 'user' }>) => {
      state.name = action.payload.name
      state.email = action.payload.email
      state.role = action.payload.role
    },
    clearUser: (state) => {
      state.name = ''
      state.email = ''
      state.role = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

// --- Sidebar Slice ---
interface SidebarState {
  isOpen: boolean
  isMobileOpen: boolean
}

const sidebarInitialState: SidebarState = {
  isOpen: true,
  isMobileOpen: false,
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: sidebarInitialState,
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

// --- Counter Slice (Testing) ---
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
  },
})

export const { increment, decrement } = counterSlice.actions

// --- Store ---
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    counter: counterSlice.reducer,
    sidebar: sidebarSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch