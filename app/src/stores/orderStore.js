import { create } from 'zustand'
import { customerOrders } from '../data/mockData'

export const useOrderStore = create((set) => ({
  orders: customerOrders,
  
  placeOrder: (orderData) => {
    // Generate a unique ID like ORD-1234
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      status: 'pending', // Pending orders can be accepted by delivery partners
      ...orderData
    };
    set((state) => ({ orders: [newOrder, ...state.orders] }));
    return newId;
  },

  acceptOrder: (id, partnerId = 'DP001') => set((state) => ({
    orders: state.orders.map((order) => 
      order.id === id ? { ...order, status: 'shipped', deliveryPartnerId: partnerId } : order
    )
  })),

  markDelivered: (id) => set((state) => ({
    orders: state.orders.map((order) => order.id === id ? { ...order, status: 'delivered' } : order),
  })),
}))
