"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Summer Collection 2023",
      subtitle: "Discover the latest trends in fashion",
      description: "Get up to 50% off on all summer items. Limited time offer!",
      buttonText: "Shop Now",
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80",
    },
    {
      id: 2,
      title: "Electronics Sale",
      subtitle: "Cutting-edge technology at your fingertips",
      description: "Latest gadgets and electronics with exclusive discounts",
      buttonText: "Explore Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 3,
      title: "Premium Jewelry",
      subtitle: "Elegance redefined",
      description: "Exquisite pieces crafted with precision and care",
      buttonText: "View Collection",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 4,
      title: "Home Essentials",
      subtitle: "Transform your living space",
      description: "Everything you need to make your house a home",
      buttonText: "Discover More",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2058&q=80",
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 h-full w-full transition-opacity duration-700",
              currentSlide === index ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="relative z-10 flex h-full items-center">
              <div className="container mx-auto px-8 text-white">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl mb-4 text-gray-200">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg mb-8 text-gray-100 max-w-lg">
                    {slide.description}
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:opacity-90 text-white px-8 py-6 text-lg font-medium rounded-lg shadow-lg"
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-3 w-3 rounded-full transition-all duration-300",
              currentSlide === index ? "bg-gradient-to-r from-[#1488CC] to-[#2B32B2]" : "bg-white/50"
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-5 right-6 z-20 flex items-center space-x-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:opacity-90 text-white border-none backdrop-blur-sm"
            onClick={goToPrevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:opacity-90 text-white border-none backdrop-blur-sm"
            onClick={toggleAutoPlay}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:opacity-90 text-white border-none backdrop-blur-sm"
            onClick={goToNextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
    </section>
  );
};

export default Hero;
