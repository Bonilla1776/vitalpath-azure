"""
Django settings for app project.
Production-ready and Azure-compatible with decouple support.
Enhanced with JWT token refresh and security features.
"""

from decouple import config
from pathlib import Path
from datetime import timedelta
import os

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY
SECRET_KEY = config("DJANGO_SECRET_KEY", default="dev-key-change-in-production")
DEBUG = config("DEBUG", default="False", cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost,127.0.0.1,vitalpath-backend.azurewebsites.net,vitalpathinnovations.com,app.vitalpathinnovations.com").split(",")

# APPLICATIONS
INSTALLED_APPS = [
    'corsheaders',
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",  # 🔥 NEW: Token blacklisting for security
    "users",
    'consent',
    'discovery',
    'dashboard',
]

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Only allow all origins in debug mode
CORS_ALLOWED_ORIGINS = [
    "https://vitalpathinnovations.com",
    "https://app.vitalpathinnovations.com",
    "https://vitalpath-frontend.azurewebsites.net",
    "http://localhost:3000",  # For local development
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    "authorization",
    "content-type",
    "x-csrftoken",
    "accept",
    "origin",
    "user-agent",
    "accept-encoding",
    "accept-language",
]

CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
]

# MIDDLEWARE
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# URL and WSGI
ROOT_URLCONF = "app.urls"
WSGI_APPLICATION = "app.wsgi.application"

# DATABASES with better error handling
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("POSTGRES_DB", default="flexibleserverdb"),
        "USER": config("POSTGRES_USER", default="vitaladmin"),
        "PASSWORD": config("POSTGRES_PASSWORD", default=""),
        "HOST": config("POSTGRES_HOST", default="vitalpath-db.postgres.database.azure.com"),  # 🔥 FIXED: Corrected hostname
        "PORT": config("POSTGRES_PORT", default="5432"),
        "OPTIONS": {
            "sslmode": "require",
            "connect_timeout": 60,
        },
        "CONN_MAX_AGE": 0,  # Don't persist connections
    }
}

# Add database connection test
try:
    import psycopg2
    if not config("POSTGRES_PASSWORD", default=""):
        print("WARNING: POSTGRES_PASSWORD not set!")
except ImportError:
    print("WARNING: psycopg2 not installed!")

AUTH_USER_MODEL = "users.CustomUser"

# TEMPLATES
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# PASSWORD VALIDATION
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# LOCALIZATION
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# STATIC FILES
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# DEFAULT PRIMARY KEY
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# 🔥 ENHANCED JWT Authentication with Token Refresh Magic
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    # Remove default permission requirement - let views decide individually
}

SIMPLE_JWT = {
    # 🕐 Token lifetimes - Optimized for security and UX
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),  # Short-lived for security
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),     # Longer-lived for convenience
    
    # 🔄 Token rotation and security
    "ROTATE_REFRESH_TOKENS": True,                   # Generate new refresh token on refresh
    "BLACKLIST_AFTER_ROTATION": True,               # Blacklist old refresh tokens for security
    "UPDATE_LAST_LOGIN": True,                       # Update user's last_login on token refresh
    
    # 🔐 Token configuration
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    
    # 📋 Token headers and claims
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",
    
    # 🎫 Token types and claims
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",
    "JTI_CLAIM": "jti",
    
    # 🔄 Sliding tokens (keeps tokens fresh automatically)
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=15),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
    
    # 🛡️ Additional security settings
    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
}

# LOGGING with enhanced JWT debugging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
        # 🔍 JWT-specific logging for debugging token issues
        'rest_framework_simplejwt': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
    },
}

# 🛡️ Enhanced Security settings for production
if not DEBUG:
    # Security headers
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # SSL/TLS settings
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    
    # Additional security headers
    SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
    SECURE_CROSS_ORIGIN_OPENER_POLICY = 'same-origin'

# 🎯 Rate limiting (optional but recommended for token endpoints)
# You can add django-ratelimit if needed for additional security

# 📊 Performance monitoring (optional)
# Add APM/monitoring configuration here if using services like Sentry

# 🔄 Cache configuration (optional for better performance)
# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.redis.RedisCache',
#         'LOCATION': 'redis://127.0.0.1:6379/1',
#     }
# }

print("🚀 VitalPath Django settings loaded successfully!")
print(f"🔐 JWT Access Token Lifetime: {SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']}")
print(f"🔄 JWT Refresh Token Lifetime: {SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']}")
print(f"🛡️ Token Rotation Enabled: {SIMPLE_JWT['ROTATE_REFRESH_TOKENS']}")
if DEBUG:
    print("⚠️  DEBUG MODE ENABLED - Use production settings for deployment!")
