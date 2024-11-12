import React, { useEffect, useState } from "react";
import { fetchItems } from "../../api";
import Item from "../Item";
import { ItemTypes } from "../../types";
import { useMotion } from "../../hooks/useMotion";
import EmptyState from "../EmptyState";
import {
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "../../lib/utils";

interface ItemListProps {
  items: ItemTypes[];
  setItems: React.Dispatch<React.SetStateAction<ItemTypes[]>>;
}

const ItemList: React.FC<ItemListProps> = ({ items, setItems }) => {
  const { AnimatePresence } = useMotion();
  const [filter, setFilter] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<ItemTypes[]>(items);

  useEffect(() => {
    fetchItems()
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, [setItems]);

  useEffect(() => {
    if (filter) {
      setFilteredItems(
        items.filter((item) =>
          item.title.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilteredItems(items);
    }
  }, [filter, items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div>
      {items.length > 0 ? (
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter items by title"
          className="mb-4 p-2 border rounded"
        />
      ) : null}

      {filter && filteredItems.length === 0 ? (
        <EmptyState text="No items match your search." />
      ) : items.length === 0 ? (
        <EmptyState text="No items added yet." />
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredItems} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <SortableItem key={item.id} item={item} setItems={setItems} />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

interface SortableItemProps {
  item: ItemTypes;
  setItems: React.Dispatch<React.SetStateAction<ItemTypes[]>>;
}

const SortableItem: React.FC<SortableItemProps> = ({ item, setItems }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: item.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.3 : 1,
  };

  const handlerClassNames = cn("absolute top-2 right-2", {
    "cursor-grabbing": isDragging,
    "cursor-grab": !isDragging,
  });

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative">
      <div className={handlerClassNames} {...listeners}>
        <GripVertical size={16} /> {/* Drag handle icon */}
      </div>
      <Item item={item} setItems={setItems} />
    </div>
  );
};

export default ItemList;
