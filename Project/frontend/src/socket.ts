import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_BASE || "http://localhost:6321", {
  withCredentials: true,
  transports: ['websocket'],
})

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err);
});

export { socket };
