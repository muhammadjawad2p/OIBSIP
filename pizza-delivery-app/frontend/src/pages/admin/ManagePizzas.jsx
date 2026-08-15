import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminPizzaService } from "../../services";

const emptyForm = {
  name: "",
  description: "",
  category: "Veg",
  small: "",
  medium: "",
  large: "",
  isCustomizable: false,
};

const ManagePizzas = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);

  const fetchPizzas = async () => {
    setLoading(true);
    try {
      const { data } = await adminPizzaService.getAll();
      setPizzas(data.pizzas);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (pizza) => {
    setForm({
      name: pizza.name,
      description: pizza.description,
      category: pizza.category,
      small: pizza.basePrice.small,
      medium: pizza.basePrice.medium,
      large: pizza.basePrice.large,
      isCustomizable: pizza.isCustomizable,
    });
    setEditingId(pizza._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append(
      "basePrice",
      JSON.stringify({ small: Number(form.small), medium: Number(form.medium), large: Number(form.large) })
    );
    formData.append("isCustomizable", form.isCustomizable);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingId) {
        await adminPizzaService.update(editingId, formData);
        toast.success("Pizza updated");
      } else {
        await adminPizzaService.create(formData);
        toast.success("Pizza created");
      }
      resetForm();
      fetchPizzas();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save pizza");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pizza?")) return;
    try {
      await adminPizzaService.remove(id);
      toast.success("Pizza deleted");
      fetchPizzas();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete pizza");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold">Manage Pizzas</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full font-semibold"
        >
          {showForm ? "Cancel" : "+ Add Pizza"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 mb-8 grid grid-cols-2 gap-4">
          <input
            required
            placeholder="Pizza Name"
            className="border rounded-lg px-4 py-2 col-span-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="border rounded-lg px-4 py-2 col-span-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="border rounded-lg px-4 py-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option>Veg</option>
            <option>Non-Veg</option>
            <option>Custom</option>
          </select>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          <input
            required
            type="number"
            placeholder="Small Price"
            className="border rounded-lg px-4 py-2"
            value={form.small}
            onChange={(e) => setForm({ ...form, small: e.target.value })}
          />
          <input
            required
            type="number"
            placeholder="Medium Price"
            className="border rounded-lg px-4 py-2"
            value={form.medium}
            onChange={(e) => setForm({ ...form, medium: e.target.value })}
          />
          <input
            required
            type="number"
            placeholder="Large Price"
            className="border rounded-lg px-4 py-2"
            value={form.large}
            onChange={(e) => setForm({ ...form, large: e.target.value })}
          />
          <button className="col-span-2 bg-primary text-white py-3 rounded-lg font-semibold">
            {editingId ? "Update Pizza" : "Create Pizza"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 skeleton rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pizzas.map((pizza) => (
            <div key={pizza._id} className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-4xl">
                {pizza.image ? (
                  <img src={pizza.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  "🍕"
                )}
              </div>
              <div className="p-4">
                <p className="font-bold">{pizza.name}</p>
                <p className="text-xs text-gray-500 mb-2">{pizza.category}</p>
                <p className="text-sm mb-3">
                  S: Rs.{pizza.basePrice.small} · M: Rs.{pizza.basePrice.medium} · L: Rs.{pizza.basePrice.large}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pizza)}
                    className="flex-1 border border-primary text-primary py-1.5 rounded-lg text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pizza._id)}
                    className="flex-1 border border-red-300 text-red-600 py-1.5 rounded-lg text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePizzas;
