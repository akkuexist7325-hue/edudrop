EduDrop server scaffold

Quick start:

1. Open a terminal and install dependencies:

```bash
cd server
npm install
```

2. Run in dev mode (requires nodemon):

```bash
npm run dev
```

3. Server will listen on http://localhost:3000

Endpoints:
- GET /api/teachers - list teachers
- POST /api/teachers - register teacher (multipart/form-data) field `qr` for QR image
- POST /api/payments/verify - mock payment verification

Notes:
- This scaffold stores teachers in `server/db_teachers.json` and uploaded QR images in `server/uploads/`.
- For production, replace file-based storage with a real DB (SQLite/Postgres) and secure verification.
