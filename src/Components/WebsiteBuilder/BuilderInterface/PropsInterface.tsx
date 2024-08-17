import { ReactNode } from "react";

export interface SiteContainerProps {
  width?: string;
  height?: string;
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

// Config
export interface configProps {
  $config: any;
}
