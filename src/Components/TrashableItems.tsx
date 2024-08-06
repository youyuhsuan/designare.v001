"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import styled from "styled-components";

interface SortableItemDivProps {
  $transform?: string;
  $transition?: string;
}

const SortableItemDiv = styled.div<SortableItemDivProps>`
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin: 5px;
  padding: 5px;
  transition: ${(props) => props.$transition};
  transform: ${(props) => props.$transform};
`;

export function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableItemDiv
      ref={setNodeRef}
      $transform={style.transform}
      $transition={style.transition}
      {...attributes}
      {...listeners}
    >
      {id}
    </SortableItemDiv>
  );
}

const ContainerDiv = styled.div`
  padding: 10px;
  margin: 10px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export function Container({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <ContainerDiv ref={setNodeRef}>
      <h2>{id}</h2>
      {children}
    </ContainerDiv>
  );
}
