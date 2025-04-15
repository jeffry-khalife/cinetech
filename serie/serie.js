const apiKey = '8c4b867188ee47a1d4e40854b27391ec'; //clé api

// fetch de l'api
fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=fr&page=1`)
    .then(res => res.json())
    .then(data => displayMovies(data.results))
    .catch(error => console.error('Erreur lors du chargement des films populaires:', error));

// Afficher les films 
function displayMovies(movies) {
const container = document.getElementById('movie-container');
container.innerHTML = '';

movies.forEach(movie => {
    const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
    const isFav = isFavorite(movie.id);
    const movieCard = document.createElement('div');
    movieCard.className = 'bg-gray-800 rounded shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105';
    movieCard.onclick = () => openModal(movie.id, mediaType);

    movieCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}" class="w-full h-64 object-cover">
        <div class="p-4">
            <h3 class="text-xl">${movie.title || movie.name}</h3>
            <button onclick="toggleFavorite(${movie.id}, this)" class="text-2xl">
                ${heartIcon(isFav)}
            </button>
        </div>
    `;

    container.appendChild(movieCard);
});
}
    
//Verifier si un film ou une serie est dèja en favoris 
function isFavorite(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(movieId);
}

// Mettre en favoris 
function toggleFavorite(movieId, button) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFav = isFavorite(movieId);

    if (isFav) {
        const index = favorites.indexOf(movieId);
        if (index !== -1) {
            favorites.splice(index, 1);
        }
    } else {
        favorites.push(movieId);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    button.innerHTML = heartIcon(!isFav); 
    button.classList.add('pop'); 
    setTimeout(() => {
        button.classList.remove('pop');
    }, 200);
}

function heartIcon(isFav) {
    return isFav ? '❤️' : '🤍';
}

