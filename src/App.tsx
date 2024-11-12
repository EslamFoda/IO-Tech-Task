import { useState } from "react";
import ItemForm from "./components/ItemForm";
import ItemList from "./components/ItemList";
import { ItemTypes } from "./types";

function App() {
  const [items, setItems] = useState<ItemTypes[]>([]);

  return (
    <div className="container mx-auto space-y-4 py-4">
      <ItemForm setItems={setItems} />
      <ItemList items={items} setItems={setItems} />
    </div>
  );
}

export default App;
