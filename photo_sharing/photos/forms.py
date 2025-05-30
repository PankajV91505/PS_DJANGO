from django import forms
from .models import Photo

class PhotoForm(forms.ModelForm):
    tags = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'Tags (comma separated)'})
    )
    
    class Meta:
        model = Photo
        fields = ['title', 'description', 'image', 'tags']
    
    def clean_tags(self):
        tags = self.cleaned_data.get('tags', '')
        return [tag.strip() for tag in tags.split(',') if tag.strip()]