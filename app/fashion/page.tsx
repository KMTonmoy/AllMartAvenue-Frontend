"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard/ProductCard";

const Fashion = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://all-mart-avenue-backend.vercel.app/products");
        const data: Product[] = await res.json();

        // ✅ Filter only fashion products
        const fashionProducts = data.filter(
          (p) => p.category.toLowerCase() === "fashion"
        );

        setProducts(fashionProducts);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product.name);
    // You can integrate your actual cart logic here (Redux, Zustand, etc.)
  };

  if (products.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No fashion products found.
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
            title="Fashion"
          >
            Fashion
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg line-clamp-2">
            Explore our collection of fashion products. Find trendy dresses,
            stylish handbags, elegant sarees, and accessories to complete your
            wardrobe.
          </p>
        </div>

        {/* ✅ Product Grid */}
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

export default Fashion;
