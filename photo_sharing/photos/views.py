import os
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .models import Photo, Tag
from .forms import PhotoForm

def index(request):
    photos = Photo.objects.all().order_by('-created_at')
    form = PhotoForm()
    return render(request, 'photos/index.html', {'photos': photos, 'form': form})

@csrf_exempt
def upload_photo(request):
    if request.method == 'POST':
        form = PhotoForm(request.POST, request.FILES)
        if form.is_valid():
            photo = form.save(commit=False)
            photo.save()
            
            tags = form.cleaned_data['tags']
            for tag_name in tags:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                photo.tags.add(tag)
            
            return JsonResponse({
                'success': True,
                'photo': {
                    'id': photo.id,
                    'title': photo.title,
                    'description': photo.description,
                    'image_path': photo.image.url,
                    'tags': list(photo.tags.values_list('name', flat=True))
                }
            })
        return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    return JsonResponse({'success': False}, status=405)

def search_photos(request):
    tag = request.GET.get('tag', '')
    if not tag:
        return JsonResponse([], safe=False)
    
    photos = Photo.objects.filter(tags__name__icontains=tag).distinct()
    
    result = []
    for photo in photos:
        result.append({
            'id': photo.id,
            'title': photo.title,
            'description': photo.description,
            'image_path': photo.image.url,
            'tags': list(photo.tags.values_list('name', flat=True))
        })
    
    return JsonResponse(result, safe=False)

def get_photo(request, id):
    photo = get_object_or_404(Photo, id=id)
    return JsonResponse({
        'id': photo.id,
        'title': photo.title,
        'description': photo.description,
        'image_path': photo.image.url,
        'tags': list(photo.tags.values_list('name', flat=True))
    })

@csrf_exempt
def edit_photo(request, photo_id):
    photo = get_object_or_404(Photo, id=photo_id)
    
    if request.method == 'POST':
        data = request.POST
        photo.title = data.get('title', photo.title)
        photo.description = data.get('description', photo.description)
        
        tag_names = [t.strip() for t in data.get('tags', '').split(',') if t.strip()]
        new_tags = []
        for name in tag_names:
            tag, created = Tag.objects.get_or_create(name=name)
            new_tags.append(tag)
        
        photo.tags.set(new_tags)
        photo.save()
        
        return JsonResponse({'success': True})
    return JsonResponse({'success': False}, status=405)

@csrf_exempt
def delete_photo(request, id):
    photo = get_object_or_404(Photo, id=id)
    
    if request.method == 'DELETE':
        if photo.image:
            if os.path.isfile(photo.image.path):
                os.remove(photo.image.path)
        photo.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False}, status=405)