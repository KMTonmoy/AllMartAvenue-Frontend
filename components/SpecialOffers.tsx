"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  rating: number;
  details: string;
  price: string;
  originalPrice: string;
  discount: number;
  category: string;
  images: string[];
  video?: string;
  startTime: string;
  endTime: string;
}

const SpecialOffers = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [timeLeftMap, setTimeLeftMap] = useState<{ [key: number]: string }>({});

  // Fetch JSON
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/special.json");
      const data: Product[] = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const updatedMap: { [key: number]: string } = {};

      products.forEach((product) => {
        const start = new Date(product.startTime).getTime();
        const end = new Date(product.endTime).getTime();

        if (now < start) {
          updatedMap[product.id] = "Not started";
        } else if (now > end) {
          updatedMap[product.id] = "Expired";
        } else {
          const distance = end - now;
          const hours = Math.floor(distance / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          updatedMap[product.id] = `${hours
            .toString()
            .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
        }
      });

      setTimeLeftMap(updatedMap);
    }, 1000);

    return () => clearInterval(interval);
  }, [products]);

  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? "text-yellow-400"
                : hasHalfStar && i === fullStars
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#dc2626",
            }}
          >
            Special Offers
          </motion.h2>
          <p
            className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Limited-time deals on premium products. Dont miss out on these exclusive offers!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col h-full relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => handleProductClick(product.id)}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.discount}% OFF
                </div>

                {/* Time Left Badge */}
                <div className="absolute bottom-4 left-4 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-md">
                  ⏱️ {timeLeftMap[product.id] || "Loading..."}
                </div>

                {/* Special Offer Badge */}
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                  SPECIAL OFFER
                </div>
              </div>

              {/* Product Details */}
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
                  <span className="text-xl font-bold text-red-600">
                    ৳{product.price}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ৳{product.originalPrice}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex mt-auto space-x-2">
                  <button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Buy Now
                  </button>
                  <button
                    className="p-2.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ❤️
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

export default SpecialOffers;
