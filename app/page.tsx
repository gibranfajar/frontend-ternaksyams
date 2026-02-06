"use client";

import { Suspense, useEffect, useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import Hero from "@/components/Hero";
import HookTop from "@/components/HookTop";
import WhyUs from "@/components/WhyUs";
import HookBottom from "@/components/HookBottom";
import ProductSlider from "@/components/ProductSlider";
import Testimonial from "@/components/Testimonial";
import Article from "@/components/Article";
import Slider from "@/components/Slider";
import MobileBuyButton from "@/components/MobileBuyButton";

import { getGuestToken } from "@/utils/guestToken";
import JoinAF from "@/components/JoinAF";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const guestToken = getGuestToken();
    setToken(guestToken);
  }, []);

  return (
    <>
      <section>
        <Suspense fallback={<div>Loading...</div>}>
          <VideoPlayer />
        </Suspense>
      </section>
      <section>
        <Slider />
      </section>
      <section>
        <Hero />
      </section>
      <section>
        <HookTop />
      </section>
      <section>
        <WhyUs />
      </section>
      <section>
        <HookBottom />
      </section>
      <section>
        <ProductSlider />
      </section>
      <section>
        <Testimonial />
      </section>
      <section className="absolute w-full mx-auto ">
        <JoinAF />
      </section>
      <section>
        <Article />
      </section>
      <MobileBuyButton productUrl="/shop" />
    </>
  );
}
