import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pizzaService } from "../services";
import { PizzaCard, PizzaCardSkeleton } from "../components/PizzaCard";

const CATEGORIES = ["All", "Veg", "Non-Veg", "Custom"];

const Home = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPizzas = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== "All") params.category = category;
        if (search) params.search = search;
        const { data } = await pizzaService.getAll(params);
        setPizzas(data.pizzas);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(fetchPizzas, 300);
    return () => clearTimeout(timeout);
  }, [category, search]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-8 items-center">
          <div className="fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Hot, Fresh Pizza <br /> Delivered To You 🍕
            </h1>
            <p className="text-white/90 mb-6">
              Choose from our classics or build your own from scratch — fresh dough, real
              ingredients, delivered fast.
            </p>
            <div className="flex gap-3">
              <a href="#menu" className="bg-white text-primary px-6 py-3 rounded-full font-bold hover:scale-105 transition">
                Order Now
              </a>
              <Link
                to="/builder"
                className="border-2 border-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-primary transition"
              >
                Build Your Own
              </Link>
            </div>
          </div>
          <div className="text-[10rem] text-center select-none fade-in-up">🍕</div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-3xl font-extrabold">Our Menu</h2>
          <input
            type="text"
            placeholder="Search pizzas..."
            className="border rounded-full px-5 py-2 w-full sm:w-64 focus:ring-2 focus:ring-primary outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                category === c ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <PizzaCardSkeleton key={i} />)
            : pizzas.map((pizza) => <PizzaCard key={pizza._id} pizza={pizza} />)}
        </div>

        {!loading && pizzas.length === 0 && (
          <p className="text-center text-gray-400 py-20">No pizzas found. Try a different search.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
