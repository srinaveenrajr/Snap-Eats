# 🍽️ Snappy Eats - Modern Food Ordering App

A modern, responsive food ordering application built with React, Vite, Redux Toolkit, and a Node.js proxy server for real Swiggy API integration.

## ✨ Features

- 🚀 **Live Swiggy API Data** - Real restaurant data from Swiggy
- 🔍 **Frontend Search** - Instant search without API calls
- 🏗️ **Redux Toolkit** - Modern state management with createAsyncThunk
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile-First** - Optimized for all devices
- ⚡ **Performance** - Lazy loading, skeleton screens, optimized rendering
- 🔄 **CORS Solution** - Node.js proxy server for API calls

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite 7** - Fast build tool and dev server
- **Redux Toolkit** - State management with createAsyncThunk
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for Swiggy API

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone and Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

2. **Start the Application**

   **Option 1: Using Startup Scripts**
   ```bash
   # Windows
   start.bat
   
   # Linux/Mac
   chmod +x start.sh
   ./start.sh
   ```

   **Option 2: Manual Start**
   ```bash
   # Terminal 1 - Start Backend
   cd server
   npm start
   
   # Terminal 2 - Start Frontend
   npm run dev
   ```

3. **Open the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/restaurants
   - Health Check: http://localhost:5000/health

## 📁 Project Structure

```
snappy-eats/
├── server/                 # Backend proxy server
│   ├── server.js          # Express server with Swiggy API proxy
│   └── package.json       # Backend dependencies
├── src/
│   ├── components/        # React components
│   │   ├── Header.jsx
│   │   ├── BottomNav.jsx
│   │   ├── RestaurantCard.jsx
│   │   └── SkeletonCard.jsx
│   ├── features/          # Redux slices
│   │   └── restaurantSlice.js
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx
│   │   └── RestaurantPage.jsx
│   └── App.jsx            # Main app component
├── start.bat              # Windows startup script
├── start.sh               # Linux/Mac startup script
└── README.md              # This file
```

## 🔧 API Integration

### Swiggy API Proxy
The backend server acts as a proxy to handle CORS issues and transform Swiggy API data:

```javascript
// API Endpoint
GET http://localhost:5000/api/restaurants

// Response Format
{
  "success": true,
  "data": [
    {
      "id": "restaurant-id",
      "name": "Restaurant Name",
      "image": "image-url",
      "cuisine": "Cuisine Type",
      "rating": 4.5,
      "deliveryTime": "30-40",
      "priceForTwo": "500"
    }
  ],
  "total": 50
}
```

### Frontend Search
Search is implemented on the frontend for instant results:

```javascript
// Search filters restaurants by name, cuisine, or category
const filteredRestaurants = restaurants.filter(r => 
  r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
);
```

## 🎨 UI Features

- **Skeleton Loading** - Beautiful shimmer effects while loading
- **Responsive Grid** - Adapts from 1 to 4 columns based on screen size
- **Modern Cards** - Hover effects, shadows, and transitions
- **Error Handling** - User-friendly error messages with retry options
- **Category Filtering** - Dynamic categories from restaurant data
- **Top Rated Section** - Highlight restaurants with 4.5+ rating

## 🔄 Redux State Management

```javascript
// Restaurant Slice Structure
{
  restaurants: [],     // Array of restaurants
  loading: false,      // Loading state
  error: null,         // Error message
  searchTerm: "",      // Search query
  filter: "all",       // Filter type (all/top)
  selectedId: null     // Selected restaurant ID
}
```

## 📱 Mobile Optimization

- **Touch-Friendly** - Large tap targets and gestures
- **Responsive Images** - Optimized for different screen sizes
- **Bottom Navigation** - Easy thumb access on mobile
- **Smooth Scrolling** - Native mobile scrolling experience

## 🚀 Performance Optimizations

- **Code Splitting** - Lazy loading with React.lazy
- **Memoization** - useMemo for expensive computations
- **Debounced Search** - Prevents excessive re-renders
- **Image Optimization** - WebP support and lazy loading
- **Minimal Re-renders** - Optimized React components

## 🔧 Development

### Adding New Features

1. **New API Endpoints**
   ```javascript
   // Add to server.js
   app.get('/api/new-endpoint', async (req, res) => {
     // API logic here
   });
   ```

2. **New Redux Actions**
   ```javascript
   // Add to restaurantSlice.js
   export const newAction = createAsyncThunk(
     'slice/newAction',
     async (params) => {
       // Action logic
     }
   );
   ```

3. **New Components**
   ```jsx
   // Create in src/components/
   // Import and use in pages
   ```

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.development
VITE_API_URL=http://localhost:5000

# .env.production
VITE_API_URL=https://your-api-domain.com
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend Not Starting**
   - Check if port 5000 is available
   - Verify Node.js installation
   - Run `npm install` in server directory

2. **Frontend Not Loading Data**
   - Ensure backend server is running
   - Check browser console for CORS errors
   - Verify API endpoint is accessible

3. **Search Not Working**
   - Check Redux state in browser dev tools
   - Verify searchTerm is being updated
   - Check filter logic in HomePage.jsx

### Debug Mode

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('debug', 'snappy-eats:*');
```

## 📄 License

This project is for educational purposes. Swiggy API data is used for demonstration only.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ for learning modern web development**
