"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard/ProductCard";

const Electronics = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/products");
        const data: Product[] = await res.json();

        // Filter only electronics
        const electronics = data.filter(
          (p) => p.category.toLowerCase() === "electronics"
        );

        setProducts(electronics);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product.name);
    // You can integrate your cart logic here
  };

  if (products.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No electronics found.
      </p>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl font-bold mb-4 truncate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            title="Electronics"
          >
            Electronics
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg line-clamp-2">
            Explore our range of electronic products. Find the latest gadgets,
            smartphones, laptops, and accessories to upgrade your tech.
          </p>
        </div>

        {/* Product Grid */}
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
      </div>
    </section>
  );
};

export default Electronics;
