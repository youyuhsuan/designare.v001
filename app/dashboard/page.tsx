import Nav from "@/src/Components/MainNavbar";
import DashboardContent from "@/src/Components/Dashboard/DashboardContent";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <DashboardContent />
      </main>
    </>
  );
}
