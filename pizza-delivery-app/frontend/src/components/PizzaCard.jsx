import React from "react";
import { Link } from "react-router-dom";

export const PizzaCard = ({ pizza }) => (
  <Link
    to={`/pizza/${pizza._id}`}
    className="group glass rounded-2xl shadow-card overflow-hidden hover:shadow-glass hover:-translate-y-1 transition-all duration-300 fade-in-up"
  >
    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-yellow-100">
      {pizza.image ? (
        <img
          src={pizza.image}
          alt={pizza.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-6xl">🍕</div>
      )}
      <span className="absolute top-3 left-3 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full">
        {pizza.category}
      </span>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">{pizza.name}</h3>
        <span className="text-sm text-yellow-600 font-semibold">★ {pizza.rating}</span>
      </div>
      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{pizza.description}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-primary font-bold text-lg">Rs. {pizza.basePrice?.small}+</span>
        <span className="text-sm font-semibold text-primary group-hover:underline">View →</span>
      </div>
    </div>
  </Link>
);

export const PizzaCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden shadow-card">
    <div className="h-48 skeleton" />
    <div className="p-4 space-y-3">
      <div className="h-5 w-2/3 skeleton rounded" />
      <div className="h-4 w-full skeleton rounded" />
      <div className="h-4 w-1/2 skeleton rounded" />
    </div>
  </div>
);
