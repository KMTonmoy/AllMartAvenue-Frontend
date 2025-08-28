"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  details: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  category: string;
  productTag: string;
  images: string[];
  video?: string;
}

const Electronics = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch("/product.json"),
          fetch("/special.json"),
        ]);

        const data1: Product[] = await res1.json();
        const data2: Product[] = await res2.json();

        // Combine both arrays
        const combined = [...data1, ...data2];

        // Filter electronics only
        const electronics = combined.filter(
          (p) => p.category.toLowerCase() === "electronics"
        );

        setProducts(electronics);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (id: number) => {
    router.push(`/product/${id}`);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.discount}% OFF
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3
                  className="text-lg font-bold text-gray-800 truncate mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  title={product.name}
                >
                  {product.name}
                </h3>

                <p
                  className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {product.details}
                </p>

                <div className="flex items-center mb-4">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1488CC] to-[#2B32B2]">
                    ৳{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ৳{product.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex mt-5 space-x-2">
                  <button
                    className="flex-1 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
                    style={{
                      background: "linear-gradient(to right, #1488CC, #2B32B2)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="p-2.5 border border-[#1488CC] text-[#1488CC] rounded-lg hover:bg-[#1488CC]/10 transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Electronics;
