import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const createItem = (newItem: { title: string; body: string }) =>
  api.post("/items", newItem);
export const updateItem = (
  id: number | string,
  item: { title: string; body: string }
) => api.put(`/items/${id}`, item);
export const deleteItem = (id: number | string) => api.delete(`/items/${id}`);
export const fetchItems = () => api.get("/items");
