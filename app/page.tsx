import Nav from "@/src/Components/Nav";
import Slogan from "@/src/Components/Slogan";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Slogan />
        {/* <Link>開始創造</Link> */}
      </main>
    </>
  );
}
