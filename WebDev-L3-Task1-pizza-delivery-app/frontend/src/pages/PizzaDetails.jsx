import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pizzaService } from "../services";
import { useCart } from "../context/CartContext";

const SIZES = ["Small", "Medium", "Large"];

const PizzaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [pizza, setPizza] = useState(null);
  const [size, setSize] = useState("Medium");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        const { data } = await pizzaService.getById(id);
        setPizza(data.pizza);
      } finally {
        setLoading(false);
      }
    };
    fetchPizza();
  }, [id]);

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-16 h-96 skeleton rounded-2xl" />;
  }
  if (!pizza) {
    return <div className="text-center py-20">Pizza not found.</div>;
  }

  const priceKey = size.toLowerCase();
  const unitPrice = pizza.basePrice[priceKey];

  const handleAddToCart = () => {
    addItem({
      pizzaId: pizza._id,
      name: `${pizza.name} (${size})`,
      image: pizza.image,
      size,
      unitPrice,
      quantity,
      customization: null,
    });
    navigate("/cart");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-2 gap-10 fade-in-up">
      <div className="h-80 md:h-full rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
        {pizza.image ? (
          <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-9xl">🍕</span>
        )}
      </div>

      <div>
        <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
          {pizza.category}
        </span>
        <h1 className="text-3xl font-extrabold mt-3">{pizza.name}</h1>
        <p className="text-gray-500 mt-2">{pizza.description}</p>
        <p className="text-yellow-600 font-semibold mt-2">★ {pizza.rating} rating</p>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Select Size</h3>
          <div className="flex gap-3">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-5 py-2 rounded-full border font-medium transition ${
                  size === s ? "bg-primary text-white border-primary" : "hover:border-primary"
                }`}
              >
                {s} - Rs. {pizza.basePrice[s.toLowerCase()]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Quantity</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
            >
              −
            </button>
            <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <span className="text-2xl font-extrabold text-primary">
            Rs. {unitPrice * quantity}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaDetails;
