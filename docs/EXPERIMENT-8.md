# EXPERIMENT 8: Real-Time Communication Using WebSockets and Socket.IO

---

## 1. Experiment Title
Real-Time Communication in NexTalk Chat Application Using WebSockets and Socket.IO.

---

## 2. Aim
To implement full-duplex, bidirectional real-time communication in the NexTalk chat application using WebSockets and Socket.IO, enabling authenticated users to send, receive, and persist chat messages instantaneously with JWT-authenticated socket sessions and privacy-isolated private rooms.

---

## 3. Objectives
1. Configure Socket.IO on the existing Node.js/Express HTTP server with CORS protection.
2. Authenticate WebSocket connections securely using JSON Web Tokens (JWT) passed in the socket handshake `auth` payload.
3. Manage user presence and active connections with support for multiple tabs and devices.
4. Establish private socket rooms mapped to verified user IDs to ensure strict message privacy.
5. Persist real-time messages in MongoDB before delivery to ensure durability and message history.
6. Integrate incoming and outgoing socket events with React Context API and `useReducer`.
7. Prevent duplicate messages in both local client state and database persistence.
8. Maintain full backward-compatibility with existing REST APIs.
9. Handle network failures, disconnections, and offline recipients gracefully.
10. Test and document the complete real-time messaging pipeline.

---

## 4. Theory

### 4.1 Traditional HTTP vs. WebSockets
* **HTTP Polling / Request-Response:** In traditional HTTP architectures, communication is unidirectional and client-initiated. For real-time applications, clients must resort to polling (short polling or long polling), which incurs significant HTTP header overhead, latency, and redundant server strain.
* **WebSocket Protocol (RFC 6455):** Provides a persistent, full-duplex, low-latency TCP connection over a single socket. After an initial HTTP handshake upgrade, either party (client or server) can push data frames at any time without header renegotiation.

### 4.2 Socket.IO Architecture
Socket.IO is a library built on top of the WebSocket protocol that provides:
* Automatic reconnection and exponential backoff.
* Transport fallback (WebSocket and HTTP Long-Polling).
* Room abstractions for broadcasting and targeted delivery.
* Packet buffering during temporary connection interruptions.
* Event-driven communication with acknowledgment callbacks.

### 4.3 JWT Authentication for WebSockets
In REST APIs, JWT tokens are provided in the `Authorization: Bearer <token>` HTTP header. For WebSockets, the token is provided during the initial handshake in the `auth` object:
```javascript
const socket = io("http://localhost:5000", {
  auth: { token: jwtToken }
});
```
The server-side middleware intercepts the handshake before the connection is established:
```javascript
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  socket.user = { id: decoded.userId, role: decoded.role };
  next();
});
```
Any connection attempt with a missing, expired, or tampered token is rejected immediately with an authentication error, preventing unauthorized WebSocket connections.

### 4.4 Private Rooms and Multi-Device Support
To prevent broadcasting private conversations across all connected clients:
1. Upon authentication, each user socket automatically joins a private room named after their verified database user ID: `socket.join(socket.user.id)`.
2. When User A sends a message to User B, the server emits `message:new` specifically to User B's room (`io.to(receiverId).emit(...)`).
3. If User B is connected across multiple browser tabs or devices, all their active sockets reside in the same room and receive the incoming message synchronously.
4. Unrelated users (User C) receive zero network packets for User A and B's conversation.

---

## 5. Technologies Used
* **Frontend:** React 19, Vite, Tailwind CSS, Context API (`useReducer`), `socket.io-client`.
* **Backend:** Node.js, Express, HTTP module, `socket.io`.
* **Database:** MongoDB Atlas / Local MongoDB via Mongoose.
* **Security:** JSON Web Tokens (`jsonwebtoken`), bcryptjs.
* **Testing:** Node.js automated test suite (`test_socket_suite.js`), Postman.

---

## 6. System Architecture

