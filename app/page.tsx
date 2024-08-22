import type { Metadata } from "next";
import Nav from "@/src/Components/MainNavbar";
import WebsiteTemplateShowcase from "@/src/Components/Card";
import KeyFeaturesSection from "@/src/Components/KeyFeaturesSection";
import LoadingPage from "@/src/Components/LoadingPage";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("@/src/Components/HeroSection"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Designare",
  description: "Generated by youyuhsuan",
};

export default function Home() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Nav />
      <main>
        <HeroSection />
        <WebsiteTemplateShowcase />
        {/* <KeyFeaturesSection /> */}
      </main>
    </Suspense>
  );
}
