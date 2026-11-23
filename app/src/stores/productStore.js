import { create } from 'zustand'
import axios from 'axios'
import { products as initialProducts } from '../data/mockData'

const API_BASE = 'http://localhost:3001/api'

export const useProductStore = create((set, get) => ({
  products: initialProducts, // Fallback to mock products on startup
  bulkOrders: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true })
    try {
      const res = await axios.get(`${API_BASE}/products`)
      set({ products: res.data, loading: false })
    } catch (e) {
      console.error('Failed to fetch products, using fallback:', e.message)
      set({ error: e.message, loading: false })
    }
  },

  addProduct: async (productData) => {
    try {
      const res = await axios.post(`${API_BASE}/products`, productData)
      set(state => ({ products: [...state.products, res.data] }))
      return res.data
    } catch (e) {
      set({ error: e.message })
      throw e;
    }
  },

  fetchBulkOrders: async () => {
    set({ loading: true })
    try {
      const res = await axios.get(`${API_BASE}/bulk-orders`)
      set({ bulkOrders: res.data, loading: false })
    } catch (e) {
      console.error('Failed to fetch bulk orders:', e.message)
      set({ error: e.message, loading: false })
    }
  },

  createBulkOrder: async (bulkOrderData) => {
    try {
      const res = await axios.post(`${API_BASE}/bulk-orders`, bulkOrderData)
      set(state => ({ bulkOrders: [...state.bulkOrders, res.data] }))
      return res.data
    } catch (e) {
      set({ error: e.message })
      throw e;
    }
  },

  updateBulkOrderStatus: async (orderId, status) => {
    try {
      const res = await axios.put(`${API_BASE}/bulk-orders/${orderId}`, { status })
      set(state => ({
        bulkOrders: state.bulkOrders.map(o => o.OrderID === orderId ? { ...o, Status: res.data.Status } : o)
      }))
      return res.data
    } catch (e) {
      set({ error: e.message })
      throw e;
    }
  }
}))
