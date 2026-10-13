# NexTalk — Real-Time Chat Application

NexTalk is a full-stack, real-time messaging web application developed progressively across 10 structured college experiments. It provides authenticated direct messaging, user presence tracking, instant message delivery via WebSockets, and database persistence with MongoDB.

---

## Technology Stack

* **Frontend:** React 19, Vite, Tailwind CSS
* **Frontend State Management:** React Context API + `useReducer` (Centralized state architecture)
* **Backend:** Node.js, Express 5, HTTP module
* **Database & ODM:** MongoDB Atlas / Local MongoDB via Mongoose 9
* **Authentication & Security:** JSON Web Tokens (JWT), bcryptjs password hashing, Role-Based Access Control (RBAC)
* **Real-Time Engine:** Socket.IO 4 / WebSockets
* **Testing:** Postman Collection, Automated Integration Test Suite (`test_socket_suite.js`)

---

## 10 College Experiments Roadmap

- [x] **Experiment 1:** Build responsive and interactive UIs using Tailwind CSS
- [x] **Experiment 2:** React Hooks: `useState`, `useEffect`, `useContext`, custom hooks
- [x] **Experiment 3:** Manage complex state with Context API + `useReducer`
- [x] **Experiment 4:** REST API Design with MongoDB + Mongoose Integration
- [x] **Experiment 5:** Create secure, production-ready RESTful APIs (validation, error handling)
- [x] **Experiment 6:** Implement authentication and user roles (`USER`, `ADMIN`) with JWT
- [x] **Experiment 7:** Validate RESTful APIs using Postman and automated test scripts
- [x] **Experiment 8:** Enable real-time communication via WebSockets/Socket.IO
- [ ] **Experiment 9:** CI/CD Deployment with GitHub Actions + Cloud Hosting
- [ ] **Experiment 10:** Containerize and deploy the full-stack application using Docker

---

## Key Features Implemented (Experiments 1–8)

1. **Responsive Chat Interface:** Clean, dark-mode desktop and mobile layouts built with Tailwind CSS, featuring user lists, search filtering, conversation feeds, and typing indicators.
2. **Centralized React State:** Context API and `useReducer` manage active conversations, unread badge counters, user directory, and presence state with deduplication.
3. **Secure Authentication & RBAC:**
   - Registration (`POST /api/auth/register` or `POST /api/users`) with input validation via `express-validator` and bcrypt password hashing.
   - Login (`POST /api/auth/login`) with JWT token issuance (`{ userId, role }`).
   - Role-Based Access Control protecting admin endpoints (`GET /api/users/admin`) requiring `ADMIN` role.
4. **RESTful API Service:**
   - `GET /api/users` — Fetch registered contacts (requires JWT).
   - `GET /api/messages/:userId` — Fetch conversation history between two users (requires JWT).
   - `POST /api/messages` — Send a direct message (requires JWT).
   - `POST /api/auth/login` — Authenticate user and obtain token.
5. **Real-Time Communication (Socket.IO):**
   - **Handshake JWT Authentication:** Sockets pass `{ auth: { token } }`; unauthenticated or expired tokens are rejected.
   - **Private Rooms:** Each user joins a private room mapped to their verified database user ID (`socket.join(userId)`).
   - **Real-Time Message Delivery:** Messages emitted via `message:send` are validated and saved to MongoDB first, then emitted to the recipient's private room as `message:new`.
   - **Presence Management:** Tracks online users across single or multiple browser sessions/tabs using an in-memory connection map, emitting `user:online` and `user:offline`.
   - **REST Fallback:** If the WebSocket connection is interrupted, the client automatically falls back to REST API sending.
   - **Deduplication:** The reducer prevents rendering duplicate messages by verifying message ID uniqueness.

---

## Project Structure

```
real-time-chat-app/
+-- client/                     # React + Vite frontend
¦   +-- src/
¦   ¦   +-- components/         # UI components (auth, chat, common)
¦   ¦   +-- context/            # AppContext.jsx & appReducer.js
¦   ¦   +-- data/               # Default / seed mock structures
¦   ¦   +-- hooks/              # Custom React hooks (e.g. useLocalStorage)
¦   ¦   +-- services/           # REST API (api.js) & Socket.IO (socket.js)
¦   ¦   +-- App.jsx             # Root layout and view router
¦   ¦   +-- main.jsx            # Application entrypoint
¦   +-- package.json
¦   +-- vite.config.js
+-- server/                     # Node.js + Express + Socket.IO backend
¦   +-- config/                 # db.js (MongoDB connection & fallback)
¦   +-- controllers/            # authController, messageController, userController
¦   +-- middleware/             # authMiddleware (protect, requireRole), validationMiddleware
¦   +-- models/                 # user.js, message.js (Mongoose schemas)
¦   +-- routes/                 # authRoutes, messageRoutes, userRoutes
¦   +-- socket.js               # Socket.IO initialization, auth, and real-time events
¦   +-- test_socket_suite.js    # Automated integration test suite for Socket.IO
¦   +-- server.js               # HTTP server & Express app entrypoint
¦   +-- package.json
+-- docs/                       # Lab experiment documentation
¦   +-- EXPERIMENT-1.md
¦   +-- EXPERIMENT-2.md
¦   +-- EXPERIMENT-6.md
¦   +-- EXPERIMENT-7.md
¦   +-- EXPERIMENT-8.md
+-- README.md                   # Project overview & instructions
```

---

## Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here

# Required for server/makeAdmin.js initial admin creation
ADMIN_PASSWORD=your_initial_admin_password_here
ADMIN_EMAIL=admin@example.com # Optional (defaults to admin@example.com)
```

> **Note:** `ADMIN_PASSWORD` is read by `server/makeAdmin.js` to create an initial administrator account with a secure bcrypt hash without hardcoding credentials in the script. If MongoDB Atlas is unreachable due to IP whitelisting or network restrictions, the server automatically attempts a fallback connection to local MongoDB at `mongodb://127.0.0.1:27017/nextalk`. Never commit actual `.env` files or credentials to Git.

---

## Installation & Running Locally

### 1. Start the Backend Server

```bash
cd server
npm install
node server.js
```

The backend server will start on `http://localhost:5000` with WebSocket support enabled on `ws://localhost:5000`.

### 2. Start the Frontend Client

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The frontend application will be accessible at `http://localhost:5173`.

---

## Running the Automated Socket.IO Test Suite

With the backend server running, execute the automated integration test suite from the `server/` directory:

```bash
cd server
node test_socket_suite.js
```

The test suite validates:
1. REST user registration and JWT authentication for multiple users.
2. Rejection of unauthorized WebSocket connections (missing token and malformed token).
3. Successful JWT-authenticated socket connection.
4. Real-time message exchange via `message:send` and `message:new`.
5. Private room isolation (confirming unrelated users receive zero private packets).
6. Message persistence in MongoDB verified via REST `GET /api/messages/:userId`.
7. Offline recipient handling (messages persist in DB while recipient is disconnected).
8. Input validation and error handling (empty messages and malformed recipient IDs).

---

## Manual Verification Steps (Two Users in Real-Time)

1. Open `http://localhost:5173` in a standard browser window (Session 1).
2. Open `http://localhost:5173` in an Incognito / Private window (Session 2).
3. In Session 1, sign in as User A (or register a new account).
4. In Session 2, register or sign in as User B.
5. In Session 1, select User B from the contacts list and send a message.
6. Observe that the message appears in Session 2 immediately without page reload.
7. Reply from Session 2 and verify Session 1 receives the message instantaneously.
8. Refresh both windows to verify conversation history reloads from MongoDB.
