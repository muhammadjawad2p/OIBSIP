import React, { useEffect, useState } from "react";
import { adminOrderService } from "../../services";

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-card p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-extrabold">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminOrderService.getStats();
        setStats(data.stats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 skeleton rounded-xl" />
        ))}
      </div>
    );
  }

  const maxDaily = Math.max(...stats.dailyOrders.map((d) => d.count), 1);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Orders" value={stats.totalOrders} icon="🧾" color="bg-blue-100" />
        <StatCard label="Today's Orders" value={stats.todaysOrders} icon="📅" color="bg-yellow-100" />
        <StatCard label="Pending Orders" value={stats.pendingOrders} icon="⏳" color="bg-orange-100" />
        <StatCard label="Revenue" value={`Rs. ${stats.revenue}`} icon="💰" color="bg-green-100" />
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="font-bold mb-6">Orders — Last 7 Days</h3>
        <div className="flex items-end gap-4 h-48">
          {stats.dailyOrders.length === 0 && (
            <p className="text-gray-400 text-sm">No order data in this period yet.</p>
          )}
          {stats.dailyOrders.map((d) => (
            <div key={d._id} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-primary rounded-t-lg transition-all"
                style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: "4px" }}
                title={`${d.count} orders, Rs. ${d.revenue}`}
              />
              <span className="text-xs text-gray-500">{d._id.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
