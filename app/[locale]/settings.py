from pathlib import Path
import os
from django.conf import settings
from datetime import timedelta
from dotenv import load_dotenv
from import_export.formats.base_formats import CSV, XLSX

IMPORT_FORMATS = [CSV, XLSX]
EXPORT_FORMATS = [CSV, XLSX]

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
CORS_ALLOW_ALL_ORIGINS = True
SECRET_KEY = 'django-insecure-voq(is89b&38ntkz1xse#tbl8%er&+gn=3&1r$_5s_9jy2so)+'
DEBUG = False

ALLOWED_HOSTS = ["e-conneq.com", "apibrains.e-conneq.com","apijoan.e-conneq.com", "apikings.e-conneq.com", "apivishi.e-conneq.com"]
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = "user_control.CustomUser"

REST_FRAMEWORK = {
    "EXCEPTION_HANDLER": "myproject.custom_methods.custom_exception_handler",
    "DEFAULT_AUTHENTICATION_CLASSES": ('rest_framework_simplejwt.authentication.JWTAuthentication',),
    # "DEFAULT_AUTHENTICATION_CLASSES": ('higher_control.user_control.serializers.CsrfExemptSessionAuthentication',),
}

SHARED_APPS = [
    'django_tenants',  # mandatory
    'tenant',
    'jazzmin',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_filters',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_rest_passwordreset',
    'import_export',
    'advanced_filters',
    'django_crontab',
    'dbbackup',

    # FOR HIGHER
    'higher_control.user_control.apps.UserControlConfig',
    'higher_control.app_control.apps.AppControlConfig',
    'higher_control.fees_control.apps.FeesControlConfig',
    'higher_control.noti_control.apps.NotiControlConfig',
    'higher_control.time_control.apps.TimeControlConfig',
    # FOR SECONDARY
    'secondary_control.sec_user_control.apps.SecUserControlConfig',
    'secondary_control.sec_app_control.apps.SecAppControlConfig',
    'secondary_control.sec_fees_control.apps.SecFeesControlConfig',
    # FOR PRIMARY
    'primary_control.prim_user_control.apps.PrimUserControlConfig',
    'primary_control.prim_app_control.apps.PrimAppControlConfig',
    'primary_control.prim_fees_control.apps.PrimFeesControlConfig',
    # FOR VOCATIONAL
]

TENANT_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.sessions',
    'django.contrib.messages',

    # tenant-specific apps
    'jazzmin',
    'django_filters',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',

    # FOR HIGHER
    'higher_control.user_control.apps.UserControlConfig',
    'higher_control.app_control.apps.AppControlConfig',
    'higher_control.fees_control.apps.FeesControlConfig',
    'higher_control.noti_control.apps.NotiControlConfig',
    'higher_control.time_control.apps.TimeControlConfig',
    # FOR SECONDARY
    'secondary_control.sec_user_control.apps.SecUserControlConfig',
    'secondary_control.sec_app_control.apps.SecAppControlConfig',
    'secondary_control.sec_fees_control.apps.SecFeesControlConfig',
    # FOR PRIMARY
    'primary_control.prim_user_control.apps.PrimUserControlConfig',
    'primary_control.prim_app_control.apps.PrimAppControlConfig',
    'primary_control.prim_fees_control.apps.PrimFeesControlConfig',

    # FOR VOCATIONAL

    'django_rest_passwordreset',
    'import_export',
    'advanced_filters',
    'django_crontab',
    'dbbackup',
]

INSTALLED_APPS = list(SHARED_APPS) + [
    app for app in TENANT_APPS if app not in SHARED_APPS
]

# DBBACKUP_STORAGE = 'django.core.files.storage.FileSystemStorage'
# DBBACKUP_STORAGE_OPTIONS = {'location': '/home/cp2281266p21/public_html/apitest/database/'}

CRONJOBS = [
    ('30 23 * * *', 'myproject.dbcron.db_cron_backup')
]

MIDDLEWARE = [
    'django_tenants.middleware.main.TenantMainMiddleware',
    # custom tenant middleware
    'myproject.middleware.TenantMiddleware',

    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

TENANT_MODEL = "tenant.Tenant"
TENANT_DOMAIN_MODEL = "tenant.Domain"

ROOT_URLCONF = 'myproject.urls'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'myproject.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django_tenants.postgresql_backend',
        'NAME': 'myproject', # 'estudents'
        'USER': 'myprojectuser',  # 'postgres',
        'PASSWORD': 'G18eqF22',  # 'Admin',
        'HOST': 'localhost',  # '37.60.235.58',
        'PORT': ''
    }
}

DATABASE_ROUTERS = ('django_tenants.routers.TenantSyncRouter',)

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = False

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static/')

DJANGO_REST_PASSWORDRESET_TOKEN_CONFIG = {
    "CLASS": "django_rest_passwordreset.tokens.RandomNumberTokenGenerator",
    "OPTIONS": {
        "min_length": 5,
        "max_length": 5
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = "mail.st-joan.com"
EMAIL_HOST_USER = "support@st-joan.com"
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
EMAIL_HOST_PASSWORD = "S5ul5Pygi9%1"
EMAIL_PORT = 465
EMAIL_USE_SSL = True
EMAIL_USE_TLS = False

#SECURE_SSL_REDIRECT = True
#SESSION_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
CSRF_COOKIE_SECURE = True

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=120),
    "REFRESH_TOKEN_LIFETIME": timedelta(hours=12),
    "ROTATE_REFRESH_TOKENS": False,
    "TOKEN_OBTAIN_SERIALIZER": "user_control.serializers.MyTokenObtianPairSerializer",
    "ALGORITHM": "HS256",
    "SIGNING_KEY": settings.SECRET_KEY,
}

JAZZMIN_SETTINGS = {
    "order_with_respect_to": ['user_control', 'app_control', "django_rest_passwordreset", "tenant",
                              "fees_control", "time_control", ],

    "site_brand": "Econneq",

    "welcome_sign": "Econneq Universities",

    "copyright": "Econneq Systems",
}
