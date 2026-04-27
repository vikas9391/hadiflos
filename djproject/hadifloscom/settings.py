"""
Django settings for HadiFlosCom – Debt Recovery Platform
"""
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-change-this-in-production-hadifloscom-2026')

DEBUG = os.environ.get('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'claims',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # must be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'hadifloscom.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'hadifloscom.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
        # For PostgreSQL in production:
        # 'ENGINE': 'django.db.backends.postgresql',
        # 'NAME': os.environ.get('DB_NAME', 'hadifloscom'),
        # 'USER': os.environ.get('DB_USER', 'postgres'),
        # 'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        # 'HOST': os.environ.get('DB_HOST', 'localhost'),
        # 'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Casablanca'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── Django REST Framework ──────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '20/hour',
    },
}

# ── CORS ───────────────────────────────────────────────────────────────────────
# Explicit allowlist — required when CORS_ALLOW_CREDENTIALS is True.
# Never use CORS_ALLOW_ALL_ORIGINS = True together with credentials:
# browsers reject wildcard (*) + credentials mode = include.
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

# Required so the browser accepts Set-Cookie from Django on cross-origin requests
CORS_ALLOW_CREDENTIALS = True

# ── Session cookies ────────────────────────────────────────────────────────────
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'   # use 'None' + SESSION_COOKIE_SECURE=True in prod if on different domain
SESSION_COOKIE_AGE = 28800        # 8 hours

# ── CSRF ───────────────────────────────────────────────────────────────────────
CSRF_COOKIE_HTTPONLY = False      # JS must be able to read the token to send it as a header
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
]

# ── Email ──────────────────────────────────────────────────────────────────────
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
# For production SMTP:
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
# EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = 'HadiFlosCom <contact@hadiflouscom.ma>'
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@hadiflouscom.ma')

ALLOWED_HOSTS = ['https://hadiflos-1.onrender.com']
DEBUG = False

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')