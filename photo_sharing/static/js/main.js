document.addEventListener('DOMContentLoaded', function () {
  const uploadForm = document.getElementById('uploadForm');
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchTag');
  const gallery = document.getElementById('photoGallery');
  const editForm = document.getElementById('editForm');
  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  // Helper Functions
  const capitalizeFirst = (text) => 
    text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';

  const truncateText = (text, max = 80) => 
    text ? (text.length > max ? text.substring(0, max) + '...' : text) : '';

  // Render Tags with More Button
  const renderTags = (tags) => {
    if (!tags || !tags.length) return '<span class="text-muted">No tags</span>';
    
    const visible = tags.slice(0, 4);
    const hidden = tags.slice(4);
    
    let html = visible.map(tag => 
      `<span class="badge bg-secondary">${tag}</span>`
    ).join('');

    if (hidden.length) {
      html += `
        <span class="d-none extra-tags">
          ${hidden.map(tag => `<span class="badge bg-secondary">${tag}</span>`).join('')}
        </span>
        <button class="toggle-more btn btn-sm btn-link p-0">+${hidden.length} more</button>
      `;
    }

    return html;
  };

  // Update Gallery Function
  const updateGallery = (photos) => {
    if (!photos || !photos.length) {
      gallery.innerHTML = '<p class="text-center py-4">No photos found</p>';
      return;
    }

    gallery.innerHTML = photos.map(photo => `
      <div class="col-md-4 mb-4" data-photo-id="${photo.id}">
        <div class="card h-100">
          <img src="${photo.image_path}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${capitalizeFirst(photo.title)}</h5>
            <p class="card-text" title="${photo.description || ''}">
              ${truncateText(photo.description)}
            </p>
            <div class="tags">
              ${renderTags(photo.tags)}
            </div>
            <div class="mt-auto pt-2">
              <button class="btn btn-sm btn-primary edit-photo">Edit</button>
              <button class="btn btn-sm btn-danger ms-2 delete-photo">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    attachEventListeners();
  };

  // Upload form submit
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);
    
    try {
      const res = await fetch('/upload/', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      const data = await res.json();
      if (data.success) {
        location.reload();
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  });

  // Search by tag
  searchBtn.addEventListener('click', () => {
    const tag = searchInput.value.trim();
    fetch(`/search/?tag=${encodeURIComponent(tag)}`)
      .then(res => res.json())
      .then(updateGallery)
      .catch(err => {
        console.error('Search failed:', err);
        gallery.innerHTML = '<p>Search failed.</p>';
      });
  });

  // Attach events for dynamically rendered elements
  function attachEventListeners() {
    // Edit button click
    document.querySelectorAll('.edit-photo').forEach(button => {
      button.addEventListener('click', async (e) => {
        const card = e.target.closest('[data-photo-id]');
        const id = card.dataset.photoId;
        
        try {
          const res = await fetch(`/photo/${id}/`);
          const photo = await res.json();
          
          document.getElementById('editPhotoId').value = id;
          document.getElementById('editTitle').value = photo.title;
          document.getElementById('editDescription').value = photo.description || '';
          document.getElementById('editTags').value = photo.tags.join(', ');
          
          new bootstrap.Modal(document.getElementById('editModal')).show();
        } catch (err) {
          console.error('Error fetching photo:', err);
        }
      });
    });

    // Delete button click
    document.querySelectorAll('.delete-photo').forEach(button => {
      button.addEventListener('click', async (e) => {
        const photoId = e.target.closest('[data-photo-id]').dataset.photoId;
        if (confirm('Are you sure you want to delete this photo?')) {
          try {
            const res = await fetch(`/photo/${photoId}/delete/`, {
              method: 'DELETE',
              headers: {
                'X-CSRFToken': csrfToken
              }
            });
            const data = await res.json();
            if (data.success) {
              e.target.closest('[data-photo-id]').remove();
            }
          } catch (err) {
            console.error('Delete failed:', err);
          }
        }
      });
    });

    // Toggle more tags
    document.querySelectorAll('.toggle-more').forEach(btn => {
      btn.addEventListener('click', function() {
        const extraTags = this.previousElementSibling;
        extraTags.classList.toggle('d-none');
        this.textContent = extraTags.classList.contains('d-none') ? 
          `+${extraTags.querySelectorAll('.badge').length} more` : 'Hide';
      });
    });
  }

  // Handle Edit Form submit
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const photoId = document.getElementById('editPhotoId').value;
    const updatedData = {
      title: document.getElementById('editTitle').value,
      description: document.getElementById('editDescription').value,
      tags: document.getElementById('editTags').value,
      csrfmiddlewaretoken: csrfToken
    };

    try {
      const res = await fetch(`/photo/${photoId}/edit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': csrfToken
        },
        body: new URLSearchParams(updatedData)
      });
      const result = await res.json();
      result.success ? location.reload() : alert('Edit failed');
    } catch (err) {
      console.error('Edit failed:', err);
    }
  });

  // Initial binding
  attachEventListeners();
});