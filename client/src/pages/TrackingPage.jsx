import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  ShoppingBag,
  X,
} from "lucide-react";
import { cancelOrder } from "../features/ordersSlice";

const TrackingPage = () => {
  const orders = useSelector((state) => state.orders?.orders || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("TrackingPage - Orders from Redux:", orders);

  // If no orders, show empty state
  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="text-center mt-20 py-16">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No Orders Yet
          </h2>
          <p className="text-gray-500 mb-6">
            You haven't placed any orders yet. Start ordering to see your order
            history!
          </p>
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

  // Show the most recent order
  const latestOrder = orders[orders.length - 1];

  const getOrderStatus = (status) => {
    const statusMap = {
      confirmed: {
        icon: CheckCircle,
        color: "text-green-600",
        label: "Order Confirmed",
      },
      preparing: { icon: Clock, color: "text-blue-600", label: "Preparing" },
      ready: {
        icon: Package,
        color: "text-orange-600",
        label: "Ready for Pickup",
      },
      delivered: {
        icon: Truck,
        color: "text-purple-600",
        label: "Out for Delivery",
      },
      completed: {
        icon: CheckCircle,
        color: "text-green-600",
        label: "Delivered",
      },
    };
    return statusMap[status] || statusMap.confirmed;
  };

  const currentStatus = getOrderStatus(latestOrder.status);

  const handleCancelOrder = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrder(latestOrder.id));
      // Optionally navigate back to home
      navigate("/");
    }
  };

  // Check if order can be cancelled (only if it's confirmed or preparing)
  const canCancelOrder =
    latestOrder.status === "confirmed" || latestOrder.status === "preparing";

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Order Tracking</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Order #{latestOrder.id}</h3>
            <p className="text-gray-600">{latestOrder.restaurantName}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">₹{latestOrder.totalAmount}</p>
            <p className="text-sm text-gray-500">
              {latestOrder.items.length} items
            </p>
            {canCancelOrder && (
              <button
                onClick={handleCancelOrder}
                className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Cancel Order
              </button>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-3 mb-4">
            <currentStatus.icon className={`w-6 h-6 ${currentStatus.color}`} />
            <div>
              <p className={`font-semibold ${currentStatus.color}`}>
                {currentStatus.label}
              </p>
              <p className="text-sm text-gray-500">
                {latestOrder.status === "confirmed" &&
                  "Your order has been received and is being prepared."}
                {latestOrder.status === "preparing" &&
                  "The restaurant is preparing your delicious food."}
                {latestOrder.status === "ready" &&
                  "Your order is ready and waiting for pickup."}
                {latestOrder.status === "delivered" &&
                  "Your order is on the way!"}
                {latestOrder.status === "completed" &&
                  "Your order has been delivered. Enjoy!"}
              </p>
            </div>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Estimated delivery time</span>
              <span className="font-semibold">30-40 minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      {orders.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Previous Orders</h3>
          <div className="space-y-3">
            {orders
              .slice(0, -1)
              .reverse()
              .map((order) => {
                const canCancel =
                  order.status === "confirmed" || order.status === "preparing";
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {order.restaurantName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{order.totalAmount}</p>
                        <p className="text-sm text-gray-500">{order.status}</p>
                        {canCancel && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to cancel this order?",
                                )
                              ) {
                                dispatch(cancelOrder(order.id));
                              }
                            }}
                            className="mt-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;
