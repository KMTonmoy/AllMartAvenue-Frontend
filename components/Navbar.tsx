'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, User, Globe, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Beauty',
    'Sports',
    'Books',
    'Toys',
  ];

  return (
    <nav className="bg-white shadow-md">
      {/* Top Nav */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">AllMartAvenue</div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Globe className="h-5 w-5 text-gray-600" />
              <select className="bg-transparent text-sm focus:outline-none">
                <option>EN</option>
                <option>ES</option>
                <option>FR</option>
              </select>
            </div>
            
            <button className="relative p-2">
              <Heart className="h-5 w-5 text-gray-600 hover:text-[#007873] transition-colors" />
            </button>
            
            <button className="relative p-2">
              <User className="h-5 w-5 text-gray-600 hover:text-[#007873] transition-colors" />
            </button>
            
            <button className="relative p-2">
              <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-[#007873] transition-colors" />
              <span className="absolute -top-1 -right-1 bg-[#007873] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Categories Dropdown */}
          <div className="hidden md:block relative">
            <button 
              className="flex items-center space-x-1 text-gray-700 hover:text-[#007873] transition-colors font-medium"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span>Categories</span>
              <motion.span
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.span>
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                >
                  {categories.map((category) => (
                    <a
                      key={category}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#007873]"
                    >
                      {category}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#007873] focus:border-[#007873]"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1">
                <Search className="h-5 w-5 text-gray-500 hover:text-[#007873] transition-colors" />
              </button>
            </div>
          </div>

          {/* Placeholder for alignment */}
          <div className="md:hidden w-6" />
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 bg-white rounded-md shadow-md overflow-hidden"
            >
              <div className="px-4 py-2 border-b border-gray-200 font-medium text-gray-700">
                Categories
              </div>
              {categories.map((category) => (
                <a
                  key={category}
                  href="#"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#007873] transition-colors"
                >
                  {category}
                </a>
              ))}
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center space-x-4 justify-center">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-[#007873]">
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-[#007873]">
                    <Heart className="h-4 w-4" />
                    <span>Wishlist</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;