import CreateWebsiteNavbar from "@/src/Components/CreateWebsite/CreateWebsiteNavbar";
import SitePreviewer from "@/src/Components/CreateWebsite/SitePreviewer";

export default function Page() {
  return (
    <>
      <CreateWebsiteNavbar />
      <main>
        <SitePreviewer></SitePreviewer>
      </main>
    </>
  );
}
