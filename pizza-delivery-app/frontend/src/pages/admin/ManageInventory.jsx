import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminInventoryService } from "../../services";

const CATEGORIES = ["Base", "Sauce", "Cheese", "Vegetable"];

const ManageInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ itemName: "", category: "Base", stock: "", price: "", lowStockThreshold: 10 });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await adminInventoryService.getAll(category);
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminInventoryService.create(form);
      toast.success("Item added");
      setForm({ itemName: "", category: "Base", stock: "", price: "", lowStockThreshold: 10 });
      setShowForm(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add item");
    }
  };

  const adjustStock = async (id, type) => {
    const amount = prompt(`Amount to ${type}:`, "10");
    if (!amount || isNaN(amount)) return;
    try {
      if (type === "increase") await adminInventoryService.increase(id, Number(amount));
      else await adminInventoryService.decrease(id, Number(amount));
      toast.success("Stock updated");
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inventory item?")) return;
    try {
      await adminInventoryService.remove(id);
      toast.success("Item deleted");
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete item");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold">Manage Inventory</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full font-semibold"
        >
          {showForm ? "Cancel" : "+ Add Item"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-card p-6 mb-8 grid grid-cols-2 gap-4">
          <input
            required
            placeholder="Item Name"
            className="border rounded-lg px-4 py-2"
            value={form.itemName}
            onChange={(e) => setForm({ ...form, itemName: e.target.value })}
          />
          <select
            className="border rounded-lg px-4 py-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            required
            type="number"
            placeholder="Stock"
            className="border rounded-lg px-4 py-2"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <input
            type="number"
            placeholder="Extra Price (optional)"
            className="border rounded-lg px-4 py-2"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Low Stock Threshold"
            className="border rounded-lg px-4 py-2 col-span-2"
            value={form.lowStockThreshold}
            onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
          />
          <button className="col-span-2 bg-primary text-white py-3 rounded-lg font-semibold">
            Add Item
          </button>
        </form>
      )}

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setCategory("")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold ${!category ? "bg-primary text-white" : "bg-gray-100"}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${category === c ? "bg-primary text-white" : "bg-gray-100"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Extra Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-4 font-medium">{item.itemName}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">{item.stock}</td>
                  <td className="p-4">Rs. {item.price}</td>
                  <td className="p-4">
                    {item.stock <= item.lowStockThreshold ? (
                      <span className="text-red-600 font-semibold text-xs bg-red-50 px-2 py-1 rounded-full">Low Stock</span>
                    ) : (
                      <span className="text-green-600 font-semibold text-xs bg-green-50 px-2 py-1 rounded-full">OK</span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => adjustStock(item._id, "increase")} className="text-green-600 hover:underline">+ Stock</button>
                    <button onClick={() => adjustStock(item._id, "decrease")} className="text-orange-600 hover:underline">- Stock</button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageInventory;
