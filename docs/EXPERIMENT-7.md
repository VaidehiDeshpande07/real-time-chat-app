# EXPERIMENT 7: API Testing Using Postman

---

## 1. Aim
To perform comprehensive functional, security, and edge-case testing of the NexTalk REST API using Postman, verifying request payloads, HTTP methods, headers, authentication via JWT Bearer tokens, role-based authorization, and response status codes.

---

## 2. Theory
API testing involves validating Application Programming Interfaces to determine whether they meet expectations for functionality, reliability, performance, and security.

### 2.1 Postman Tool Overview
Postman is an industry-standard API client and testing platform that enables developers to:
* Construct and execute HTTP requests (`GET`, `POST`, `PUT`, `DELETE`).
* Inspect headers, status codes, response payloads, and execution latencies.
* Manage environment variables (e.g., `{{base_url}}`, `{{jwt_token}}`) for automated token passing.
* Verify security barriers such as input validation rules, authentication tokens, and access control lists.

### 2.2 HTTP Status Codes Observed
* **`200 OK`:** Request succeeded, data retrieved or processed.
* **`201 Created`:** New entity (user account, chat message) created successfully.
* **`400 Bad Request`:** Client request failed input schema validation (missing/invalid fields).
* **`401 Unauthorized`:** Token missing, expired, or cryptographically invalid.
* **`403 Forbidden`:** Valid authenticated user lacks sufficient role privileges (`USER` attempting `ADMIN` action).
* **`409 Conflict`:** Resource already exists (e.g., duplicate email address).
* **`500 Internal Server Error`:** Unhandled server exception.

---

## 3. APIs Tested

| # | Endpoint | Method | Protection Level | Purpose |
|---|----------|--------|------------------|---------|
| 1 | `/api/users` | `POST` | Public | Register new user account |
| 2 | `/api/auth/login` | `POST` | Public | Authenticate user and obtain JWT token |
| 3 | `/api/users` | `GET` | `protect` (JWT) | List registered users excluding passwords |
| 4 | `/api/messages/:userId` | `GET` | `protect` (JWT) | Retrieve conversation messages with another user |
| 5 | `/api/messages` | `POST` | `protect` (JWT) | Send a direct message to another user |
| 6 | `/api/users/admin` | `GET` | `protect` + `requireRole("ADMIN")` | Access admin dashboard statistics |

---

## 4. Test Cases & Execution Details

### Test Case 1: User Registration (`POST /api/users`)

#### 1.1 Valid Registration (Success)
* **URL:** `http://localhost:5000/api/users`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "name": "Sarah Connor",
    "email": "sarah.connor@example.com",
    "password": "password123"
  }
  ```
* **Expected Status Code:** `201 Created`
* **Response Body:**
  ```json
  {
    "_id": "6ac53f5cb5a526f8361f75ae",
    "name": "Sarah Connor",
    "email": "sarah.connor@example.com",
    "status": "offline",
    "role": "USER",
    "createdAt": "2026-10-06T18:35:08.527Z",
    "updatedAt": "2026-10-06T18:35:08.527Z"
  }
  ```

#### 1.2 Missing Required Fields (Failure)
* **Request Body:** `{"name": ""}`
* **Expected Status Code:** `400 Bad Request`
* **Response Body:**
  ```json
  {
    "message": "Validation failed",
    "errors": [
      { "msg": "Name is required", "path": "name" },
      { "msg": "Please enter a valid email", "path": "email" },
      { "msg": "Password must be at least 6 characters", "path": "password" }
    ]
  }
  ```

#### 1.3 Duplicate Email Registration (Failure)
* **Request Body:** Same email as 1.1.
* **Expected Status Code:** `409 Conflict`
* **Response Body:**
  ```json
  { "message": "User with this email already exists" }
  ```

---

### Test Case 2: User Login (`POST /api/auth/login`)

#### 2.1 Valid Credentials (Success)
* **URL:** `http://localhost:5000/api/auth/login`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "email": "sarah.connor@example.com",
    "password": "password123"
  }
  ```
* **Expected Status Code:** `200 OK`
* **Response Body:**
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6ac53f5cb5a526f8361f75ae",
      "name": "Sarah Connor",
      "email": "sarah.connor@example.com",
      "status": "offline",
      "role": "USER"
    }
  }
  ```

#### 2.2 Invalid Password (Failure)
* **Request Body:** `{"email": "sarah.connor@example.com", "password": "wrongpassword"}`
* **Expected Status Code:** `401 Unauthorized`
* **Response Body:**
  ```json
  { "message": "Invalid email or password" }
  ```

#### 2.3 Non-Existent User (Failure)
* **Request Body:** `{"email": "nonexistent@example.com", "password": "password123"}`
* **Expected Status Code:** `401 Unauthorized`
* **Response Body:**
  ```json
  { "message": "Invalid email or password" }
  ```

---

### Test Case 3: Get Users (`GET /api/users`)

