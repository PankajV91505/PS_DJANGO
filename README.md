# 📷 Single-Page Photo Sharing App (Django)

This is a single-page photo sharing app built with **Django** and **HTMX**. Users can upload, edit, delete, and filter photos by tags — all without reloading the page.

---

## 🎯 Features

- ✅ Upload photos with title, description, and tags
- ✅ View all uploaded photos in a gallery
- ✅ Edit and delete photos using modal forms (HTMX)
- ✅ Search/filter photos by tags (AJAX-based)
- ✅ Many-to-many relationship for photos and tags
- ✅ CSRF protection and secure file handling
- ✅ Responsive layout (Bootstrap included)

---

## 🗃️ Models

- **Photo**: title, description, image, timestamps, user (optional), tags
- **Tag**: name
- **PhotoTag**: junction table for many-to-many relation

---

## 🔧 Tech Stack

- Python 3.10+
- Django (latest stable)
- SQLite (default, easy setup)
- HTMX for AJAX-style interactivity
- Bootstrap 5 for responsive UI

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/photo-sharing-django.git
cd photo-sharing-django

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install django
python manage.py makemigrations
python manage.py migrate
python manage.py runserver


📁 Project Structure

photo_app/
├── gallery/
│   ├── models.py        # Photo, Tag, PhotoTag
│   ├── views.py         # HTMX-based views
│   ├── urls.py          # URL routing
│   ├── forms.py         # Photo upload/edit form
│   ├── templates/
│   │   └── gallery/
│   │       ├── gallery.html
│   │       └── partials/
│   │           ├── photo_card.html
│   │           └── edit_form.html
├── photo_app/
│   ├── settings.py      # Django settings
│   └── urls.py          # Main URL conf
├── static/              # Static files (Bootstrap, JS)
├── media/               # Uploaded images
└── manage.py
