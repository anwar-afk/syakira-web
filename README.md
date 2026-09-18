# Syakira Berkah — Frontend

React (Create React App) untuk website Yayasan Syakira Berkah.

## Setup

```bash
npm install
cp .env.example .env
npm start
```

App berjalan di [http://localhost:3000](http://localhost:3000).

## Environment

| Variabel | Default | Keterangan |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:5000` | Base URL backend API |

Contoh `.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Setelah mengubah `.env`, restart `npm start`.

Konfigurasi dibaca di `src/config/api.js` dan dipakai oleh `src/api/apiClient.js` (timeout 15s, header JSON, Bearer token, interceptor 401).

## Scripts

| Perintah | Fungsi |
|---|---|
| `npm start` | Dev server |
| `npm run build` | Build production |
| `npm test` | Test runner |

## Catatan API

- Auth session: `GET /api/auth/me`
- Campaign by id: `GET /api/campaigns/:id`
- Dokumentasi & campaign CRUD lewat `src/services/*`