#### 3.1 With Valid JWT Token (Success)
* **URL:** `http://localhost:5000/api/users`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <VALID_JWT_TOKEN>`
* **Expected Status Code:** `200 OK`
* **Response Body:** Array of registered user objects (with `password` excluded).

#### 3.2 Without Token (Failure)
* **Headers:** None
* **Expected Status Code:** `401 Unauthorized`
* **Response Body:**
  ```json
  { "message": "Not authorized, token missing" }
  ```

#### 3.3 With Invalid/Tampered Token (Failure)
* **Headers:** `Authorization: Bearer invalid.token.payload`
* **Expected Status Code:** `401 Unauthorized`
* **Response Body:**
  ```json
  { "message": "Not authorized, invalid token" }
  ```

---

### Test Case 4: Send Message (`POST /api/messages`)

#### 4.1 Valid Message Delivery (Success)
* **URL:** `http://localhost:5000/api/messages`
* **Method:** `POST`
* **Headers:**
  * `Authorization: Bearer <VALID_USER_TOKEN>`
  * `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "receiver": "6ac53f919bbceeacecc2d8fa",
    "content": "Hello Administrator from normal user!"
  }
  ```
* **Expected Status Code:** `201 Created`
* **Response Body:**
  ```json
  {
    "_id": "6ac53f91b5a526f8361f75af",
    "sender": {
      "_id": "6ac53f919bbceeacecc2d8fb",
      "name": "Sarah Connor",
      "email": "sarah.connor@example.com"
    },
    "receiver": {
      "_id": "6ac53f919bbceeacecc2d8fa",
      "name": "System Admin",
      "email": "admin@nextalk.app"
    },
    "content": "Hello Administrator from normal user!",
    "createdAt": "2026-10-06T18:36:01.685Z",
    "updatedAt": "2026-10-06T18:36:01.685Z"
  }
  ```

---

### Test Case 5: Get Messages (`GET /api/messages/:userId`)

#### 5.1 Fetch Active Conversation (Success)
* **URL:** `http://localhost:5000/api/messages/6ac53f919bbceeacecc2d8fa`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <VALID_USER_TOKEN>`
* **Expected Status Code:** `200 OK`
* **Response Body:** Array of ordered messages exchanged between the logged-in user and `:userId`.

---

### Test Case 6: Admin-Only Endpoint (`GET /api/users/admin`)

#### 6.1 Admin Access with Valid ADMIN Token (Success)
* **URL:** `http://localhost:5000/api/users/admin`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Expected Status Code:** `200 OK`
* **Response Body:**
  ```json
  {
    "message": "Admin dashboard access granted",
    "adminUser": {
      "id": "6ac53f919bbceeacecc2d8fa",
      "role": "ADMIN"
    },
    "stats": {
      "totalUsers": 6,
      "onlineUsers": 3,
      "adminUsers": 1
    }
  }
  ```

#### 6.2 Standard User Access (Role Forbidden)
* **URL:** `http://localhost:5000/api/users/admin`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <USER_JWT_TOKEN>`
* **Expected Status Code:** `403 Forbidden`
* **Response Body:**
  ```json
  {
    "message": "Forbidden: You do not have permission to access this resource"
  }
  ```

#### 6.3 Missing Token (Unauthorized)
* **URL:** `http://localhost:5000/api/users/admin`
* **Method:** `GET`
* **Headers:** None
* **Expected Status Code:** `401 Unauthorized`
* **Response Body:**
  ```json
  {
    "message": "Not authorized, token missing"
  }
  ```

---

## 5. Summary of Test Results

| Test Case | Scenario | Expected Status | Actual Status | Result |
|-----------|----------|-----------------|---------------|--------|
| TC-01 | Register with valid credentials | 201 Created | 201 Created | **PASS** |
| TC-02 | Register with empty required fields | 400 Bad Request | 400 Bad Request | **PASS** |
| TC-03 | Register with duplicate email | 409 Conflict | 409 Conflict | **PASS** |
| TC-04 | Attempt self-assigning ADMIN role on register | Role forced to `USER` | Role is `USER` | **PASS** |
| TC-05 | Login with valid credentials | 200 OK | 200 OK | **PASS** |
| TC-06 | Login with incorrect password | 401 Unauthorized | 401 Unauthorized | **PASS** |
| TC-07 | Login with non-existent user | 401 Unauthorized | 401 Unauthorized | **PASS** |
| TC-08 | Fetch users without token | 401 Unauthorized | 401 Unauthorized | **PASS** |
| TC-09 | Fetch users with invalid token | 401 Unauthorized | 401 Unauthorized | **PASS** |
| TC-10 | Fetch users with valid JWT token | 200 OK | 200 OK | **PASS** |
| TC-11 | Admin endpoint with `ADMIN` token | 200 OK | 200 OK | **PASS** |
| TC-12 | Admin endpoint with `USER` token | 403 Forbidden | 403 Forbidden | **PASS** |
| TC-13 | Admin endpoint without token | 401 Unauthorized | 401 Unauthorized | **PASS** |
| TC-14 | Send direct message with valid token | 201 Created | 201 Created | **PASS** |
| TC-15 | Retrieve message thread with valid token | 200 OK | 200 OK | **PASS** |

---

## 6. Conclusion
Experiment 7 successfully validated the NexTalk REST API using automated Postman-compatible HTTP test cases. All endpoints behave strictly in compliance with RESTful conventions and security specifications. Authentication and authorization layers correctly shield protected resources with appropriate HTTP status codes (`200`, `201`, `400`, `401`, `403`, `409`).