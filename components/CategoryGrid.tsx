"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CategoryGrid = () => {
  const [categories] = useState([
    {
      id: 1,
      name: "Electronics",
      description: "Cutting-edge gadgets and devices",
      image:
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80",
      featured: true,
    },
    {
      id: 2,
      name: "Fashion",
      description: "Trendy apparel and accessories",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 3,
      name: "Home & Kitchen",
      description: "Upgrade your living space",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2058&q=80",
    },
    {
      id: 4,
      name: "Beauty",
      description: "Premium beauty products",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80",
    },
    {
      id: 5,
      name: "Sports",
      description: "Equipment for active lifestyle",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 6,
      name: "Toys",
      description: "Fun for all ages",
      image:
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
  ]);

  const [currentLayout, setCurrentLayout] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLayout((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const layoutConfigs = [
    {
      gridClass: "grid-cols-1 md:grid-cols-3",
      positions: [
        { row: 1, col: 1, rowSpan: 2, colSpan: 2 },
        { row: 1, col: 3, rowSpan: 1, colSpan: 1 },
        { row: 2, col: 3, rowSpan: 1, colSpan: 1 },
        { row: 3, col: 1, rowSpan: 1, colSpan: 1 },
        { row: 3, col: 2, rowSpan: 1, colSpan: 1 },
        { row: 3, col: 3, rowSpan: 1, colSpan: 1 },
      ]
    },
    {
      gridClass: "grid-cols-1 md:grid-cols-3",
      positions: [
        { row: 1, col: 1, rowSpan: 1, colSpan: 1 },
        { row: 1, col: 2, rowSpan: 1, colSpan: 1 },
        { row: 1, col: 3, rowSpan: 2, colSpan: 1 },
        { row: 2, col: 1, rowSpan: 1, colSpan: 2 },
        { row: 3, col: 1, rowSpan: 1, colSpan: 1 },
        { row: 3, col: 2, rowSpan: 1, colSpan: 2 },
      ]
    },
    {
      gridClass: "grid-cols-1 md:grid-cols-2",
      positions: [
        { row: 1, col: 1, rowSpan: 1, colSpan: 1 },
        { row: 1, col: 2, rowSpan: 1, colSpan: 1 },
        { row: 2, col: 1, rowSpan: 1, colSpan: 1 },
        { row: 2, col: 2, rowSpan: 1, colSpan: 1 },
        { row: 3, col: 1, rowSpan: 1, colSpan: 2 },
        { row: 4, col: 1, rowSpan: 1, colSpan: 1 },
      ]
    }
  ];

  const { gridClass, positions } = layoutConfigs[currentLayout];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white text-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ fontFamily: "'Playfair Display', serif", color: "#007873" }}
        >
          Shop by Category
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          Discover our wide range of products with dynamically changing layouts
        </motion.p>

        <div className="relative h-[1000px] md:h-[700px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLayout}
              className={`grid ${gridClass} gap-6 absolute inset-0`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {categories.map((category, index) => {
                const pos = positions[index];
                return (
                  <motion.div
                    key={category.id}
                    className={`relative group overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 ${category.featured ? "bg-gradient-to-br from-emerald-50/30 to-white" : ""}`}
                    initial={{ 
                      opacity: 0, 
                      scale: 0.8,
                      gridRow: `${pos.row} / span ${pos.rowSpan}`,
                      gridColumn: `${pos.col} / span ${pos.colSpan}`
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: { 
                        delay: index * 0.1,
                        duration: 0.7,
                        ease: "easeOut"
                      }
                    }}
                    exit={{ 
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.5 }
                    }}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      gridRow: `${pos.row} / span ${pos.rowSpan}`,
                      gridColumn: `${pos.col} / span ${pos.colSpan}`
                    }}
                  >
                    <div className="relative h-full overflow-hidden shadow-inner shadow-black/10">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${category.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-white opacity-80"></div>
                      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-white opacity-80"></div>
                      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-white opacity-80"></div>
                      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-white opacity-80"></div>

                      <div className="relative h-full flex flex-col justify-end p-6">
                        <h3 className="text-xl font-bold mb-2 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{category.name}</h3>
                        <p className="text-gray-200 text-sm mb-4" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {category.description}
                        </p>
                        <button className="self-start text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center group/btn hover:bg-emerald-800"
                          style={{ backgroundColor: "#007873" }}>
                          Shop Now
                          <svg
                            className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {category.featured && (
                      <div className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full z-10"
                        style={{ backgroundColor: "#007873" }}>
                        Featured
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

      
      </div>
    </section>
  );
};

export default CategoryGrid;