```
+-------------------------------------------------------------------------------+
|                             NexTalk Real-Time Architecture                     |
+-------------------------------------------------------------------------------+

   [Client A (Sender)]                          [Node.js / Express Server]                    [Client B (Recipient)]
           |                                                |                                           |
           |  1. WSS Handshake { auth: { token: JWT } }     |                                           |
           |----------------------------------------------->|                                           |
           |     Verify JWT -> socket.join(userA.id)        |                                           |
           |                                                |  2. WSS Handshake { auth: { token: JWT } }|
           |                                                |<------------------------------------------|
           |                                                |     Verify JWT -> socket.join(userB.id)   |
           |                                                |                                           |
           |  3. socket.emit("message:send", {receiver, content}, ack)                                  |
           |----------------------------------------------->|                                           |
           |                                                |  4. Validate payload                      |
           |                                                |  5. Message.create() in MongoDB           |
           |                                                |  6. Populate sender & receiver            |
           |                                                |                                           |
           |                                                |  7. io.to(receiver).emit("message:new", msg)
           |                                                |------------------------------------------>|
           |  8. ack({ status: "ok", message: msg })        |                                           |
           |<-----------------------------------------------|                                           |
           |                                                |                                           |
           |  9. Dispatch SEND_MESSAGE to useReducer        |       10. Dispatch RECEIVE_MESSAGE        |
           |     (Local UI updates instantly)               |           (Local UI updates instantly)    |
```

---

## 7. Socket.IO Events

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `message:send` | Client -> Server | `{ receiver, content }` | Client initiates sending a chat message to a specific recipient. |
| `message:new` | Server -> Client | Populated `Message` object (`{ _id, sender, receiver, content, createdAt }`) | Server delivers the persisted message to the recipient's private room. |
| `user:online` | Server -> Broadcast | `{ userId }` | Notifies connected clients that a user has connected. |
| `user:offline` | Server -> Broadcast | `{ userId }` | Notifies connected clients that a user's last socket has disconnected. |
| `users:online_list` | Server -> Client | `[ userId1, userId2, ... ]` | Provides the list of currently active user IDs upon connection. |
| `chat:error` | Server -> Client | `{ status: "error", message }` | Emitted when message validation or persistence fails. |

---

## 8. Implementation Details

### 8.1 Backend Implementation (`server/socket.js`, `server/server.js`)
* **HTTP Server Wrapping:** Express application is wrapped using Node's native `http.createServer(app)` to allow both Express REST routes and Socket.IO WebSocket handlers to bind to port 5000 simultaneously.
* **Handshake JWT Middleware:** `io.use()` validates `socket.handshake.auth.token` against `process.env.JWT_SECRET`, retrieves the user document from MongoDB, and attaches `socket.user = { id, name, email, role }`.
* **Multi-Socket Presence Tracking:** In-memory `Map<userId, Set<socketId>>` handles multi-tab scenarios, emitting `user:online` on first connection and `user:offline` only when all sockets for a user are closed.
* **Persistence Guarantee:** Messages are persisted via `Message.create()` and populated before `io.to(receiver).emit()` is called. If the database write fails, an error is returned and no message is delivered.
* **REST API Notification Bridge:** In `messageController.js`, `createMessage` also emits via `io.to(receiver).emit("message:new", msg)` so messages submitted through REST are delivered to active WebSocket clients.

### 8.2 Frontend Implementation (`client/src/services/socket.js`, `AppContext.jsx`, `appReducer.js`)
* **Socket Service:** Singleton manager in `socket.js` providing `initSocket(token)`, `getSocket()`, and `disconnectSocket()`.
* **Centralized State Integration:** `AppContext.jsx` initializes Socket.IO connection upon user authentication and cleans up on logout.
* **Deduplication Logic:** In `appReducer.js`, both `SEND_MESSAGE` and `RECEIVE_MESSAGE` check `existing.some(m => m.id === message.id)` to guarantee no message appears twice in the UI thread.
* **Graceful REST Fallback:** In `sendMessage()`, if the socket connection is temporarily lost, the client transparently falls back to `sendMessageAPI()` via REST without interrupting the user experience.

