"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard/ProductCard";

const FlashSale = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [showAll, setShowAll] = useState(false);

  const shuffleArray = (array: Product[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Product[]>("http://localhost:8000/products");
        const flashProducts = response.data.filter((p: Product) =>
          p.productTag?.toLowerCase().includes("flash")
        );
        const shuffledProducts = shuffleArray(flashProducts);
        setProducts(shuffledProducts);
        setDisplayedProducts(shuffledProducts.slice(0, visibleCount));
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load flash sale products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [visibleCount]);

  const handleShowMore = () => {
    setShowAll(true);
    setVisibleCount(products.length);
  };

  const handleShowLess = () => {
    setShowAll(false);
    setVisibleCount(8);
  };

  useEffect(() => {
    setDisplayedProducts(products.slice(0, visibleCount));
  }, [visibleCount, products]);

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product.name);
    // Add your cart logic here
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-center py-10 text-gray-600">Loading flash sale products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-center py-10 text-red-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-center py-10 text-gray-600">No flash sale products available.</p>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Flash Sale
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Limited time offers on our most popular products. Hurry before they&apos;re gone!
        </motion.p>

        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                index={index}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </AnimatePresence>

        {products.length > 8 && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {!showAll ? (
              <button
                onClick={handleShowMore}
                className="px-8 py-3 bg-gradient-to-r from-[#1488CC] to-[#2B32B2] text-white rounded-lg font-medium hover:from-[#2B32B2] hover:to-[#1488CC] transition-all duration-300 transform hover:scale-105"
              >
                Show More ({products.length - visibleCount} more)
              </button>
            ) : (
              <button
                onClick={handleShowLess}
                className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg font-medium hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105"
              >
                Show Less
              </button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FlashSale;