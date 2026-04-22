import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart } from "../features/cartSlice";
import { setSelectedRestaurant } from "../features/restaurantSlice";
import { fetchMenuItems, groupMenuByCategory } from "../utils/menuApi";
import { selectIsAuthenticated } from "../features/authSlice";
import MenuSkeleton from "../components/MenuSkeleton.jsx";
import {
  Loader2,
  Clock,
  MapPin,
  Star,
  IndianRupee,
  AlertCircle,
  ChefHat,
} from "lucide-react";

const RestaurantPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const restaurants = useSelector((state) => state.restaurant.restaurants);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [groupedMenu, setGroupedMenu] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Find restaurant from Redux store
  useEffect(() => {
    const foundRestaurant = restaurants.find((r) => r.id === id);
    if (foundRestaurant) {
      setRestaurant(foundRestaurant);
      dispatch(setSelectedRestaurant(id));
      loadMenu(id);
    } else {
      setError(
        "Restaurant not found. Please go back and select a restaurant from the home page.",
      );
    }
  }, [id, restaurants, dispatch]);

  // Load menu items using proxy API
  const loadMenu = async (restaurantId) => {
    setLoading(true);
    setError(null);

    try {
      const menuResponse = await fetchMenuItems(restaurantId);

      if (menuResponse.success) {
        setMenu(menuResponse.data);

        // Group menu items by category
        const grouped = groupMenuByCategory(menuResponse.data);
        setGroupedMenu(grouped);
      } else {
        console.error("Menu API returned error:", menuResponse.error);
        setError(menuResponse.error || "Failed to load menu items");
      }
    } catch (err) {
      console.error("Error loading menu:", err);
      setError("Failed to load menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle retry
  const handleRetry = () => {
    if (restaurant) {
      loadMenu(restaurant.id);
    }
  };

  // Add item to cart
  const handleAddToCart = (item) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate("/login", {
        state: {
          from: { pathname: `/restaurant/${id}` },
          message: "Please login to add items to cart",
        },
      });
      return;
    }

    console.log("Adding to cart:", item);
    console.log("Restaurant name:", restaurant.name);

    const cartItem = {
      ...item,
      id: `${id}-${item.id}`,
      restaurantId: id,
      restaurantName: restaurant.name,
    };

    console.log("Cart item to add:", cartItem);

    dispatch(addToCart(cartItem));
    console.log("Item added to cart");
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Restaurant not found
          </h2>
          <p className="text-gray-500">
            The restaurant you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Restaurant Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-orange-400 to-red-500">
          <img
            src={
              restaurant.image ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop"
            }
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">
              {restaurant.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                <span>{restaurant.rating || "4.2"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime || "30-40"} min</span>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                <span>{restaurant.priceForTwo || "300"} for two</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Restaurant Info */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">About this place</h2>
          <p className="text-gray-600 mb-4">
            {restaurant.cuisine || "Multi Cuisine Restaurant"}
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.areaName || "2.5 km away"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Open now</span>
            </div>
          </div>
        </div>

        {/* Menu Loading State */}
        {loading && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading menu items...</span>
            </div>
            <MenuSkeleton />
          </div>
        )}

        {/* Menu Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Unable to Load Menu
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 mx-auto"
            >
              <Loader2 className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Menu Items */}
        {!loading && !error && menu.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <ChefHat className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
              <span className="text-sm text-gray-500">
                ({menu.length} items)
              </span>
            </div>

            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  {category}
                  <span className="text-sm text-gray-500">
                    ({items.length})
                  </span>
                </h3>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-2 mb-2">
                            <h4 className="font-semibold text-gray-800">
                              {item.name}
                            </h4>
                            {item.isVeg !== undefined && (
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  item.isVeg
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {item.isVeg ? "🟢" : "🔴"}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-orange-600 font-semibold">
                              <IndianRupee className="w-4 h-4" />
                              <span>{item.price}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 rounded-lg object-cover mb-2"
                            />
                          )}
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.inStock}
                            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              item.inStock
                                ? "bg-orange-500 hover:bg-orange-600 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {item.inStock ? "Add +" : "Out of Stock"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Menu State */}
        {!loading && !error && menu.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Menu Items Available
            </h3>
            <p className="text-gray-500">
              This restaurant's menu is currently not available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;
