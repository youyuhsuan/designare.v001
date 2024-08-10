import { ElementProvider } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import { CanvasArea } from "@/src/Components/WebsiteBuilder/CanvasArea";
import { Sidebar } from "@/src/Components/WebsiteBuilder/Sidebar/Sidebar";

export const WebsiteBuilder: React.FC = () => (
  <ElementProvider>
    <Sidebar />
    <CanvasArea />
  </ElementProvider>
);
