// src/lib/redux/features/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  role: 'admin' | 'customer' | 'user' | null
  name: string | null
  email: string | null
  isAuthenticated: boolean
}

const initialState: UserState = {
  role: null,
  name: null,
  email: null,
  isAuthenticated: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ role: 'admin' | 'customer' | 'user'; name: string; email: string }>) => {
      state.role = action.payload.role
      state.name = action.payload.name
      state.email = action.payload.email
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.role = null
      state.name = null
      state.email = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer