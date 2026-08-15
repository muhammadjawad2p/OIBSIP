import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminUserService } from "../../services";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminUserService.getAll();
      setUsers(data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await adminUserService.remove(id);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Manage Users</h1>

      <div className="bg-white rounded-xl shadow-card overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Verified</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.phone || "-"}</td>
                  <td className="p-4">
                    {u.isVerified ? (
                      <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">Verified</span>
                    ) : (
                      <span className="text-gray-500 text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full">Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
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

export default ManageUsers;
