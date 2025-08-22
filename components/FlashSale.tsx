"use client";

import React, { useState, useEffect } from "react";
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
  originalPrice: string;
  discount: number;
  category: string;
  images: string[];
  video?: string;
  comments: Comment[];
}

const FlashSale = () => {
  const router = useRouter();

  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra",
      rating: 4.7,
      details: "200MP Camera, Snapdragon 8 Gen 3, 12GB RAM, 256GB Storage",
      price: "145,000",
      originalPrice: "155,000",
      discount: 15,
      category: "Smartphone",
      images: [
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1610945273613-914b7a5d487a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1610945273614-4d8c88814ee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ],
      video: "https://www.youtube.com/embed/6WQx3Y5+QqY",
      comments: [
        { user: "Rahim", comment: "Excellent camera quality.", rating: 5 },
        { user: "Karim", comment: "Battery life could be better.", rating: 4 },
      ],
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max",
      rating: 4.8,
      details: "A17 Pro chip, Titanium design, 48MP Main camera, 256GB",
      price: "150,000",
      originalPrice: "165,000",
      discount: 12,
      category: "Smartphone",
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ],
      comments: [
        {
          user: "Sadia",
          comment: "Super fast and smooth performance.",
          rating: 5,
        },
        {
          user: "Rafiq",
          comment: "Beautiful design and premium feel.",
          rating: 5,
        },
      ],
    },
    {
      id: 3,
      name: "Sony WH-1000XM5",
      rating: 4.9,
      details: "Industry-leading noise canceling wireless headphones",
      price: "29,999",
      originalPrice: "35,000",
      discount: 20,
      category: "Audio",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ],
      comments: [
        {
          user: "Tareq",
          comment: "Noise cancellation is exceptional!",
          rating: 5,
        },
        { user: "Nadia", comment: "Excellent battery life.", rating: 5 },
      ],
    },
    {
      id: 4,
      name: "MacBook Pro 16-inch",
      rating: 4.8,
      details: "M3 Pro chip, 16GB RAM, 1TB SSD, Liquid Retina XDR Display",
      price: "235,000",
      originalPrice: "250,000",
      discount: 25,
      category: "Laptop",
      images: [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ],
      comments: [
        {
          user: "Faisal",
          comment: "Perfect for professional work.",
          rating: 5,
        },
        {
          user: "Tahmina",
          comment: "Display quality is outstanding.",
          rating: 5,
        },
      ],
    },
    {
      id: 5,
      name: "Samsung 55-inch QLED TV",
      rating: 4.6,
      details: "4K UHD, Quantum HDR, Smart TV with Alexa Built-in",
      price: "85,000",
      originalPrice: "100,000",
      discount: 25,
      category: "Television",
      images: [
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ],
      comments: [
        { user: "Rifat", comment: "Picture quality is amazing.", rating: 5 },
        { user: "Nusrat", comment: "Easy to set up and use.", rating: 4 },
      ],
    },
    {
      id: 6,
      name: "Canon EOS R5",
      rating: 4.9,
      details: "45MP Full-Frame Mirrorless Camera, 8K Video Recording",
      price: "320,000",
      originalPrice: "380,000",
      discount: 25,
      category: "Camera",
      images: [
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ],
      comments: [
        { user: "Shahriar", comment: "Professional grade camera.", rating: 5 },
        {
          user: "Meher",
          comment: "Worth every penny for photographers.",
          rating: 5,
        },
      ],
    },
    {
      id: 7,
      name: "PlayStation 5",
      rating: 4.7,
      details: "Ultra-high speed SSD, Integrated I/O, 4K Graphics",
      price: "65,000",
      originalPrice: "75,000",
      discount: 15,
      category: "Gaming",
      images: [
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ],
      comments: [
        { user: "Rakib", comment: "Next level gaming experience.", rating: 5 },
        {
          user: "Sabbir",
          comment: "Fast loading times and great graphics.",
          rating: 4,
        },
      ],
    },
    {
      id: 8,
      name: "Dyson V11 Absolute",
      rating: 4.5,
      details: "Cordless vacuum cleaner, 60 mins run time, LCD screen",
      price: "55,000",
      originalPrice: "65,000",
      discount: 18,
      category: "Home Appliance",
      images: [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ],
      comments: [
        {
          user: "Farhana",
          comment: "Powerful suction and convenient.",
          rating: 5,
        },
        { user: "Anika", comment: "Makes cleaning so much easier.", rating: 4 },
      ],
    },
  ]);

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
            {i < fullStars ? (
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            ) : hasHalfStar && i === fullStars ? (
              <path d="M10 1a1 1 0 011 1v1a1 1 0 11-2 0V2a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            ) : (
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            )}
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
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
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
              color: "#007873",
            }}
          >
            Flash Sale
          </motion.h2>
          <p
            className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Limited time offers on our most popular products. Hurry up before
            theyre gone!
          </p>

         
        </div>

        {/* Products Grid */}
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
              {/* Product Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.discount}% OFF
                </div>
                {product.discount >= 25 && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    SPECIAL DEAL
                  </div>
                )}
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
                  <span className="text-xl font-bold text-emerald-700">
                    ৳{product.price}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ৳{product.originalPrice}
                  </span>
                </div>

                {/* Comments Preview */}
                <div className="border-t border-gray-100 pt-3 mt-auto">
                  <h4 className="text-xs font-semibold text-gray-700 mb-1">
                    Customer Reviews:
                  </h4>
                  {product.comments.slice(0, 1).map((comment, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-gray-600 mb-1 line-clamp-1"
                    >
                      <span className="font-medium">{comment.user}:</span>{" "}
                      {comment.comment}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex mt-5 space-x-2">
                  <button
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
                    style={{ backgroundColor: "#007873" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart functionality
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="p-2.5 border border-emerald-700 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to wishlist functionality
                    }}
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

export default FlashSale;
