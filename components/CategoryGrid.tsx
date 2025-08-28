"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  featured?: boolean;
}

interface Position {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentLayout] = useState(0);

  const fetchCategories = async () => {
    try {
      const res = await fetch("./category.json");
      const data: Category[] = await res.json();
      const shuffled = data.sort(() => Math.random() - 0.5);
      setCategories(shuffled);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const layoutConfigs: { gridClass: string; positions: Position[] }[] = [
    {
      gridClass: "grid-cols-1 md:grid-cols-3",
      positions: [
        { row: 1, col: 1, rowSpan: 2, colSpan: 2 },
        { row: 1, col: 3, rowSpan: 1, colSpan: 1 },
        { row: 2, col: 3, rowSpan: 1, colSpan: 1 },
        { row: 3, col: 1, rowSpan: 1, colSpan: 1 },
        { row: 3, col: 2, rowSpan: 1, colSpan: 1 },
        { row: 3, col: 3, rowSpan: 1, colSpan: 1 },
      ],
    },
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
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-black">
          {/* <span className="bg-gradient-to-r from-[#1488CC] to-[#2B32B2] bg-clip-text text-transparent"> */}
            Shop by Category
          </span>
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
                if (!pos) return null;

                return (
                  <motion.div
                    key={category.id}
                    className={`relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 ${
                      category.featured
                        ? "bg-gradient-to-br from-[#1488CC]/10 to-[#2B32B2]/10"
                        : ""
                    }`}
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                      gridRow: `${pos.row} / span ${pos.rowSpan}`,
                      gridColumn: `${pos.col} / span ${pos.colSpan}`,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: {
                        delay: index * 0.1,
                        duration: 0.7,
                        ease: "easeOut",
                      },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.5 },
                    }}
                    whileHover={{ scale: 1.03 }}
                    style={{
                      gridRow: `${pos.row} / span ${pos.rowSpan}`,
                      gridColumn: `${pos.col} / span ${pos.colSpan}`,
                    }}
                  >
                    <div className="relative h-full overflow-hidden shadow-inner shadow-black/10">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${category.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div className="absolute inset-0 bg-[#00000028]" />

                      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-white opacity-80"></div>
                      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-white opacity-80"></div>
                      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-white opacity-80"></div>
                      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-white opacity-80"></div>

                      <div className="relative h-full flex flex-col justify-end p-6">
                        <h3
                          className="text-xl font-bold mb-2 text-white"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {category.name}
                        </h3>
                        <p
                          className="text-white text-sm mb-4"
                          style={{ fontFamily: "'Lato', sans-serif" }}
                        >
                          {category.description}
                        </p>
                        <a href="/products">
                          <button className="self-start text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center group/btn bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:opacity-90">
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
                        </a>
                      </div>
                    </div>

                    {category.featured && (
                      <div className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full z-10 bg-gradient-to-r from-[#1488CC] to-[#2B32B2]">
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
