const apiKey = '8c4b867188ee47a1d4e40854b27391ec';

// Fonction pour récupérer et afficher les films/séries
function fetchMedia(url, containerId) {
    fetch(url)
        .then(res => res.json())
        .then(data => displayMedia(data.results, containerId))
        .catch(error => console.error(`Erreur lors du chargement (${containerId}):`, error));
}

// Affichage sous forme de carrousel horizontal, avec 10 éléments visibles
function displayMedia(mediaList, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.overflowX = 'hidden';  // Masquer le débordement
    container.style.scrollBehavior = 'smooth';

    mediaList.forEach((media, index) => {
        const mediaCard = document.createElement('div');
        mediaCard.className = `bg-gray-800 rounded shadow-md overflow-hidden min-w-[200px] transition-transform hover:scale-105 mx-2 ${
            index >= 10 ? 'hidden' : ''  // Masquer les éléments après les 10 premiers
        }`;

        mediaCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${media.poster_path}" alt="${media.title || media.name}" class="w-full h-56 object-cover">
            <div class="p-2 text-center">
                <h3 class="text-lg font-semibold">${media.title || media.name}</h3>
            </div>
        `;

        container.appendChild(mediaCard);
    });

    enableCarousel(containerId, mediaList.length);
}

// Défilement horizontal fluide avec limites
function enableCarousel(containerId, totalItems) {
    const container = document.getElementById(containerId);
    let visibleStartIndex = 0;
    const visibleCount = 10; // Nombre d'éléments visibles à la fois

    document.getElementById(`prev-${containerId}`).addEventListener('click', () => {
        if (visibleStartIndex > 0) {
            visibleStartIndex -= visibleCount;
            updateVisibility(containerId, visibleStartIndex, totalItems);
        }
    });

    document.getElementById(`next-${containerId}`).addEventListener('click', () => {
        if (visibleStartIndex + visibleCount < totalItems) {
            visibleStartIndex += visibleCount;
            updateVisibility(containerId, visibleStartIndex, totalItems);
        }
    });
}

// Mettre à jour l'affichage des éléments
function updateVisibility(containerId, startIndex, totalItems) {
    const items = document.getElementById(containerId).children;

    for (let i = 0; i < totalItems; i++) {
        items[i].classList.toggle('hidden', i < startIndex || i >= startIndex + 10);
    }
}

// Récupération des films/séries pour chaque catégorie
fetchMedia(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=fr&page=1`, 'latest-films-container');
fetchMedia(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=fr&page=1`, 'latest-series-container');
fetchMedia(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=fr&page=1`, 'classic-container');