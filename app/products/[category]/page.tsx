"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from '@/components/ProductCard/ProductCard';
import { Product } from '@/types/product';

const CategoryPage = () => {
  const params = useParams();
  const categoryName = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format category name for display (convert "threepiece" to "Three Piece")
  const formattedCategoryName = categoryName
    ? categoryName
      .split(/(?=[A-Z])|-/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
    : '';

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchQuery = categoryName.replace(/-/g, ' ');

      // Using axios instead of fetch for better error handling
      const response = await axios.get(`https://all-mart-avenue-backend.vercel.app/products/search?q=${encodeURIComponent(searchQuery)}`);

      const data: Product[] = response.data;
      setProducts(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching products');
      console.error('Error fetching category products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryName) {
      fetchCategoryProducts();
    }
  }, [categoryName]);

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product.name);
    // Add your cart logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {formattedCategoryName} products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error loading products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCategoryProducts}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">


        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              We couldn't find any products in the {formattedCategoryName.toLowerCase()} category.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {products.length} product{products.length !== 1 ? 's' : ''} in {formattedCategoryName}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;