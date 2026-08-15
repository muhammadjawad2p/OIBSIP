import api from "./api";

export const pizzaService = {
  getAll: (params) => api.get("/pizzas", { params }),
  getById: (id) => api.get(`/pizzas/${id}`),
  getBuilderOptions: () => api.get("/pizzas/builder/options"),
};

export const orderService = {
  create: (data) => api.post("/orders", data),
  getMyOrders: () => api.get("/orders/my-orders"),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
};

export const paymentService = {
  createRazorpayOrder: (amount) => api.post("/payments/create-order", { amount }),
  verify: (data) => api.post("/payments/verify", data),
  markFailed: (data) => api.post("/payments/failed", data),
  getMyPayments: () => api.get("/payments/my-payments"),

  // EasyPaisa (simulated flow)
  initiateEasyPaisa: (amount, mobileAccountNumber) =>
    api.post("/payments/easypaisa/initiate", { amount, mobileAccountNumber }),
  confirmEasyPaisa: (data) => api.post("/payments/easypaisa/confirm", data),
};

export const adminPizzaService = {
  getAll: () => api.get("/admin/pizzas"),
  create: (formData) =>
    api.post("/admin/pizzas", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, formData) =>
    api.put(`/admin/pizzas/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  remove: (id) => api.delete(`/admin/pizzas/${id}`),
};

export const adminInventoryService = {
  getAll: (category) => api.get("/admin/inventory", { params: category ? { category } : {} }),
  create: (data) => api.post("/admin/inventory", data),
  update: (id, data) => api.put(`/admin/inventory/${id}`, data),
  increase: (id, amount) => api.patch(`/admin/inventory/${id}/increase`, { amount }),
  decrease: (id, amount) => api.patch(`/admin/inventory/${id}/decrease`, { amount }),
  remove: (id) => api.delete(`/admin/inventory/${id}`),
};

export const adminOrderService = {
  getAll: (status) => api.get("/admin/orders", { params: status ? { status } : {} }),
  updateStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
  getStats: () => api.get("/admin/orders/stats"),
};

export const adminUserService = {
  getAll: () => api.get("/admin/users"),
  getById: (id) => api.get(`/admin/users/${id}`),
  remove: (id) => api.delete(`/admin/users/${id}`),
};
