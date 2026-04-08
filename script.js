const memeContainer = document.getElementById('meme-container');
const loadingIndicator = document.getElementById('loading');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const sortSelect = document.getElementById('sort-select');
const themeToggle = document.getElementById('theme-toggle');

let allMemes = [];
const likedMemes = new Set();

function showLoading() {
    loadingIndicator.style.display = 'block';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

async function fetchMemes() {
    try {
        showLoading();

        const response = await fetch('https://api.imgflip.com/get_memes');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Fetched Meme Data:', data);

        if (data.success) {
            allMemes = data.data.memes;
            renderMemes(allMemes);
        } else {
            throw new Error('API returned success=false');
        }

    } catch (error) {
        console.error('Error fetching memes:', error);
        
        memeContainer.innerHTML = '';
        const errorContainer = document.createElement('div');
        errorContainer.style.gridColumn = '1 / -1';
        errorContainer.style.textAlign = 'center';
        errorContainer.style.padding = '3rem';
        errorContainer.style.backgroundColor = '#fef2f2';
        errorContainer.style.border = '2px dashed #f87171';
        errorContainer.style.borderRadius = 'var(--border-radius)';
        errorContainer.style.color = '#991b1b';
        errorContainer.style.boxShadow = 'var(--shadow)';
        
        const errorIcon = document.createElement('div');
        errorIcon.textContent = '⚠️';
        errorIcon.style.fontSize = '3rem';
        errorIcon.style.marginBottom = '1rem';
        
        const errorMsg = document.createElement('p');
        errorMsg.style.fontSize = '1.2rem';
        errorMsg.style.fontWeight = '600';
        errorMsg.textContent = 'Oops! Failed to load the memes. Please check your connection and try again.';
        
        errorContainer.appendChild(errorIcon);
        errorContainer.appendChild(errorMsg);
        memeContainer.appendChild(errorContainer);
    } finally {
        hideLoading();
    }
}

function renderMemes(memesToRender) {
    memeContainer.innerHTML = '';
    
    if (memesToRender.length === 0) {
        const noMemesMsg = document.createElement('p');
        noMemesMsg.style.gridColumn = '1 / -1';
        noMemesMsg.style.textAlign = 'center';
        noMemesMsg.textContent = 'No memes found.';
        memeContainer.appendChild(noMemesMsg);
        return;
    }

    memesToRender.forEach(meme => {
        const card = document.createElement('div');
        card.className = 'meme-card';
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'meme-image-container';
        
        const image = document.createElement('img');
        image.src = meme.url;
        image.alt = meme.name;
        image.className = 'meme-image';
        image.loading = 'lazy';
        
        imageContainer.appendChild(image);
        
        const title = document.createElement('h3');
        title.className = 'meme-title';
        title.title = meme.name;
        title.textContent = meme.name;
        
        const likeBtn = document.createElement('button');
        likeBtn.className = 'like-btn';
        if (likedMemes.has(meme.id)) {
            likeBtn.classList.add('liked');
        }
        likeBtn.innerHTML = '♥';
        likeBtn.setAttribute('aria-label', 'Like meme');
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (likedMemes.has(meme.id)) {
                likedMemes.delete(meme.id);
                likeBtn.classList.remove('liked');
            } else {
                likedMemes.add(meme.id);
                likeBtn.classList.add('liked');
            }
        });
        
        card.appendChild(imageContainer);
        card.appendChild(title);
        card.appendChild(likeBtn);
        
        memeContainer.appendChild(card);
    });
}

function applyTransformations() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filterValue = filterSelect.value;
    const sortValue = sortSelect.value;
    
    let transformedMemes = allMemes.filter(meme => {
        const matchesSearch = meme.name.toLowerCase().includes(searchTerm);
        
        let matchesBoxCount = true;
        if (filterValue === '2') {
            matchesBoxCount = meme.box_count === 2;
        } else if (filterValue === '3+') {
            matchesBoxCount = meme.box_count >= 3;
        }
        
        return matchesSearch && matchesBoxCount;
    });
    
    if (sortValue === 'asc') {
        transformedMemes = transformedMemes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'desc') {
        transformedMemes = transformedMemes.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    renderMemes(transformedMemes);
}

searchInput.addEventListener('input', applyTransformations);
filterSelect.addEventListener('change', applyTransformations);
sortSelect.addEventListener('change', applyTransformations);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
    } else {
        document.body.setAttribute('data-theme', 'dark');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchMemes();
});
