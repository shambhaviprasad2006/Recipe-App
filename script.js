const memeContainer = document.getElementById('meme-container');
const loadingIndicator = document.getElementById('loading');
const searchInput = document.getElementById('search-input');

// We'll store the fetched memes here so we can filter them later
let allMemes = [];

/**
 * Shows the loading indicator
 */
function showLoading() {
    loadingIndicator.style.display = 'block';
}

/**
 * Hides the loading indicator
 */
function hideLoading() {
    loadingIndicator.style.display = 'none';
}

/**
 * Fetches the popular memes from Imgflip API
 */
async function fetchMemes() {
    try {
        // 1. Show loading text/spinner before fetching
        showLoading();

        // 2. Fetch data using async/await
        const response = await fetch('https://api.imgflip.com/get_memes');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // 3. Log the fetched meme data in console
        console.log('Fetched Meme Data:', data);

        if (data.success) {
            allMemes = data.data.memes;
            // Render the fetched memes to the DOM
            renderMemes(allMemes);
        } else {
            throw new Error('API returned success=false');
        }

    } catch (error) {
        // 4. Handle errors gracefully
        console.error('Error fetching memes:', error);
        
        // Build an elegant error state directly via DOM methods
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
        // 5. Hide loading after data is received (or if it fails)
        hideLoading();
    }
}

/**
 * Renders the provided array of memes into the meme container grid
 */
function renderMemes(memesToRender) {
    // Clear any existing content
    memeContainer.innerHTML = '';
    
    if (memesToRender.length === 0) {
        const noMemesMsg = document.createElement('p');
        noMemesMsg.style.gridColumn = '1 / -1';
        noMemesMsg.style.textAlign = 'center';
        noMemesMsg.textContent = 'No memes found.';
        memeContainer.appendChild(noMemesMsg);
        return;
    }

    // Build the grid of meme cards
    memesToRender.forEach(meme => {
        // Create the main card container
        const card = document.createElement('div');
        card.className = 'meme-card';
        
        // Create the image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'meme-image-container';
        
        // Create the image element
        const image = document.createElement('img');
        image.src = meme.url;
        image.alt = meme.name;
        image.className = 'meme-image';
        image.loading = 'lazy';
        
        // Append image to its container
        imageContainer.appendChild(image);
        
        // Create the title element
        const title = document.createElement('h3');
        title.className = 'meme-title';
        title.title = meme.name;
        title.textContent = meme.name;
        
        // Append container and title to the card
        card.appendChild(imageContainer);
        card.appendChild(title);
        
        // Append card to the main grid
        memeContainer.appendChild(card);
    });
}

/**
 * Adds an event listener to the search input to filter the memes
 */
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    const filteredMemes = allMemes.filter(meme => 
        meme.name.toLowerCase().includes(searchTerm)
    );
    
    renderMemes(filteredMemes);
});

// Kick off the fetch once the browser has loaded the DOM
document.addEventListener('DOMContentLoaded', () => {
    fetchMemes();
});
