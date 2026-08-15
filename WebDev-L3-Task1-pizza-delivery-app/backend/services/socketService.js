let ioInstance = null;

// Map of userId -> Set of socket ids, so we can emit to a specific user
const userSockets = new Map();

const initSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Client emits this right after connecting, once they know their userId
    socket.on("register", (userId) => {
      if (!userId) return;
      if (!userSockets.has(userId)) userSockets.set(userId, new Set());
      userSockets.get(userId).add(socket.id);
      socket.userId = userId;
    });

    // Admins join a shared room to receive dashboard-wide events
    socket.on("joinAdminRoom", () => {
      socket.join("admins");
    });

    socket.on("disconnect", () => {
      if (socket.userId && userSockets.has(socket.userId)) {
        userSockets.get(socket.userId).delete(socket.id);
        if (userSockets.get(socket.userId).size === 0) {
          userSockets.delete(socket.userId);
        }
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

// Emit an order status update to the specific user who owns the order
const emitOrderStatusUpdate = (userId, order) => {
  if (!ioInstance) return;
  const sockets = userSockets.get(String(userId));
  if (sockets) {
    sockets.forEach((socketId) => {
      ioInstance.to(socketId).emit("orderStatusUpdate", order);
    });
  }
  // Also notify admins room so admin dashboards stay in sync
  ioInstance.to("admins").emit("orderUpdated", order);
};

// Notify admins of a new order
const emitNewOrder = (order) => {
  if (!ioInstance) return;
  ioInstance.to("admins").emit("newOrder", order);
};

module.exports = { initSocket, emitOrderStatusUpdate, emitNewOrder };
