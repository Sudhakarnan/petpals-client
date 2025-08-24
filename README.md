# Pet Adoption Platform — Frontend (Vite + React + TailwindCSS)

A responsive React frontend for the Pet Adoption Platform. It supports:

- Auth (login/register/forgot/reset) with JWT persisted in `localStorage`
- Pet search & filtering, pet details with media gallery
- Create/manage **My Pets** (owner dashboard)
- Apply to adopt, track applications (sent/received)
- Favorites (save/unsave)
- Reviews
- Messages (threaded chat, per-pet context)
- Polished UI with TailwindCSS

> **Backend required:** This app talks to the backend at `VITE_API_BASE_URL` (e.g. `http://localhost:5000/api` or your Render URL).

---

## 1) Tech Stack

- **React 18** (Vite)
- **React Router v6**
- **TailwindCSS**
- **Axios** (API client)
- **Context API** (Auth, Toast)
- Optional: Socket ready (if you later add realtime)

---

## 2) Project Structure (key files)

```
src/
├─ api/
│  ├─ apiClient.js              # axios instance; attaches Bearer token
│  ├─ pets.js, applications.js, messages.js, ...
├─ components/
│  ├─ layout/Navbar.jsx
│  ├─ pets/PetCard.jsx
│  ├─ pets/MediaUploader.jsx
│  ├─ reviews/ReviewForm.jsx, ReviewList.jsx
│  ├─ applications/ApplicationForm.jsx
│  └─ ui/Modal.jsx, Spinner.jsx, ...
├─ context/
│  ├─ AuthContext.jsx           # manages user + token
│  └─ ToastContext.jsx
├─ hooks/
│  └─ useQueryParams.js
├─ pages/
│  ├─ Home.jsx
│  ├─ Search.jsx
│  ├─ PetDetails.jsx
│  ├─ DashboardAdopter.jsx
│  ├─ Applications.jsx
│  ├─ Messages.jsx
│  ├─ Favorites.jsx
│  ├─ Profile.jsx
│  └─ auth/Login.jsx Register.jsx ForgotPassword.jsx ResetPassword.jsx
├─ App.jsx                      # routes, guards
└─ main.jsx
```

---

## 3) Prerequisites

- Node.js **18+**
- The backend running (local or hosted)

---

## 4) Setup

```bash
# from pet-adoption-frontend/
npm install

# copy env and edit
cp .env.example .env
# Windows: copy .env.example .env
```

**.env**
```env
# must include /api at the end
VITE_API_BASE_URL=http://localhost:5000/api
```

If you deploy backend (e.g., Render), set:
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## 5) Run

```bash
# dev server (Vite)
npm run dev

# build for production
npm run build

# preview built files
npm run preview
```

Vite dev opens at http://localhost:5173.

---

## 6) Authentication Notes

- After login/register, the token is saved to `localStorage` under `token`.
- `src/api/apiClient.js` attaches `Authorization: Bearer <token>` on all requests.
- Protected pages are wrapped by a route guard in `App.jsx` (**ProtectedShell**).
- If you see 401s in production, confirm:
  - `VITE_API_BASE_URL` points to the **/api** base.
  - The backend’s `JWT_SECRET` matches the token issuer.
  - CORS on the backend allows your frontend origin.

---

## 7) Media URLs (pet photos)

The backend serves files at `/uploads/...`. If you store relative paths, convert to absolute when rendering:

```js
import { API_BASE_URL } from './api/apiClient' // ends with /api

export const mediaUrl = (p) => {
  if (!p) return ''
  if (p.startsWith('/uploads/')) {
    const base = new URL(API_BASE_URL).origin
    return base + p
  }
  return p
}
```

---

## 8) Demo Users

The login page includes buttons for:
- **Test User 1** — `testuser1@gmail.com` / `test@123`
- **Test User 2** — `testuser2@gmail.com` / `test@123`

> Create these users once (via Register) in your environment if they don’t exist.

---

## 9) Deployment (Netlify)

- Build command: `npm run build`
- Publish directory: `dist`
- Env var: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

---

## 10) Troubleshooting

- **CORS error:** Backend must include your site in `CLIENT_URL(S)`.
- **401 Unauthorized:** Make sure you are logged in on this environment; token must be issued by the same backend you call.
- **Images not showing:** Your pet photo path should be `/uploads/filename`. Use the `mediaUrl` helper to prefix with backend origin.

---

## 11) Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 12) License

MIT (use freely in coursework or projects)
