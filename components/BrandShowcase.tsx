"use client";

import React, { useEffect, useState } from "react";

interface Brand {
  id: number;
  name: string;
  logo: string;
}

const BrandShowcase: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const res = await fetch("/brand.json");
      const data: Brand[] = await res.json();
      setBrands(data);
    };
    fetchBrands();
  }, []);

  return (
    <section className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Trusted by Industry Leaders
        </h2>

        <div className="relative overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {brands.concat(brands).map((brand) => (
              <div
                key={brand.id + Math.random()}
                className="inline-flex items-center justify-center mx-6"
              >
                <div className="bg-white p-5 rounded-xl shadow-md">
                  <div className="h-16 w-32 flex items-center justify-center">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-16 object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default BrandShowcase;
