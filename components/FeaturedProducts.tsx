"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Comment {
  user: string;
  comment: string;
  rating: number;
}

interface Product {
  id: number;
  name: string;
  rating: number;
  details: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  category: string;
  productTag: string;
  images: string[];
  video?: string;
  comments?: Comment[];
}

const FeaturedProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/product.json")
      .then((res) => res.json())
      .then((data) => {
        const featured = data.filter((p: Product) => p.productTag === "featured");
        setProducts(featured);
      })
      .catch(() => {});
  }, []);

  const handleProductClick = (id: number) => {
    router.push(`/product/${id}`);
  };

  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < fullStars || (hasHalfStar && i === fullStars) ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs text-gray-500">({rating})</span>
      </div>
    );
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: "'Playfair Display', serif", color: "#000" }}
          >
            Featured Products
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
            Handpicked selections just for you.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No featured products found.</p>
        ) : (
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
                  {product.discount && product.discount >= 25 && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      SPECIAL DEAL
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className="text-lg font-bold text-gray-800"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {product.name}
                    </h3>
                    <StarRating rating={product.rating} />
                  </div>

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
                      className="flex-1 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-300 bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:from-[#2B32B2] hover:to-[#1488CC]"
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
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
