# Online Assignment Portal (Runnable ZIP)

This archive contains a full-stack project with:

- Backend: Node.js + Express + MongoDB (GridFS) for file storage
- Frontend: React + Vite + Tailwind CSS

## Quick start (local dev)

### Prerequisites
- Node.js (18+ recommended)
- MongoDB running locally (or update MONGO_URI in backend/.env to your Atlas URI)

### Backend
```bash
cd backend
npm install
# edit .env and set SMTP credentials if you want email
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open the frontend dev server (Vite) URL shown in terminal (usually http://localhost:5173) and use the app.

## Notes
- This is a starter project: for production, enable HTTPS, secure SMTP, validate file types & sizes, and consider using S3 for files.
- If GridFS upload fails, check your MongoDB is accessible at the MONGO_URI.
