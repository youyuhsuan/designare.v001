import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { Button } from "@/src/Components/Button";
import { AllWebsite, WebsiteMetadata } from "@/src/type/website";
import { formatTimestamp } from "@/src/utilities/convertTimestamp";
import { useAppDispatch } from "@/src/libs/hook";
import { updateWebsiteName } from "@/src/libs/features/websiteBuilder/websiteMetadataSlice";
import DeleteConfirmationModal from "@/src/Components/Dashboard/DeleteConfirmationModal";
import { FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";

const MenuWrapper = styled.div<{ open: boolean; $top: number; $left: number }>`
  position: absolute;
  display: ${(props) => (props.open ? "block" : "none")};
  top: ${(props) => props.$top}px;
  left: ${(props) => props.$left}px;
  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const WebsiteItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
`;

const WebsiteThumbnail = styled.div`
  width: 100px;
  height: 60px;
  background-color: #f0f0f0;
  margin-right: 15px;
`;

const WebsiteInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const WebsiteName = styled(Link)`
  font-size: 18px;
  color: #333;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LastEdited = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  &:hover {
    background-color: #f0f0f0;
    border-radius: 50%;
  }
`;

const MenuItem = styled.div`
  padding: 10px 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
  svg {
    margin-right: 10px;
  }
`;

const EditNameModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

interface RecentItemsProps {
  websites: AllWebsite[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: string) => Promise<void>;
  onUpdateWebsite: (updatedWebsite: AllWebsite) => Promise<void>;
}

const RecentItems: React.FC<RecentItemsProps> = ({
  websites,
  isLoading,
  error,
  onDelete,
  onUpdateWebsite,
}) => {
  const dispatch = useAppDispatch();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingWebsite, setDeletingWebsite] = useState<AllWebsite | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeWebsite, setActiveWebsite] = useState<AllWebsite | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isSaving, setIsSaving] = useState(false);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    website: AllWebsite
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom, left: rect.left });
    setActiveWebsite(website);
  };

  const handleMenuClose = () => {
    setActiveWebsite(null);
  };

  const handleEdit = (website: AllWebsite) => {
    setEditingId(website.id);
    setEditName(website.name);
    handleMenuClose();
  };

  const handleSave = async (website: AllWebsite) => {
    if (!website) return;
    setIsSaving(true);
    try {
      const updatedWebsite = { ...website, name: editName };
      await onUpdateWebsite(updatedWebsite);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update website name:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (website: AllWebsite) => {
    setDeletingWebsite(website);
    setIsDeleteModalOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (deletingWebsite && deletingWebsite.id) {
      await onDelete(deletingWebsite.id);
      setDeletingWebsite(null);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {websites.map((website) => (
        <WebsiteItem key={website.id}>
          <WebsiteThumbnail />
          <WebsiteInfo>
            <WebsiteName href={`/website/${website.id}`}>
              {website.name}
            </WebsiteName>
            <LastEdited>
              最後編輯: {formatTimestamp(website.lastModified)}
            </LastEdited>
          </WebsiteInfo>
          <IconButton onClick={(event) => handleMenuOpen(event, website)}>
            <FaEllipsisV />
          </IconButton>
        </WebsiteItem>
      ))}
      <MenuWrapper
        open={Boolean(activeWebsite)}
        $top={menuPosition.top}
        $left={menuPosition.left}
      >
        <MenuItem onClick={() => activeWebsite && handleEdit(activeWebsite)}>
          <FaEdit />
          重新命名
        </MenuItem>
        <MenuItem onClick={() => activeWebsite && handleDelete(activeWebsite)}>
          <FaTrash />
          刪除設計
        </MenuItem>
      </MenuWrapper>

      {editingId && (
        <EditNameModal>
          <h3>更改專案名稱</h3>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <ButtonWrapper>
            <Button $variant="outlined" onClick={() => setEditingId(null)}>
              取消
            </Button>
            <Button
              onClick={() => {
                const websiteToUpdate = websites.find(
                  (w) => w.id === editingId
                );
                if (websiteToUpdate) {
                  handleSave(websiteToUpdate);
                } else {
                  console.error("No website found with id:", editingId);
                }
              }}
              disabled={isSaving}
            >
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </ButtonWrapper>
        </EditNameModal>
      )}

      {deletingWebsite && (
        <DeleteConfirmationModal
          websiteName={deletingWebsite.name}
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeletingWebsite(null);
            setIsDeleteModalOpen(false);
          }}
          isOpen={isDeleteModalOpen}
        />
      )}
    </>
  );
};

export default RecentItems;
