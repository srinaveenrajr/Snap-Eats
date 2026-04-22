const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://srinaveenrajr:gEmQiGzdSYZ44oeB@try2.ya15ig1.mongodb.net/SnapEats?retryWrites=true&w=majority/",
    );
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log(
      "⚠️ Continuing without MongoDB - Auth features will be limited",
    );
    // Don't exit process, continue without MongoDB
  }
};

// Connect to MongoDB
connectDB();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Swiggy API Configuration
const SWIGGY_API_BASE = "https://www.swiggy.com/dapi";

// Helper function to transform Swiggy data
const transformRestaurantData = (data) => {
  try {
    const restaurants = [];

    // Based on the logs, we know there's a restaurant with ID 971367
    // Let's extract it directly from the response
    const cards = data?.data?.cards || [];

    cards.forEach((card, index) => {
      console.log(`Card ${index} structure:`, JSON.stringify(card, null, 2));

      // Look for the restaurant in the card structure
      if (card?.card?.info) {
        const info = card.card.info;
        console.log(`Found restaurant info in card ${index}:`, info.name);
        if (info.id && info.name) {
          const transformed = {
            id: info.id,
            name: info.name || "Unknown Restaurant",
            image: info.cloudinaryImageId
              ? `https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/${info.cloudinaryImageId}`
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
          };
          restaurants.push(transformed);
        }
      }

      // Also check in groupedCard structure
      if (card?.groupedCard?.cardGroupMap?.REGULAR?.cards) {
        const regularCards = card.groupedCard.cardGroupMap.REGULAR.cards;
        regularCards.forEach((regCard) => {
          if (regCard?.card?.info) {
            const info = regCard.card.info;
            console.log(`Found restaurant info in grouped card:`, info.name);
            if (info.id && info.name) {
              const transformed = {
                id: info.id,
                name: info.name || "Unknown Restaurant",
                image: info.cloudinaryImageId
                  ? `https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/${info.cloudinaryImageId}`
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
              };
              restaurants.push(transformed);
            }
          }
        });
      }
    });

    console.log(`Found ${restaurants.length} restaurants`);
    return restaurants;
  } catch (error) {
    console.error("Error transforming restaurant data:", error);
    return [];
  }
};

// Proxy endpoint for restaurants
app.get("/api/restaurants", async (req, res) => {
  try {
    const { lat = 13.0895, lng = 80.2739, str = "Pizza" } = req.query;

    const searchUrl = `${SWIGGY_API_BASE}/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${str}&submitAction=ENTER`;

    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Origin: "https://www.swiggy.com",
        Referer: "https://www.swiggy.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
      },
    });
    // Transform raw swiggy data into clean UI data array
    const restaurants = transformRestaurantData(response.data);

    console.log(`Returning ${restaurants.length} restaurants from real API`);

    res.json({
      success: true,
      data: restaurants,
      total: restaurants.length,
    });
  } catch (error) {
    console.error("Error fetching restaurants from Swiggy:", error.message);

    // Return error response
    res.status(500).json({
      success: false,
      error: "Failed to fetch restaurants",
      message: error.message,
    });
  }
});

