import React from "react";
import styled from "styled-components";
import { FaSearch, FaTh, FaList } from "react-icons/fa";
import Link from "next/link";

// Styled Components
const DashboardContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 20px;
  padding: 5px 15px;
  width: 300px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  margin-left: 10px;
  outline: none;
  width: 100%;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px ${(props) => props.theme.colors.shadow};
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h3`
  margin-top: 0;
  color: ${(props) => props.theme.colors.text};
`;

const CardContent = styled.p`
  color: ${(props) => props.theme.colors.text};
`;

const RecentFilesSection = styled.section`
  margin-top: 40px;
`;

const RecentFilesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button<{ $isActive?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  color: ${(props) =>
    props.$isActive ? props.theme.colors.accent : "inherit"};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Interfaces
export interface ActionCard {
  title: string;
  description: string;
  onClick: () => void;
  href: string;
}

export interface DashboardProps {
  actionCards: ActionCard[];
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onViewToggle: (view: "grid" | "list") => void;
  recentFiles: React.ReactNode;
  searchTerm: string;
  viewMode: "grid" | "list";
}

// Sub-components
const HeaderComponent: React.FC<{
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
}> = ({ onSearch, searchTerm }) => (
  <Header>
    <SearchBar>
      <FaSearch size={18} />
      <SearchInput
        placeholder="Search for anything"
        onChange={onSearch}
        value={searchTerm}
      />
    </SearchBar>
  </Header>
);

const ActionCard: React.FC<ActionCard> = ({
  title,
  description,
  onClick,
  href,
}) => (
  <Link href={href} passHref>
    <Card onClick={onClick}>
      <CardTitle>{title}</CardTitle>
      <CardContent>{description}</CardContent>
    </Card>
  </Link>
);

const RecentFiles: React.FC<{
  onViewToggle: (view: "grid" | "list") => void;
  viewMode: "grid" | "list";
  children: React.ReactNode;
}> = ({ onViewToggle, viewMode, children }) => (
  <RecentFilesSection>
    <RecentFilesHeader>
      <h2>Recently viewed</h2>
      <ViewToggle>
        <IconButton
          onClick={() => onViewToggle("grid")}
          $isActive={viewMode === "grid"}
        >
          <FaTh size={18} />
        </IconButton>
        <IconButton
          onClick={() => onViewToggle("list")}
          $isActive={viewMode === "list"}
        >
          <FaList size={18} />
        </IconButton>
      </ViewToggle>
    </RecentFilesHeader>
    {viewMode === "grid" ? (
      <GridContainer>{children}</GridContainer>
    ) : (
      <ListContainer>{children}</ListContainer>
    )}
  </RecentFilesSection>
);

// Main Template Component
const Dashboard: React.FC<DashboardProps> = ({
  actionCards = [],
  onSearch,
  onViewToggle,
  recentFiles,
  searchTerm,
  viewMode,
}) => {
  return (
    <DashboardContainer>
      <HeaderComponent onSearch={onSearch} searchTerm={searchTerm} />
      <MainContent>
        {actionCards.map((card, index) => (
          <ActionCard key={index} {...card} />
        ))}
      </MainContent>

      <RecentFiles onViewToggle={onViewToggle} viewMode={viewMode}>
        {recentFiles}
      </RecentFiles>
    </DashboardContainer>
  );
};

export default Dashboard;
