import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../features/cartSlice";

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!cart.totalQuantity) {
    return (
      <div className="p-8 text-center mt-30">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <div className="mt-7">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Cart</h2>

      {Object.values(cart.items).map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border border-slate-200 rounded-lg p-3"
        >
          <div>
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm text-slate-500">
              ₹{item.price} x {item.quantity}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 rounded bg-slate-200"
              onClick={() =>
                dispatch(
                  updateQuantity({ id: item.id, quantity: item.quantity - 1 }),
                )
              }
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              className="px-2 py-1 rounded bg-slate-200"
              onClick={() =>
                dispatch(
                  updateQuantity({ id: item.id, quantity: item.quantity + 1 }),
                )
              }
            >
              +
            </button>
            <button
              className="px-3 py-1 rounded bg-rose-500 text-white"
              onClick={() => dispatch(removeFromCart(item.id))}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mt-6">
        <span className="text-lg font-semibold">Total ₹{cart.totalAmount}</span>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200"
            onClick={() => dispatch(clearCart())}
          >
            Clear
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
            onClick={() => navigate("/checkout")}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