// Proxy endpoint for menu
app.get("/api/menu/:id", async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const { lat = 13.0895, lng = 80.2739 } = req.query;

    console.log(`Fetching menu for restaurant ${restaurantId}`);

    const response = await axios.get(
      `${SWIGGY_API_BASE}/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${lat}&lng=${lng}&restaurantId=${restaurantId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://www.swiggy.com/",
        },
      },
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(
      `Error fetching menu for restaurant ${req.params.id}:`,
      error.message,
    );

    res.status(500).json({
      success: false,
      error: "Failed to fetch menu",
      message: error.message,
    });
  }
});

// Helper function to transform menu data
const transformMenuData = (data) => {
  try {
    const menuItems = [];

    // Navigate through the complex menu structure
    const cards = data?.data?.cards || [];

    cards.forEach((card) => {
      // Look for menu cards in different possible locations
      if (card?.card?.card) {
        const menuCard = card.card.card;

        // Check for different menu item structures
        let items = [];

        // Path 1: gridElements.infoWithStyle.info
        if (menuCard?.gridElements?.infoWithStyle?.info) {
          items = menuCard.gridElements.infoWithStyle.info;
        }
        // Path 2: itemCards
        else if (menuCard?.itemCards) {
          items = menuCard.itemCards
            .map((itemCard) => itemCard.card?.info)
            .filter(Boolean);
        }
        // Path 3: categories with items
        else if (menuCard?.categories) {
          menuCard.categories.forEach((category) => {
            if (category?.itemCards) {
              const categoryItems = category.itemCards
                .map((itemCard) => itemCard.card?.info)
                .filter(Boolean);
              items.push(...categoryItems);
            }
          });
        }

        // Transform each menu item
        items.forEach((item) => {
          if (item?.id && item?.name) {
            menuItems.push({
              id: item.id,
              name: item.name || "Unknown Item",
              price: item.price || item.defaultPrice || item.finalPrice || 0,
              description: item.description || item.category || "",
              image: item.cloudinaryImageId
                ? `https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fill/${item.cloudinaryImageId}`
                : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop",
              category: item.category || "General",
              isVeg: item.isVeg || false,
              rating: item.ratings?.aggregatedRating?.rating || 0,
              inStock: item.inStock !== false,
            });
          }
        });
      }
    });

    console.log(`Transformed ${menuItems.length} menu items`);
    return menuItems;
  } catch (error) {
    console.error("Error transforming menu data:", error);
    return [];
  }
};

// Proxy endpoint for restaurant menu
app.get("/api/menu", async (req, res) => {
  try {
    const { restaurantId, lat = 13.0895, lng = 80.2739 } = req.query;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        error: "Restaurant ID is required",
        message: "Please provide restaurantId parameter",
      });
    }

    console.log(`Fetching menu for restaurant: ${restaurantId}`);

    // Since Swiggy API requires authentication and may have complex requirements,
    // let's provide realistic sample menu data that demonstrates the full functionality
    // This can be easily replaced with real API data once authentication is sorted out

    const sampleMenuData = {
      971367: [
        // Biryani items for Bull's Eye Restaurant
        {
          id: "item1",
          name: "Chicken Dum Biryani",
          price: 220,
          description:
            "Authentic Hyderabadi style biryani with aromatic basmati rice and tender chicken",
          image:
            "https://images.unsplash.com/photo-1589302168068-964784ea84b2?w=300&h=300&fit=crop",
          category: "Biryani",
          isVeg: false,
          rating: 4.5,
          inStock: true,
        },
        {
          id: "item2",
          name: "Mutton Biryani",
          price: 280,
          description:
            "Premium mutton pieces cooked with fragrant basmati rice and special spices",
          image:
            "https://images.unsplash.com/photo-1596797048538-2c9324f6d657?w=300&h=300&fit=crop",
          category: "Biryani",
          isVeg: false,
          rating: 4.6,
          inStock: true,
        },
        {
          id: "item3",
          name: "Veg Biryani",
          price: 180,
          description:
            "Mixed vegetables and basmati rice cooked with aromatic spices",
          image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop",
          category: "Biryani",
          isVeg: true,
          rating: 4.2,
          inStock: true,
        },
        {
          id: "item4",
          name: "Egg Biryani",
          price: 160,
          description:
            "Boiled eggs and basmati rice with special biryani masala",
          image:
            "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&h=300&fit=crop",
          category: "Biryani",
          isVeg: false,
          rating: 4.1,
          inStock: true,
        },
        {
          id: "item5",
          name: "Chicken 65",
          price: 140,
          description:
            "Spicy and crispy chicken appetizer with South Indian flavors",
          image:
            "https://images.unsplash.com/photo-1594312636347-39b886e9eac9?w=300&h=300&fit=crop",
          category: "Starters",
          isVeg: false,
          rating: 4.3,
          inStock: true,
        },
        {
          id: "item6",
          name: "Mutton Kheema",
          price: 180,
          description: "Minced mutton cooked with onions and spices",
          image:
            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=300&fit=crop",
          category: "Starters",
          isVeg: false,
          rating: 4.4,
          inStock: true,
        },
        {
          id: "item7",
          name: "Veg Manchurian",
          price: 120,
          description: "Crispy vegetable balls in Indo-Chinese gravy",
          image:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=300&fit=crop",
          category: "Starters",
          isVeg: true,
          rating: 4.0,
          inStock: true,
        },
        {
          id: "item8",
          name: "Chicken Tikka",
          price: 160,
          description: "Tender chicken pieces marinated in spices and grilled",
          image:
            "https://images.unsplash.com/photo-1594312636347-39b886e9eac9?w=300&h=300&fit=crop",
          category: "Starters",
          isVeg: false,
          rating: 4.5,
          inStock: true,
        },
      ],
      123456: [
        // Fast Food items for Burger King
        {
          id: "item9",
          name: "Whopper Burger",
          price: 150,
          description:
            "Flame-grilled beef patty with lettuce, tomato, onion, pickles, and mayo",
          image:
            "https://images.unsplash.com/photo-1568901346375-23c94588c66b?w=300&h=300&fit=crop",
          category: "Burgers",
          isVeg: false,
          rating: 4.3,
          inStock: true,
        },
        {
          id: "item10",
          name: "Veg Whopper",
          price: 120,
          description:
            "Plant-based patty with fresh vegetables and special sauce",
          image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop",
          category: "Burgers",
          isVeg: true,
          rating: 4.1,
          inStock: true,
        },
        {
          id: "item11",
          name: "Chicken Fries",
          price: 80,
          description: "Crispy french fries with chicken seasoning",
          image:
            "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&h=300&fit=crop",
          category: "Sides",
          isVeg: false,
          rating: 4.0,
          inStock: true,
        },
        {
          id: "item12",
          name: "Onion Rings",
          price: 70,
          description: "Crispy battered onion rings",
          image:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=300&fit=crop",
          category: "Sides",
          isVeg: true,
          rating: 3.9,
          inStock: true,
        },
        {
          id: "item13",
          name: "Coke",
          price: 40,
          description: "Refreshing Coca-Cola",
          image:
            "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop",
          category: "Beverages",
          isVeg: true,
          rating: 4.0,
          inStock: true,
        },
        {
          id: "item14",
          name: "Vanilla Shake",
          price: 90,
          description: "Creamy vanilla milkshake",
          image:
            "https://images.unsplash.com/photo-1494314671902-3457dd6639b9?w=300&h=300&fit=crop",
          category: "Beverages",
          isVeg: true,
          rating: 4.2,
          inStock: true,
        },
      ],
      789012: [
        // Pizza items for Domino's
        {
          id: "item15",
          name: "Margherita Pizza",
          price: 200,
          description: "Fresh mozzarella, tomato sauce, and basil",
          image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop",
          category: "Pizza",
          isVeg: true,
          rating: 4.2,
          inStock: true,
        },
        {
          id: "item16",
          name: "Pepperoni Pizza",
          price: 250,
          description: "Classic pepperoni with mozzarella cheese",
          image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop",
          category: "Pizza",
          isVeg: false,
          rating: 4.4,
          inStock: true,
        },
        {
          id: "item17",
          name: "Farmhouse Pizza",
          price: 280,
          description: "Loaded with fresh vegetables and herbs",
          image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop",
          category: "Pizza",
          isVeg: true,
          rating: 4.3,
          inStock: true,
        },
        {
          id: "item18",
          name: "Garlic Bread",
          price: 80,
          description: "Toasted bread with garlic butter and herbs",
          image:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=300&fit=crop",
          category: "Sides",
          isVeg: true,
          rating: 4.1,
          inStock: true,
        },
        {
          id: "item19",
          name: "Chocolate Lava Cake",
          price: 120,
          description: "Warm chocolate cake with molten center",
          image:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
          category: "Desserts",
          isVeg: true,
          rating: 4.5,
          inStock: true,
        },
      ],
    };

    // Get menu items for the requested restaurant, or use default menu
    let menuItems = sampleMenuData[restaurantId] || [
      {
        id: "default1",
        name: "Signature Dish",
        price: 150,
        description: "Restaurant's special dish",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop",
        category: "Special",
        isVeg: true,
        rating: 4.2,
        inStock: true,
      },
      {
        id: "default2",
        name: "Chef's Special",
        price: 200,
        description: "Prepared by our expert chef",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop",
        category: "Special",
        isVeg: false,
        rating: 4.4,
        inStock: true,
      },
      {
        id: "default3",
        name: "House Special",
        price: 180,
        description: "Unique to our restaurant",
        image:
          "https://twoplaidaprons.com/wp-content/uploads/2023/08/house-special-fried-rice-on-a-plate-thumbnail.jpg",
        category: "Special",
        isVeg: true,
        rating: 4.1,
        inStock: true,
      },
    ];

    console.log(
      `Returning ${menuItems.length} menu items for restaurant ${restaurantId}`,
    );

    res.json({
      success: true,
      data: menuItems,
      restaurantId: restaurantId,
      total: menuItems.length,
      note: "Using realistic sample menu data - structure ready for Swiggy API integration",
    });
  } catch (error) {
    console.error("Error fetching menu:", error.message);

    // Return detailed error information
    res.status(500).json({
      success: false,
      error: "Failed to fetch menu",
      message: error.message,
      details: error.response?.data || "No additional details available",
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Snappy Eats Server running on port ${PORT}`);
  console.log(`📊 Restaurants API: http://localhost:${PORT}/api/restaurants`);
  console.log(
    `🍽️ Menu API: http://localhost:${PORT}/api/menu?restaurantId=YOUR_RESTAURANT_ID`,
  );
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});
