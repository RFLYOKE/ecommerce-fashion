"use client";

import CTA from "./new/CTA";
import Testimonials from "./new/Testimonials";
import Campaign from "./new/campaign";
import SaleGrid from "./product-sale";
import CategoryGrid from "./category-grid";
import NewArrivalGrid from "./arrival-product-grid";
import AboutStore from "./about-store";
import RunningCarousel from "./running-carousel";

const HomePage = () => {
  return (
    <>
      <Campaign />
      <div className="w-full p-2">
        <RunningCarousel />
      </div>
      <div className="px-10">
        <AboutStore />
        <NewArrivalGrid />
        <CategoryGrid />
        <SaleGrid />
      </div>
      <CTA />
      <Testimonials />
    </>
  );
};

export default HomePage;
