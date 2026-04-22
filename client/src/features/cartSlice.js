import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {},
  totalQuantity: 0,
  totalAmount: 0,
  status: "idle",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      console.log('cartSlice - addToCart called with:', action.payload);
      const item = action.payload;
      const current = state.items[item.id];
      if (current) {
        current.quantity += 1;
        current.subtotal = current.quantity * current.price;
      } else {
        state.items[item.id] = { ...item, quantity: 1, subtotal: item.price };
      }
      state.totalQuantity += 1;
      state.totalAmount += item.price;
      console.log('cartSlice - Cart state after adding:', state.items);
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const current = state.items[id];
      if (!current) return;
      state.totalQuantity -= current.quantity;
      state.totalAmount -= current.subtotal;
      delete state.items[id];
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const current = state.items[id];
      if (!current || quantity < 1) return;
      state.totalQuantity += quantity - current.quantity;
      state.totalAmount += (quantity - current.quantity) * current.price;
      current.quantity = quantity;
      current.subtotal = current.price * quantity;
    },
    clearCart(state) {
      console.log('cartSlice - clearCart called, clearing cart items');
      state.items = {};
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
