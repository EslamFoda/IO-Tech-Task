import React, { useState } from "react";
import { ItemTypes } from "../../types";
import { createItem } from "../../api";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../ui-components/dialog";
import { Button } from "../../ui-components/button";
import { useToast } from "../../hooks/use-toast";
import { useMotion } from "../../hooks/useMotion";

interface ItemFormProps {
  setItems: React.Dispatch<React.SetStateAction<ItemTypes[]>>;
}

const ItemForm: React.FC<ItemFormProps> = ({ setItems }) => {
  const { motion } = useMotion();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Modal open state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && body) {
      sendItemToServer({ title, body });
      resetForm();
    }
  };

  const sendItemToServer = async (newItem: { title: string; body: string }) => {
    setIsSubmitting(true);
    try {
      const response = await createItem(newItem);
      const savedItem = { ...response.data };
      addItemToUI(savedItem);
      setError(null);
      setIsOpen(false); // Close the modal on successful submission
      toast({
        title: "Success!",
        description: "Item added successfully.",
      });
    } catch (error) {
      console.error("Error creating item:", error);
      setError("Failed to add item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItemToUI = (savedItem: ItemTypes) => {
    setItems((prevItems) => [...prevItems, savedItem]);
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <motion.div
          className="inline-block"
          whileHover={{ scale: 1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button>Add Item</Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="DialogContent">
        <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded">
          <div>
            <label className="block font-semibold">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Description:</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full min-h-40 p-2 border rounded"
              required
            ></textarea>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemForm;
