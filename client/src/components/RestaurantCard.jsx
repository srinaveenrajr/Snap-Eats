import { Link } from 'react-router-dom'
import { Star, Clock, MapPin, IndianRupee } from 'lucide-react'

const RestaurantCard = ({ restaurant, onAddToCart }) => {
  const {
    id,
    name,
    image,
    category,
    rating,
    deliveryTime,
    priceForTwo,
    cuisine,
    promoted
  } = restaurant

  return (
    <div className="group cursor-pointer">
      <Link to={`/restaurant/${id}`}>
        <div className="relative overflow-hidden rounded-2xl mb-3">
          <img
            src={image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop'}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {promoted && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              PROMOTED
            </div>
          )}
          {deliveryTime && (
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-xs font-medium">
              {deliveryTime} min
            </div>
          )}
        </div>
      </Link>
      
      <div className="px-1">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-800 text-lg group-hover:text-orange-600 transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-md flex-shrink-0">
            <Star className="w-4 h-4 text-green-600 fill-current" />
            <span className="text-sm font-medium text-green-700">{rating || '4.2'}</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-2 line-clamp-1">
          {cuisine || category}
        </p>
        
        <div className="flex items-center justify-between text-gray-400 text-xs">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{deliveryTime || '30-40'} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>2.5 km</span>
          </div>
          <div className="flex items-center space-x-1">
            <IndianRupee className="w-3 h-3" />
            <span>{priceForTwo/100} for two</span>
          </div>
        </div>
        
        {onAddToCart && (
          <button
            onClick={onAddToCart}
            className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
          >
            Add Popular Item
          </button>
        )}
      </div>
    </div>
  )
}

export default RestaurantCard;
