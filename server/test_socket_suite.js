const http = require("http");
const { io } = require("socket.io-client");

const BASE = "http://localhost:5000";

function apiRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const url = new URL(BASE + path);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
      },
    };
    const req = http.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        let json = null;
        try { json = JSON.parse(raw); } catch (_) {}
        resolve({ status: res.statusCode, body: json, raw });
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

let passed = 0;
let failed = 0;

function assert(condition, testName, detail = "") {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName} - ${detail}`);
    failed++;
  }
}

async function run() {
  console.log("\n========================================================");
  console.log("  NexTalk Experiment 8: Socket.IO Real-Time Test Suite  ");
  console.log("========================================================\n");

  const ts = Date.now();

  // Step 1: Register and login User A
  console.log("1. Setting up User A...");
  const emailA = `user_a_${ts}@test.com`;
  const regResA = await apiRequest("POST", "/api/users", {
    name: "User A (Sender)",
    email: emailA,
    password: "Password123",
  });
  assert(regResA.status === 201, "User A registered via REST", `Status: ${regResA.status}`);
  const userA = regResA.body;

  const loginResA = await apiRequest("POST", "/api/auth/login", {
    email: emailA,
    password: "Password123",
  });
  assert(loginResA.status === 200 && loginResA.body?.token, "User A login via REST", `Status: ${loginResA.status}`);
  const tokenA = loginResA.body.token;

  // Step 2: Register and login User B
  console.log("2. Setting up User B...");
  const emailB = `user_b_${ts}@test.com`;
  const regResB = await apiRequest("POST", "/api/users", {
    name: "User B (Recipient)",
    email: emailB,
    password: "Password123",
  });
  assert(regResB.status === 201, "User B registered via REST", `Status: ${regResB.status}`);
  const userB = regResB.body;

  const loginResB = await apiRequest("POST", "/api/auth/login", {
    email: emailB,
    password: "Password123",
  });
  assert(loginResB.status === 200 && loginResB.body?.token, "User B login via REST", `Status: ${loginResB.status}`);
  const tokenB = loginResB.body.token;

  // Step 3: Register and login User C (unrelated third party)
  console.log("3. Setting up User C (Unrelated Observer)...");
  const emailC = `user_c_${ts}@test.com`;
  const regResC = await apiRequest("POST", "/api/users", {
    name: "User C (Observer)",
    email: emailC,
    password: "Password123",
  });
  assert(regResC.status === 201, "User C registered via REST", `Status: ${regResC.status}`);
  const userC = regResC.body;

  const loginResC = await apiRequest("POST", "/api/auth/login", {
    email: emailC,
    password: "Password123",
  });
  assert(loginResC.status === 200 && loginResC.body?.token, "User C login via REST", `Status: ${loginResC.status}`);
  const tokenC = loginResC.body.token;

  // Step 4: Test Unauthorized Socket Connections
  console.log("\n4. Testing Unauthorized Socket Connections...");

  // 4a. No token
  await new Promise((resolve) => {
    const socketNoAuth = io(BASE, { reconnection: false });
    socketNoAuth.on("connect", () => {
      assert(false, "Socket connection WITHOUT token rejected", "Connected unexpectedly");
      socketNoAuth.disconnect();
      resolve();
    });
    socketNoAuth.on("connect_error", (err) => {
      assert(true, "Socket connection WITHOUT token correctly rejected", err.message);
      socketNoAuth.disconnect();
      resolve();
    });
  });

  // 4b. Invalid token
  await new Promise((resolve) => {
    const socketBadToken = io(BASE, {
      auth: { token: "invalid.jwt.token" },
      reconnection: false,
    });
    socketBadToken.on("connect", () => {
      assert(false, "Socket connection with INVALID token rejected", "Connected unexpectedly");
      socketBadToken.disconnect();
      resolve();
    });
    socketBadToken.on("connect_error", (err) => {
      assert(true, "Socket connection with INVALID token correctly rejected", err.message);
      socketBadToken.disconnect();
      resolve();
    });
  });

  // Step 5: Test Authenticated Socket Connections
  console.log("\n5. Testing Authenticated Socket Connections...");

  const socketA = io(BASE, { auth: { token: tokenA }, reconnection: false });
  const socketB = io(BASE, { auth: { token: tokenB }, reconnection: false });
  const socketC = io(BASE, { auth: { token: tokenC }, reconnection: false });

  await Promise.all([
    new Promise((resolve) => socketA.on("connect", resolve)),
    new Promise((resolve) => socketB.on("connect", resolve)),
    new Promise((resolve) => socketC.on("connect", resolve)),
  ]);

  assert(socketA.connected, "Socket A connected with User A JWT");
  assert(socketB.connected, "Socket B connected with User B JWT");
  assert(socketC.connected, "Socket C connected with User C JWT");

  // Step 6: Test Real-Time Private Messaging & Privacy Isolation
  console.log("\n6. Testing Real-Time Messaging & Private Delivery Isolation...");

  let messageReceivedByB = null;
  let messageReceivedByC = null;

  socketB.on("message:new", (msg) => {
    messageReceivedByB = msg;
  });

  socketC.on("message:new", (msg) => {
    messageReceivedByC = msg;
  });

  const testContent1 = `Hello User B! Real-time message timestamp: ${Date.now()}`;

  // User A sends message to User B
  const sendAck = await new Promise((resolve) => {
    socketA.emit(
      "message:send",
      { receiver: userB._id, content: testContent1 },
      (ack) => resolve(ack)
    );
  });

  assert(sendAck && sendAck.status === "ok", "Server acknowledged message:send", JSON.stringify(sendAck));

  // Wait for event delivery
  await sleep(400);

  assert(
    messageReceivedByB && messageReceivedByB.content === testContent1,
    "Recipient (User B) received message:new in real-time",
    messageReceivedByB?.content
  );

  assert(
    messageReceivedByC === null,
    "Unrelated User C did NOT receive the private message (Privacy Isolation verified)",
    JSON.stringify(messageReceivedByC)
  );

  // Step 7: Test MongoDB Persistence
  console.log("\n7. Testing MongoDB Message Persistence...");
  const historyRes = await apiRequest("GET", `/api/messages/${userB._id}`, null, tokenA);
  assert(
    historyRes.status === 200 && Array.isArray(historyRes.body),
    "GET /api/messages/:userId returns 200 array",
    `Status: ${historyRes.status}`
  );

  const foundInDB = historyRes.body.find((m) => m.content === testContent1);
  assert(
    Boolean(foundInDB),
    "Message is persisted in MongoDB and retrievable via REST API",
    `Messages in thread: ${historyRes.body?.length}`
  );

  // Step 8: Offline Recipient Test
  console.log("\n8. Testing Offline Recipient Handling...");
  console.log("   Disconnecting User B socket...");
  socketB.disconnect();
  await sleep(200);

  const testContentOffline = `Message to offline User B: ${Date.now()}`;
  const offlineAck = await new Promise((resolve) => {
    socketA.emit(
      "message:send",
      { receiver: userB._id, content: testContentOffline },
      (ack) => resolve(ack)
    );
  });

  assert(offlineAck && offlineAck.status === "ok", "Message sent and persisted even when recipient is offline");

  // Verify offline message exists in DB
  const historyAfterOffline = await apiRequest("GET", `/api/messages/${userB._id}`, null, tokenA);
  const foundOfflineMsg = historyAfterOffline.body.find((m) => m.content === testContentOffline);
  assert(
    Boolean(foundOfflineMsg),
    "Offline message successfully persisted in MongoDB and available in conversation history"
  );

  // Step 9: Validation & Error Handling
  console.log("\n9. Testing Validation & Error Handling...");
  const emptyContentAck = await new Promise((resolve) => {
    socketA.emit("message:send", { receiver: userB._id, content: "   " }, (ack) => resolve(ack));
  });
  assert(
    emptyContentAck?.status === "error",
    "Empty message rejected with error",
    emptyContentAck?.message
  );

  const badReceiverAck = await new Promise((resolve) => {
    socketA.emit("message:send", { receiver: "invalid_id_123", content: "Hello" }, (ack) => resolve(ack));
  });
  assert(
    badReceiverAck?.status === "error",
    "Invalid recipient ID rejected with error",
    badReceiverAck?.message
  );

  // Clean up remaining sockets
  socketA.disconnect();
  socketC.disconnect();

  console.log("\n========================================================");
  console.log(`  Tests Completed: ${passed} PASSED, ${failed} FAILED  `);
  console.log("========================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Test suite fatal error:", err);
  process.exit(1);
});
