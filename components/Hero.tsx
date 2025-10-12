"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  image: string;
  isActive: boolean;
}

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [slides, setSlides] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch banners from backend API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("https://all-mart-avenue-backend.vercel.app/banners");
        // Filter only active banners and map to the required format
        const activeBanners = response.data
          .filter((banner: Banner) => banner.isActive)
          .map((banner: Banner) => ({
            id: banner._id,
            title: banner.title,
            subtitle: banner.subtitle,
            description: banner.description,
            buttonText: banner.buttonText,
            image: banner.image,
          }));
        setSlides(activeBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
        // Fallback to empty array if fetch fails
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;

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

  // Show loading state or empty state
  if (loading) {
    return (
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
        <div className="text-white text-lg">Loading banners...</div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
        <div className="text-white text-lg">No banners available</div>
      </section>
    );
  }

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide._id}
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