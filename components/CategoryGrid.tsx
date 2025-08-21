'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Category {
  id: number
  name: string
  description: string
  image: string
  featured?: boolean
}

const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Electronics",
      description: "Cutting-edge gadgets and devices",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80",
      featured: true
    },
    {
      id: 2,
      name: "Fashion",
      description: "Trendy apparel and accessories",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 3,
      name: "Home & Kitchen",
      description: "Upgrade your living space",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2058&q=80"
    },
    {
      id: 4,
      name: "Beauty",
      description: "Premium beauty products",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80"
    },
    {
      id: 5,
      name: "Sports",
      description: "Equipment for active lifestyle",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 6,
      name: "Toys",
      description: "Fun for all ages",
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    }
  ])

  const [currentLayout, setCurrentLayout] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLayout(prev => (prev + 1) % 3)
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  const layoutConfigs = [
    {
      gridClass: "grid-cols-1 md:grid-cols-3",
      featuredIndex: 0,
      featuredClass: "md:col-span-2 md:row-span-2"
    },
    {
      gridClass: "grid-cols-1 md:grid-cols-2",
      featuredIndex: 2,
      featuredClass: "md:col-span-2"
    },
    {
      gridClass: "grid-cols-1 md:grid-cols-3",
      featuredIndex: 4,
      featuredClass: "md:col-span-2 md:row-span-2 md:col-start-2"
    }
  ]

  const { gridClass, featuredIndex, featuredClass } = layoutConfigs[currentLayout]

  return (
    <section className="py-16 bg-white text-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Explore Categories
        </motion.h2>
        <motion.p 
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Discover our wide range of futuristic products and services
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentLayout}
            className={`grid ${gridClass} gap-6 auto-rows-fr`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.7 }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className={`relative group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-all duration-500 ${
                  index === featuredIndex ? featuredClass : ''
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <button className="self-start bg-[#007873] hover:bg-[#00615c] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center">
                    Explore
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#007873] opacity-70"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#007873] opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#007873] opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#007873] opacity-70"></div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
 
      </div>
    </section>
  )
}

export default CategoryGrid