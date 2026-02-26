# Simplevue (v1.0)

A simple note-taking app built with Laravel and Vue 3.

## Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 11 |
| Frontend | Vue 3 + Vite |
| Database | MySQL 8 |

## API Endpoints

| Method | URL | Description |
|---|---|---|
| GET | /api/notes | Get all notes |
| POST | /api/notes | Create a note |
| DELETE | /api/notes/{id} | Delete a note |

## Setup

### Backend
```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd web
npm install
npm run dev
```

Visit `http://localhost:5173`