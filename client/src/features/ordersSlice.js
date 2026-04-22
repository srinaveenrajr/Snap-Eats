import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  loading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action) => {
      console.log('ordersSlice - createOrder called with:', action.payload);
      const order = {
        id: Date.now().toString(),
        ...action.payload,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      console.log('ordersSlice - Creating order:', order);
      state.orders.push(order);
      console.log('ordersSlice - Orders after push:', state.orders);
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
      }
    },
    clearOrders: (state) => {
      state.orders = [];
    },
    cancelOrder: (state, action) => {
      const orderId = action.payload;
      state.orders = state.orders.filter(order => order.id !== orderId);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  createOrder, 
  updateOrderStatus, 
  clearOrders, 
  cancelOrder,
  setLoading, 
  setError, 
  clearError 
} = ordersSlice.actions;

export default ordersSlice.reducer;
