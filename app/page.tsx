import BrandShowcase from "@/components/BrandShowcase";
import CategoryGrid from "@/components/CategoryGrid";
import FlashSale from "@/components/FlashSale";
import Hero from "@/components/Hero";
import LocalPayment from "@/components/LocalPayment";
import SpecialOffers from "@/components/Products";
import React from "react";

const page = () => {
  return (
    <div>

      <Hero />
      <CategoryGrid />
      <FlashSale />
      <SpecialOffers />
      <BrandShowcase />
      <LocalPayment />
    </div>
  );
};

export default page;
