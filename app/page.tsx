import BrandShowcase from "@/components/BrandShowcase";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import FlashSale from "@/components/FlashSale";
import Hero from "@/components/Hero";
import LocalPayment from "@/components/LocalPayment";
import ServiceFeatures from "@/components/ServiceFeatures";
import SpecialOffers from "@/components/SpecialOffers";
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
      <ServiceFeatures />
      <LocalPayment />
    </div>
  );
};

export default page;
