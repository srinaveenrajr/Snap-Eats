import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, ShoppingCart, Receipt, User } from "lucide-react";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    name: "Orders",
    href: "/tracking",
    icon: Receipt,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

const BottomNav = () => {
  const cartItems = useSelector((state) => state.cart.items);
  // Calculate cart count - cart.items is an object, not an array
  const cartCount = Object.values(cartItems).reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around   items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const showBadge = item.name === "Cart" && cartCount > 0;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => `
                  relative flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "text-orange-600"
                      : "text-white hover:text-gray-600"
                  }
                `}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {showBadge && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
