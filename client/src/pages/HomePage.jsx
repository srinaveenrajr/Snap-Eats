import { useMemo, useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  setSearchTerm,
  setFilter,
  setRestaurants,
  setLoading,
  setError,
  clearError,
} from "../features/restaurantSlice";
import { addToCart } from "../features/cartSlice";
import RestaurantCard from "../components/RestaurantCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import { Search, Filter, TrendingUp, RefreshCw } from "lucide-react";

// Helper function to transform Swiggy data
const transformRestaurantData = (data) => {
  try {
    const restaurants = [];
    const cards =
      data?.data?.cards[1]?.groupedCard?.cardGroupMap?.RESTAURANT?.cards || [];
    cards.map((card) => {
      // Look for the restaurant in the card structure
      if (card?.card?.card?.info) {
        const info = card.card.card.info;
        if (info.id && info.name) {
          restaurants.push({
            id: info.id,
            name: info.name || "Unknown Restaurant",
            image: info.cloudinaryImageId
              ? `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_264,h_288,c_fill/${info.cloudinaryImageId}`
              : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop",
            category: info.cuisine?.[0] || "Multi Cuisine",
            cuisine: info.cuisine?.join(", ") || "Multi Cuisine",
            rating: parseFloat(info.avgRating) || 4.0,
            deliveryTime: info.sla?.deliveryTime || "30-40",
            priceForTwo: info.costForTwo
              ? info.costForTwo.replace(/[^0-9]/g, "")
              : "300",
            promoted: info.promoted || false,
            location: {
              lat: info.lat || 13.0895,
              lng: info.lng || 80.2739,
            },
            areaName: info.areaName || "Unknown Area",
            locality: info.locality || "Unknown Locality",
          });
        }
      }
    });

    return restaurants;
  } catch (error) {
    console.error("Error transforming restaurant data:", error);
    return [];
  }
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { restaurants, searchTerm, filter, loading, error } = useSelector(
    (state) => state.restaurant,
  );

  const [activeCategory, setActiveCategory] = useState("All");

  const fetchRestaurantsFromSwiggy = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      const url =
        "https://www.swiggy.com/dapi/restaurants/search/v3?lat=13.08950&lng=80.27390&str=restaurant&trackingId=14a85ede-886d-8a98-6e8c-893e4c32477f&submitAction=ENTER&queryUniqueId=a7adc51a-2df9-67d1-4085-0bef1805378c";
      const response = await axios.get(url);
      const transformedData = transformRestaurantData(response.data);
      dispatch(setRestaurants(transformedData));
    } catch (err) {
      dispatch(setError(err.message || "Failed to fetch restaurants"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch restaurants on initial load
  useEffect(() => {
    fetchRestaurantsFromSwiggy();
  }, [fetchRestaurantsFromSwiggy]);

  // Filter restaurants based on search term (frontend filtering)
  const filteredRestaurants = useMemo(() => {
    let list = restaurants;

    // Frontend search filtering
    if (searchTerm.trim()) {
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by rating
    if (filter === "top") {
      list = list.filter((r) => (r.rating || 0) >= 4.5);
    }

    // Filter by category
    if (activeCategory !== "All") {
      list = list.filter(
        (r) =>
          r.category?.toLowerCase() === activeCategory.toLowerCase() ||
          r.cuisine?.toLowerCase().includes(activeCategory.toLowerCase()),
      );
    }

    return list;
  }, [restaurants, searchTerm, filter, activeCategory]);

  // Extract unique categories from restaurants
  const categories = useMemo(() => {
    const uniqueCategories = new Set(["All"]);
    restaurants.forEach((r) => {
      if (r.category) uniqueCategories.add(r.category);
      if (r.cuisine) {
        r.cuisine.split(",").forEach((c) => uniqueCategories.add(c.trim()));
      }
    });
    return Array.from(uniqueCategories).slice(0, 8);
  }, [restaurants]);

  const topRestaurants = restaurants
    .filter((r) => (r.rating || 0) >= 4.5)
    .slice(0, 3);

  const handleRetry = () => {
    fetchRestaurantsFromSwiggy();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {/* Hero Section */}
        <div className=" mt-[80px]  bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 mb-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">
              Order food & groceries. Discover best restaurants.
            </h1>
            <p className="text-orange-100 mb-6 text-lg">
              Fast delivery, great prices, amazing taste!
            </p>

            {/* Search Bar - Frontend Filtering Only */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                placeholder="Search for restaurants, cuisines, dishes..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <button
                onClick={() =>
                  dispatch(setFilter(filter === "top" ? "all" : "top"))
                }
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "top"
                    ? "bg-white text-orange-600"
                    : "bg-orange-400 text-white hover:bg-orange-300"
                }`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State - Skeleton Cards */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 text-center">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              Failed to load restaurants
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* Quick Stats */}
        {!loading && !error && restaurants.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-orange-600">
                {restaurants.length}+
              </div>
              <div className="text-sm text-gray-500">Restaurants</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-orange-600">30 min</div>
              <div className="text-sm text-gray-500">Avg Delivery</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-orange-600">4.5★</div>
              <div className="text-sm text-gray-500">Avg Rating</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-500">Service</div>
            </div>
          </div>
        )}

        {/* Categories */}
        {!loading && !error && categories.length > 1 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              What's on your mind?
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex flex-col items-center min-w-[80px] p-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                    activeCategory === category
                      ? "bg-orange-500 text-white shadow-lg scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xs font-medium">{category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Top Rated Restaurants */}
        {!loading &&
          !error &&
          filter !== "top" &&
          topRestaurants.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  Top Rated Restaurants
                </h2>
                <button
                  onClick={() => dispatch(setFilter("top"))}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={{ ...restaurant, promoted: true }}
                    onAddToCart={() =>
                      dispatch(
                        addToCart({
                          id: `${restaurant.id}-popular`,
                          name: restaurant.name,
                          price: 299,
                          restaurantId: restaurant.id,
                        }),
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )}

        {/* All Restaurants */}
        {!loading && !error && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {filter === "top" ? "Top Rated Restaurants" : "All Restaurants"}
              {activeCategory !== "All" && ` - ${activeCategory}`}
              {searchTerm && ` - "${searchTerm}"`}
            </h2>

            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {restaurants.length === 0
                    ? "No restaurants available"
                    : "No restaurants found"}
                </h3>
                <p className="text-gray-500">
                  {restaurants.length === 0
                    ? "Unable to load restaurants. Please check your connection."
                    : "Try adjusting your search or filters"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onAddToCart={() =>
                      dispatch(
                        addToCart({
                          id: `${restaurant.id}-popular`,
                          name: restaurant.name,
                          price: 299,
                          restaurantId: restaurant.id,
                        }),
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
