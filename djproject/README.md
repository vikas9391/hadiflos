# HadiFlosCom – Debt Recovery Platform

A full-stack debt recovery website for Morocco, built with **React** (frontend) and **Django REST Framework** (backend).

---

## Project Structure

```
hadifloscom/
├── frontend/          ← React app (Vite or CRA)
│   └── src/
│       └── App.jsx    ← Main component (HadiFlosCom.jsx)
└── backend/           ← Django project
    ├── manage.py
    ├── requirements.txt
    ├── hadifloscom/   ← Django project config
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    └── claims/        ← Main app
        ├── models.py
        ├── serializers.py
        ├── views.py
        ├── urls.py
        └── admin.py
```

---

## Backend Setup (Django)

### 1. Create virtual environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run migrations
```bash
python manage.py makemigrations claims
python manage.py migrate
```

### 4. Create superuser (for /admin)
```bash
python manage.py createsuperuser
```

### 5. Start the development server
```bash
python manage.py runserver
```

Backend runs on: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/claims/` | Submit a new claim |
| GET | `/api/claims/status/<ref>/` | Track claim by reference |
| POST | `/api/contact/` | Send a contact message |
| GET | `/api/health/` | Health check |

### Submit a Claim (POST /api/claims/)
```json
{
  "full_name": "Mohammed Alami",
  "company_name": "Alami Sarl",
  "email": "m.alami@example.com",
  "phone": "+212 6XX-XXXXXX",
  "debtor_name": "XYZ Company",
  "debtor_location": "Casablanca, Morocco",
  "amount_owed": "50000.00",
  "debt_type": "invoice",
  "description": "Unpaid invoices for services rendered in Q1 2026.",
  "preferred_language": "fr"
}
```

### Response
```json
{
  "message": "Claim submitted successfully. Our team will contact you within 24 hours.",
  "reference_number": "HFC-482910",
  "claim": { ... }
}
```

---

## Frontend Setup (React)

### Using Vite (recommended)
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

Replace `src/App.jsx` with the provided `HadiFlosCom.jsx`.

### Connect to Django API
In your React component, update the form submit handler to call the real endpoint:
```js
const res = await fetch('http://localhost:8000/api/claims/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
const data = await res.json();
```

### Start React dev server
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Production Deployment

### Environment variables (.env)
```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Collect static files
```bash
python manage.py collectstatic
```

### Run with Gunicorn
```bash
gunicorn hadifloscom.wsgi:application --bind 0.0.0.0:8000
```

### Nginx config (example)
```nginx
server {
    server_name yourdomain.com;
    
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }
    
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }
    
    location / {
        root /var/www/hadifloscom/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Claim Status Flow

```
NEW → UNDER_REVIEW → IN_PROGRESS → NEGOTIATION → SETTLED
                                 ↘ LEGAL → SETTLED
                                           ↘ CLOSED
```

---

## Tech Stack

- **Frontend**: React 18, Vite, Google Fonts (Playfair Display + Outfit)
- **Backend**: Django 4.2, Django REST Framework, django-cors-headers
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Email**: Django email backend (console in dev, SMTP in prod)
- **Admin**: Django Admin with custom display
