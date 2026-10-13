import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket = null;

/**
 * Initialize and connect Socket.IO client with JWT authentication token
 * @param {string} token - JWT authentication token
 * @returns {Socket}
 */
export function initSocket(token) {
  if (socket && socket.connected) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: token,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("[Socket.IO Client] Connected to server, socket ID:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket.IO Client] Connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket.IO Client] Disconnected:", reason);
  });

  return socket;
}

/**
 * Get the current socket instance
 * @returns {Socket|null}
 */
export function getSocket() {
  return socket;
}

/**
 * Disconnect and clean up the socket
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("[Socket.IO Client] Socket disconnected and cleaned up");
  }
}
