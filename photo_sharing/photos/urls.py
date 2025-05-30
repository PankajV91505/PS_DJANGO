from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('upload/', views.upload_photo, name='upload_photo'),
    path('search/', views.search_photos, name='search_photos'),
    path('photo/<int:id>/', views.get_photo, name='get_photo'),
    path('photo/<int:photo_id>/edit/', views.edit_photo, name='edit_photo'),
    path('photo/<int:id>/delete/', views.delete_photo, name='delete_photo'),
]