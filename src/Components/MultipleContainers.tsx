"use client";

import React, { useState, useCallback } from "react";
import {
  DndContext,
  // 上下文提供拖拽相關的狀態和處理邏輯
  closestCenter,
  // 拖拽碰撞檢測
  KeyboardSensor,
  PointerSensor,
  // 感知拖拽事件的傳感器
  useSensor,
  useSensors,
  // 註冊拖拽傳感器
  DragEndEvent,
  DragOverEvent,
  // 拖拽結束和拖拽過程中的事件
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  // 重排陣列中項目的工具
  SortableContext,
  // 上下文提供排序相關的狀態和處理邏輯
  sortableKeyboardCoordinates,
  // 鍵盤傳感器的座標獲取工具
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./SortableItem";
import { Container } from "./Container";

type Items = Record<string, UniqueIdentifier[]>;

export function MultipleContainers({ initialItems }: { initialItems?: Items }) {
  const [items, setItems] = useState<Items>(initialItems || {});

  // 註冊拖拽傳感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = useCallback(
    (id: UniqueIdentifier): string | undefined => {
      if (typeof id === "string" && id in items) {
        return id;
      }
      return Object.keys(items).find((key) => items[key].includes(id));
    },
    [items]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      const { id } = active;
      const overId = over?.id;

      if (!overId) return;

      const activeContainer = findContainer(id);
      const overContainer = findContainer(overId);

      if (
        !activeContainer ||
        !overContainer ||
        activeContainer === overContainer
      ) {
        return;
      }
      // !activeContainer  沒有找到與拖拽項目相關的容器
      // !overContainer 拖拽項目沒有正確地放到目標容器
      //  activeContainer === overContainer 拖拽項目沒有離開原來的容器

      setItems((prev) => {
        //  獲取拖拽前後容器的項目列表
        const activeItems = prev[activeContainer];
        const overItems = prev[overContainer];

        const activeIndex = activeItems.indexOf(id);
        const overIndex = overItems.indexOf(overId);

        return {
          ...prev,
          [activeContainer]: [
            ...prev[activeContainer].filter((item) => item !== active.id),
          ],
          // 從源容器中移除拖拽項目 filter 方法創建一個新數組，排除掉拖拽項目
          [overContainer]: [
            ...prev[overContainer].slice(0, overIndex), // 目標容器中拖拽項目放置位置之前的部分
            items[activeContainer][activeIndex], // 插入拖拽項目
            ...prev[overContainer].slice(overIndex, prev[overContainer].length), // 目標容器中拖拽項目放置位置之後的部分
          ],
        };
      });
    },
    [items, findContainer]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const { id } = active;
      const overId = over?.id;

      // 如果拖拽沒有放置到有效的目標位置，則返回
      if (!overId) return;

      // 獲取拖拽項目和目標項目的容器
      const activeContainer = findContainer(id);
      const overContainer = findContainer(overId);

      if (
        !activeContainer ||
        !overContainer ||
        activeContainer !== overContainer
      ) {
        return;
      }

      const activeIndex = items[activeContainer].indexOf(id);
      const overIndex = items[overContainer].indexOf(overId);

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          // [overContainer] 目標容器的 ID 更新的容器
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex, // 原來的位置刪除項目
            overIndex // 新位置插入該項目
          ),
          // arrayMove 數組中移動項目
        }));
      }
    },
    [items, findContainer]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: "flex" }}>
        {Object.keys(items).map((containerId) => (
          <Container
            key={containerId}
            id={containerId}
            items={items[containerId]}
          >
            <SortableContext
              items={items[containerId]}
              strategy={verticalListSortingStrategy}
            >
              {items[containerId].map((id) => (
                <SortableItem key={`${containerId}-${id}`} id={id} />
              ))}
            </SortableContext>
          </Container>
        ))}
      </div>
    </DndContext>
  );
}
