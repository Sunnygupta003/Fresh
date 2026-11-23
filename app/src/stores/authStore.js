import { create } from 'zustand'

const loadUser = () => {
  try {
    const stored = localStorage.getItem('greenbasket_user')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const useAuthStore = create((set, get) => ({
  user: loadUser(),
  loading: false,
  error: null,

  get isAuthenticated() {
    return !!get().user
  },

  loginWithGoogle: (userData) => {
    localStorage.setItem('greenbasket_user', JSON.stringify(userData))
    set({ user: userData, error: null })
  },

  logout: () => {
    localStorage.removeItem('greenbasket_user')
    set({ user: null, error: null })
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))
