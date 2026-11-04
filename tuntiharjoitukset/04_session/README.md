# 04 Authentication - Express Session Example

Note: The content of this file was created using GitHub Copilot.

This project extends the REST API exercise by adding session-based authentication with:

- express-session
- connect-mongo
- MongoDB (Mongoose)

## What is express-session?

`express-session` creates a server-side session object for each client.

- A client logs in once.
- The server stores session data (for example `userId`) in a session store.
- The browser stores only a session ID cookie.
- On the next request, the cookie is sent back and the server restores `req.session`.

In this project, sessions are saved in MongoDB using `connect-mongo`, so sessions survive server restarts.

## How this server is configured

Session middleware is configured in `server.js` before routes:

- `secret`: signs the session ID cookie.
- `resave: false`: avoids writing unchanged sessions.
- `saveUninitialized: false`: does not create empty sessions.
- `store: MongoStore(...)`: stores sessions in MongoDB.
- `cookie.httpOnly: true`: protects cookie from JavaScript access.
- `cookie.secure`: enabled in production.
- `cookie.maxAge`: 1 week.

Because middleware is registered globally, every route can access `req.session`.

## Environment variables

Create/update `.env`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
SESSION_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
```

## Install and run

```bash
npm install
npm run dev
```

## Session flow in this project

### 1. Login

Endpoint:

- `POST /api/students/login`

Body:

```json
{
  "studentNumber": "XXXX"
}
```

What happens:

- Server finds student by student number.
- Server sets:
  - `req.session.userId`
  - `req.session.studentNumber`
- Session is persisted to MongoDB.
- Client receives a session cookie.

### 2. Use protected routes

Protected routes require a valid session (`requireLogin` middleware):

- `GET /api/students/profile`
- `POST /api/students`
- `PUT /api/students/:studentNumber`
- `PATCH /api/students/:studentNumber`
- `DELETE /api/students/:studentNumber`

If session is missing, server responds:

```json
{ "error": "Authentication required" }
```

### 3. Logout

Endpoint:

- `POST /api/students/logout`

What happens:

- `req.session.destroy(...)` removes session from store.
- Client cookie becomes unusable for authenticated routes.

## Example with curl

Login (save cookie):

```bash
curl -i -c cookie.txt \
  -H "Content-Type: application/json" \
  -d '{"studentNumber":"A001"}' \
  http://localhost:3001/api/students/login
```

Call protected route with cookie:

```bash
curl -i -b cookie.txt http://localhost:3001/api/students/profile
```

Logout:

```bash
curl -i -b cookie.txt -X POST http://localhost:3001/api/students/logout
```


## Common real-life session use cases

Sessions are widely used when an app needs short-term, per-user state on the server side.

1. User login state
- Keep users signed in between requests after authentication.
- Store small identifiers like `userId`, role, or organization ID.

2. Access control and permissions
- Check role-based access (admin, teacher, student, support).
- Avoid sending sensitive permission logic to the client.

3. Shopping carts and checkout
- Keep cart contents for anonymous or logged-in users.
- Preserve cart while user moves through product, address, and payment pages.

4. Multi-step forms and onboarding
- Save progress across steps (profile setup, KYC, registration wizard).
- Recover state if a user refreshes or briefly leaves the flow.

5. CSRF and security workflows
- Bind CSRF tokens to a user session.
- Track login attempts, MFA challenge state, and recent auth events.

6. Personalization preferences
- Store language, region, timezone, UI preferences, or feature flags.
- Keep behavior consistent without forcing database writes on every change.

7. Temporary workflow context
- Keep selected workspace, filters, or report parameters.
- Useful in admin dashboards where users switch screens frequently.

8. Rate limiting or anti-abuse context
- Track lightweight request history per session for basic abuse protection.
- Combine with IP/user-level controls for stronger enforcement.

9. OAuth/social login handshake state
- Store nonce/state during OAuth redirects to prevent replay or tampering.
- Complete provider callback securely when user returns.

10. Support and impersonation tools
- Let support staff safely impersonate a user in a controlled session.
- Keep audit trail fields in session for accountability.

Practical rule: store only minimal, non-sensitive data in session (IDs and flags), and fetch full records from the database when needed.
