import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { pizzaService } from "../services";
import { useCart } from "../context/CartContext";

const STEP_LABELS = ["Base", "Sauce", "Cheese", "Vegetables", "Size", "Quantity"];
const SIZE_MULTIPLIER = { Small: 1, Medium: 1.4, Large: 1.8 };

const PizzaBuilder = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  const [base, setBase] = useState(null);
  const [sauce, setSauce] = useState(null);
  const [cheese, setCheese] = useState(null);
  const [vegetables, setVegetables] = useState([]);
  const [size, setSize] = useState("Medium");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { data } = await pizzaService.getBuilderOptions();
        setOptions(data.options);
        if (data.options.bases[0]) setBase(data.options.bases[0]);
        if (data.options.sauces[0]) setSauce(data.options.sauces[0]);
        if (data.options.cheese[0]) setCheese(data.options.cheese[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const toggleVeggie = (item) => {
    setVegetables((prev) =>
      prev.find((v) => v._id === item._id)
        ? prev.filter((v) => v._id !== item._id)
        : [...prev, item]
    );
  };

  const basePrice = 129; // base builder price, mirrors "Build Your Own" pizza in seed data
  const ingredientsPrice =
    (base?.price || 0) +
    (sauce?.price || 0) +
    (cheese?.price || 0) +
    vegetables.reduce((sum, v) => sum + v.price, 0);

  const unitPrice = Math.round((basePrice + ingredientsPrice) * SIZE_MULTIPLIER[size]);
  const total = unitPrice * quantity;

  const canProceed = () => {
    if (step === 0) return !!base;
    if (step === 1) return !!sauce;
    if (step === 2) return !!cheese;
    return true;
  };

  const handleAddToCart = () => {
    addItem({
      pizzaId: null,
      name: `Custom Pizza (${size})`,
      image: "",
      size,
      unitPrice,
      quantity,
      customization: {
        base: base?.itemName,
        sauce: sauce?.itemName,
        cheese: cheese?.itemName,
        vegetables: vegetables.map((v) => v.itemName),
      },
    });
    toast.success("Custom pizza added to cart!");
    navigate("/cart");
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-16 h-96 skeleton rounded-2xl" />;
  }

  const OptionGrid = ({ items, selected, onSelect, multi }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((item) => {
        const isSelected = multi
          ? vegetables.find((v) => v._id === item._id)
          : selected?._id === item._id;
        return (
          <button
            key={item._id}
            onClick={() => onSelect(item)}
            className={`border rounded-xl p-4 text-left transition ${
              isSelected ? "border-primary bg-primary/5 ring-2 ring-primary" : "hover:border-primary"
            }`}
          >
            <p className="font-semibold">{item.itemName}</p>
            <p className="text-xs text-gray-500">
              {item.price > 0 ? `+Rs. ${item.price}` : "Free"}
            </p>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-center mb-2">🍕 Build Your Own Pizza</h1>
      <p className="text-center text-gray-500 mb-8">Step {step + 1} of {STEP_LABELS.length}: {STEP_LABELS[step]}</p>

      {/* progress bar */}
      <div className="flex gap-2 mb-10">
        {STEP_LABELS.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 flex-1 rounded-full ${idx <= step ? "bg-primary" : "bg-gray-200"}`}
          />
        ))}
      </div>

      <div className="glass rounded-2xl shadow-card p-6 min-h-[320px] fade-in-up">
        {step === 0 && (
          <OptionGrid items={options.bases} selected={base} onSelect={setBase} />
        )}
        {step === 1 && (
          <OptionGrid items={options.sauces} selected={sauce} onSelect={setSauce} />
        )}
        {step === 2 && (
          <OptionGrid items={options.cheese} selected={cheese} onSelect={setCheese} />
        )}
        {step === 3 && (
          <OptionGrid items={options.vegetables} onSelect={toggleVeggie} multi />
        )}
        {step === 4 && (
          <div className="flex gap-4 justify-center">
            {Object.keys(SIZE_MULTIPLIER).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-6 py-4 rounded-xl border font-semibold transition ${
                  size === s ? "bg-primary text-white border-primary" : "hover:border-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {step === 5 && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl"
              >
                −
              </button>
              <span className="text-2xl font-bold w-10 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl"
              >
                +
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 w-full text-sm space-y-1">
              <p><strong>Base:</strong> {base?.itemName}</p>
              <p><strong>Sauce:</strong> {sauce?.itemName}</p>
              <p><strong>Cheese:</strong> {cheese?.itemName}</p>
              <p><strong>Vegetables:</strong> {vegetables.map((v) => v.itemName).join(", ") || "None"}</p>
              <p><strong>Size:</strong> {size}</p>
            </div>
            <p className="text-2xl font-extrabold text-primary">Total: Rs. {total}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-6 py-3 rounded-full font-semibold border disabled:opacity-40"
        >
          ← Back
        </button>
        {step < STEP_LABELS.length - 1 ? (
          <button
            onClick={() => canProceed() && setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold transition disabled:opacity-40"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold transition"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default PizzaBuilder;
