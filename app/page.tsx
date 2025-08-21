import BrandShowcase from "@/components/BrandShowcase";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import FestivalSection from "@/components/FestivalSection";
import FlashSale from "@/components/FlashSale";
import Hero from "@/components/Hero";
import LocalPayment from "@/components/LocalPayment";
import RegionalOffers from "@/components/RegionalOffers";
import ServiceFeatures from "@/components/ServiceFeatures";
import SpecialOffers from "@/components/SpecialOffers";
import Testimonials from "@/components/Testimonials";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero />
      <CategoryGrid />
      <FlashSale />
      <FeaturedProducts />
      <SpecialOffers />
      <BrandShowcase />
      <FestivalSection />
      <Testimonials />
      <ServiceFeatures />
      <LocalPayment />
      <RegionalOffers />
    </div>
  );
};

export default page;
