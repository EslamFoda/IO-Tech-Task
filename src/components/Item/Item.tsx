import React, { useState } from "react";
import { deleteItem, updateItem } from "../../api";
import { ItemTypes } from "../../types";
import { Button } from "../../ui-components/button";
import { useToast } from "../../hooks/use-toast";
import { useMotion } from "../../hooks/useMotion";

interface ItemProps {
  item: ItemTypes;
  setItems: React.Dispatch<React.SetStateAction<ItemTypes[]>>;
}

const Item: React.FC<ItemProps> = ({ item, setItems }) => {
  const { motion } = useMotion();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body);
  const [error, setError] = useState<string | null>(null);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset fields if canceling edit mode
      setTitle(item.title);
      setBody(item.body);
      setError(null);
    }
    setIsEditing((prev) => !prev);
  };

  const handleUpdate = async () => {
    try {
      const response = await updateItem(item.id, { title, body });
      setIsEditing(false);
      setError(null);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === response.data.id ? { ...response.data } : item
        )
      );
      toast({
        title: "Success!",
        description: "Item updated successfully.",
      });
    } catch (error) {
      console.error("Error updating item:", error);
      setError("Failed to save changes. Please try again.");
      toast({
        variant: "destructive",
        title: "Failed to update item. Please try again.",
      });
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      // Call the delete API and only update the UI if successful
      await deleteItem(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast({
        variant: "destructive",
        title: "Success!",
        description: "Item deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  const isSaveDisabled = title === item.title && body === item.body;

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "tween" }}
      className="p-4 min-h-64 bg-card border cursor-default rounded flex flex-col justify-between  space-y-2"
    >
      {isEditing ? (
        <>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='"w-full text-xl font-semibold p-2 border rounded'
              placeholder="Title"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className='"w-full min-h-28 p-2 border rounded'
              placeholder="Description"
            ></textarea>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={handleUpdate}
              variant="secondary"
              disabled={isSaveDisabled}
              aria-label="Save changes"
            >
              Save
            </Button>
            <Button
              onClick={handleEditToggle}
              variant="outline"
              aria-label="Cancel editing"
            >
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p>{item.body}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={handleEditToggle} aria-label="Edit item">
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(item.id)}
              variant="destructive"
              aria-label="Delete item"
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Item;