---

## 9. Working Procedure
1. **Start Backend Server:** Run `node server.js` inside `server/`. The server binds to port 5000, connects to MongoDB, and initializes Socket.IO.
2. **Start Frontend Client:** Run `npm run dev` inside `client/`. The Vite development server runs on `http://localhost:5173`.
3. **User Authentication:** Log in as User A (`alex.demo@example.com` or newly registered account). The backend responds with a JWT token.
4. **WebSocket Connection:** The client establishes a Socket.IO connection passing the JWT token in `auth: { token }`.
5. **Presence Update:** Server registers User A as online and broadcasts `user:online` to all connected clients.
6. **Recipient Login:** Open an incognito window or second browser. Log in as User B.
7. **Real-Time Exchange:** 
   * User A selects User B in the sidebar and types a message.
   * Clicking Send emits `message:send`.
   * Backend validates, writes to MongoDB, and emits `message:new` to User B's room.
   * User B's chat feed updates immediately without page reload.
   * User B replies; User A's chat feed updates immediately.
8. **Logout:** Clicking Sign Out calls `disconnectSocket()`, cleanly terminating the WebSocket connection and updating presence across remaining clients.

---

## 10. Testing and Observations

### Automated Test Suite (`test_socket_suite.js`)
An automated integration test script was executed against the live server. Results:

| Test Case | Description | Expected Result | Observed Result | Status |
|---|---|---|---|---|
| TC-01 | User A Registration & Login | 200 OK + JWT Token | Token received | PASS |
| TC-02 | User B Registration & Login | 200 OK + JWT Token | Token received | PASS |
| TC-03 | User C Registration & Login | 200 OK + JWT Token | Token received | PASS |
| TC-04 | Socket Connection without Token | Connection rejected | `Authentication error: Token required` | PASS |
| TC-05 | Socket Connection with Malformed Token | Connection rejected | `Authentication error: jwt malformed` | PASS |
| TC-06 | Socket A Authenticated Connection | Connected successfully | `connect` event fired | PASS |
| TC-07 | Socket B Authenticated Connection | Connected successfully | `connect` event fired | PASS |
| TC-08 | Socket C Authenticated Connection | Connected successfully | `connect` event fired | PASS |
| TC-09 | Real-Time Message Send (A -> B) | Server acknowledgment `{ status: "ok" }` | Acknowledgment received | PASS |
| TC-10 | Real-Time Message Delivery to B | B receives `message:new` | Message content matches | PASS |
| TC-11 | Private Delivery Isolation (C) | C receives no packets | C received 0 messages | PASS |
| TC-12 | MongoDB Persistence Verification | Message retrievable via `GET /api/messages/:id` | Found in MongoDB array | PASS |
| TC-13 | Offline Recipient Delivery | Message saved when B is offline | Saved in MongoDB thread | PASS |
| TC-14 | Empty Message Validation | Server rejects empty string | Status error returned | PASS |
| TC-15 | Invalid Recipient Validation | Server rejects malformed ObjectId | Status error returned | PASS |

**Summary:** 20 out of 20 test assertions PASSED. Zero failures.

---

## 11. Result
Real-time messaging using WebSockets and Socket.IO was successfully designed, implemented, and verified in the NexTalk chat application. Authenticated users can transmit private messages instantaneously with guaranteed database persistence and seamless integration into React's Context API and `useReducer` state management.

---

## 12. Conclusion
Experiment 8 demonstrated the architectural shift from stateless HTTP request-response patterns to stateful, full-duplex WebSocket protocols. By combining Socket.IO with JWT authentication, MongoDB durability, and React reducer deduplication, NexTalk achieves production-grade real-time chat functionality while preserving security, privacy, and backward compatibility.
