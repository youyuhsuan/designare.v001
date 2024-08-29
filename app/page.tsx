import React, { Suspense } from "react";
import Nav from "@/src/Components/MainNavbar";
import Loading from "./loading";
const LazyHeroSection = React.lazy(
  () => import("@/src/Components/HeroSection")
);

async function getData() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 调整延迟时间
  return { isLoaded: true };
}

async function Content() {
  await getData();

  return (
    <>
      <Nav />
      <main>
        <LazyHeroSection />
      </main>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <Content />
    </Suspense>
  );
}
