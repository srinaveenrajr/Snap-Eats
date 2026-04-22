import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../features/ordersSlice';
import { clearCart, addToCart } from '../features/cartSlice';
import { ShoppingCart, MapPin, CreditCard, User } from 'lucide-react';

const CheckoutPage = () => {
  console.log('CheckoutPage component loaded');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  
  console.log('CheckoutPage - Cart items:', cartItems);
  console.log('CheckoutPage - User:', user);
  
  // Calculate cart totals
  const items = Object.values(cartItems);
  console.log('CheckoutPage - Cart items raw:', cartItems);
  console.log('CheckoutPage - Items array:', items);
  console.log('CheckoutPage - Items length:', items.length);
  
  const totalAmount = items.reduce((total, item) => total + (item.subtotal || item.price), 0);
  const totalQuantity = items.reduce((total, item) => total + (item.quantity || 1), 0);
  
  console.log('CheckoutPage - Total Amount:', totalAmount);
  console.log('CheckoutPage - Should show empty state?', items.length === 0);

  const handlePlaceOrder = () => {
    console.log('Place Order clicked');
    console.log('Cart items:', cartItems);
    console.log('Items array:', items);
    
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      // Create order object
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          subtotal: item.subtotal || item.price
        })),
        totalAmount,
        totalQuantity,
        restaurantName: items[0]?.restaurantName || 'Restaurant',
        customerName: user?.name || 'Guest',
        customerEmail: user?.email || 'guest@example.com',
        deliveryAddress: '123 Main St, City, State 12345',
        paymentMethod: 'Cash on Delivery'
      };

      console.log('Creating order with data:', orderData);

      // Create the order
      dispatch(createOrder(orderData));
      
      console.log('Order created, clearing cart');
      
      // Clear the cart
      dispatch(clearCart());
      
      console.log('Cart cleared, navigating to tracking');
      
      // Navigate to tracking page
      navigate('/tracking');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    }
  };

  // Test function to add item directly
  const handleTestAddItem = () => {
    console.log('Test: Adding item directly to cart');
    const testItem = {
      id: 'test-item-1',
      name: 'Test Burger',
      price: 150,
      description: 'A test burger for debugging',
      restaurantName: 'Test Restaurant'
    };
    
    dispatch(addToCart(testItem));
    console.log('Test item added to cart');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="text-center py-16">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Add some delicious items to your cart before checkout!</p>
          
          {/* Test Button */}
          <button 
            onClick={handleTestAddItem}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-4"
          >
            🧪 Add Test Item to Cart
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      <div className="grid gap-6">
        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity || 1} × ₹{item.price}</p>
                </div>
                <p className="font-semibold">₹{item.subtotal || item.price}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-xl font-bold text-orange-600">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">{user?.name || 'Guest User'}</p>
                <p className="text-sm text-gray-600">{user?.email || 'guest@example.com'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Delivery Address</p>
                <p className="text-sm text-gray-600">123 Main St, City, State 12345</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Payment Method</p>
                <p className="text-sm text-gray-600">Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button 
          onClick={handlePlaceOrder}
          className="w-full py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg"
        >
          Place Order • ₹{totalAmount}
        </button>
        
        {/* Test Button */}
        <button 
          onClick={() => console.log('Test button clicked!')}
          className="w-full mt-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Test Click
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
