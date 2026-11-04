# 05 Authentication - JWT Example

JWT (JSON Web Token) is a compact, signed token format used for stateless authentication in APIs. After a successful login, the server signs a token and the client sends it in the `Authorization: Bearer <token>` header for protected requests.

This exercise adds JWT-based authentication to the student API.

## What was implemented

- Login endpoint that returns a JWT token.
- JWT middleware that validates Bearer tokens.
- Protected write routes for students:
  - POST /api/students
  - PUT /api/students/:studentNumber
  - PATCH /api/students/:studentNumber
  - DELETE /api/students/:studentNumber

## Environment variables

Use `.env`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
JWT_SECRET=change-this-secret-in-production
```

## Install and run

```bash
npm install
npm run dev
```

## JWT flow in this server

1. Client logs in using student number.
2. Server validates student and signs a JWT.
3. Client stores token (for example in memory or secure storage).
4. Client sends token in Authorization header for protected routes.
5. Middleware verifies token and allows or blocks request.

## Endpoints

### Login

`POST /api/students/login`

Body:

```json
{
  "studentNumber": "XXXX"
}
```

Success response:

```json
{
  "message": "Login successful",
  "token": "<jwt_token>",
  "expiresIn": "1h"
}
```

### Protected routes

Send this header:

```http
Authorization: Bearer <jwt_token>
```

If token is missing or invalid, response is:

```json
{ "error": "Authorization token is missing" }
```

or

```json
{ "error": "Invalid or expired token" }
```

## curl examples

### 1) Login and receive token

```bash
curl -s -X POST http://localhost:3001/api/students/login \
  -H "Content-Type: application/json" \
  -d '{"studentNumber":"A001"}'
```

### 2) Create student (protected)

```bash
TOKEN="paste_token_here"

curl -i -X POST http://localhost:3001/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"studentNumber":"A999","name":"Test User","age":25,"major":"Computer Science"}'
```

### 3) Update student (protected)

```bash
TOKEN="paste_token_here"

curl -i -X PUT http://localhost:3001/api/students/A999 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"studentNumber":"A999","name":"Updated User","age":26,"major":"Software Engineering"}'
```

### 4) Delete student (protected)

```bash
TOKEN="paste_token_here"

curl -i -X DELETE http://localhost:3001/api/students/A999 \
  -H "Authorization: Bearer $TOKEN"
```

## Notes

- This learning example authenticates by student number only.
- For real-world apps, use password hashing (bcrypt) and a proper user auth model.
- Keep JWT_SECRET long, random, and private.
- Use HTTPS in production.

Note: The content of this file was created using GitHub Copilot.
