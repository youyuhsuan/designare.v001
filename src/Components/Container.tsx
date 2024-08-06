"use client";

import React from "react";
import { useDroppable, UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ContainerProps {
  id: string;
  children: React.ReactNode;
  items: UniqueIdentifier[];
}

export function Container({ id, children, items }: ContainerProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "container",
      children: items,
    },
  });

  const style: React.CSSProperties = {
    padding: "20px",
    margin: "10px",
    backgroundColor: isOver ? "#e0e0e0" : "#f0f0f0",
    border: "2px solid ${pros}",
    borderRadius: "8px",
    transition: "background-color 0.2s ease",
    minWidth: "200px",
    minHeight: "300px",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <h2 style={{ marginTop: 0, marginBottom: "10px", color: "#333" }}>
        {id}
      </h2>
      {children}
    </div>
  );
}

interface SortableItemProps {
  id: UniqueIdentifier;
}

export function SortableItem({ id }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "10px",
    margin: "5px 0",
    background: "white",
    boxShadow: isDragging ? "0 5px 15px rgba(0,0,0,0.1)" : "none",
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {String(id)}
    </div>
  );
}
