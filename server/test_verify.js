const http = require("http");
const BASE = "http://localhost:5000";
let authToken = "";
const TEST_EMAIL = `testuser_${Date.now()}@verify.com`;
const TEST_PASS = "TestPass123";

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const url = new URL(BASE + path);
    const options = {
      method, hostname: url.hostname, port: url.port, path: url.pathname,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
      },
    };
    const req = http.request(options, (res) => {
      let raw = "";
      res.on("data", (c) => (raw += c));
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

const pass = (l) => console.log(`  PASS - ${l}`);
const fail = (l, d) => console.log(`  FAIL - ${l}`, d || "");

async function run() {
  console.log("\n=== NexTalk Auth Verification Tests ===\n");

  console.log("TEST B: Login with valid credentials");
  try {
    const r = await request("POST", "/api/auth/login", { email: "alex.demo@example.com", password: "DemoPassword789" });
    if (r.status === 200 && r.body && r.body.token) {
      authToken = r.body.token;
      pass(`Status 200, token received. User: ${r.body.user?.name}`);
    } else { fail(`Expected 200, got ${r.status}`, r.raw); }
  } catch (e) { fail("Request failed - is server running?", e.message); process.exit(1); }

  console.log("\nTEST C: Wrong password");
  try {
    const r = await request("POST", "/api/auth/login", { email: "alex.demo@example.com", password: "WrongPassword" });
    r.status === 401 ? pass("Status 401") : fail(`Expected 401, got ${r.status}`, r.raw);
  } catch (e) { fail("Request failed", e.message); }

  console.log("\nTEST D: Non-existing user");
  try {
    const r = await request("POST", "/api/auth/login", { email: "nobody@nothere.com", password: "AnyPass" });
    r.status === 401 ? pass("Status 401") : fail(`Expected 401, got ${r.status}`, r.raw);
  } catch (e) { fail("Request failed", e.message); }

  console.log(`\nTEST E: Register new user (${TEST_EMAIL})`);
  try {
    const r = await request("POST", "/api/auth/register", { name: "Verify Test User", email: TEST_EMAIL, password: TEST_PASS });
    if (r.status === 201) { pass(`Status 201, user created`); }
    else { fail(`Expected 201, got ${r.status}`, r.raw); }
  } catch (e) { fail("Request failed", e.message); }

  console.log(`\nTEST F: Duplicate email`);
  try {
    const r = await request("POST", "/api/auth/register", { name: "Dup", email: TEST_EMAIL, password: TEST_PASS });
    r.status === 409 ? pass("Status 409 (Conflict)") : fail(`Expected 409, got ${r.status}`, r.raw);
  } catch (e) { fail("Request failed", e.message); }

  console.log("\nTEST G: GET /api/users with token");
  try {
    const r = await request("GET", "/api/users");
    if (r.status === 200 && Array.isArray(r.body)) {
      pass(`Status 200, ${r.body.length} users from DB`);
      console.log(`     Users: ${r.body.map((u) => u.name).join(", ")}`);
    } else { fail(`Expected 200+array, got ${r.status}`, r.raw); }
  } catch (e) { fail("Request failed", e.message); }

  console.log("\n=== Tests Complete ===\n");
}
run().catch(console.error);
