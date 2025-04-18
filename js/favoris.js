const apiKey = '8c4b867188ee47a1d4e40854b27391ec';

function loadFavoriteMovies() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const favoritesList = document.getElementById('favorites-list');

  favoritesList.innerHTML = '';

  if (favorites.length === 0) {
    favoritesList.innerHTML = `<p class="text-center text-gray-300">Aucun film ou série favori pour le moment.</p>`;
    return;
  }

  favorites.forEach(fav => {
    const { id, type } = fav;
    const url = type === 'movie' 
      ? `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fr`
      : `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=fr`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const title = data.title || data.name;
        const poster = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
        const releaseDate = data.release_date || data.first_air_date || 'Inconnue';

        const movieCard = document.createElement('div');
        movieCard.classList.add('bg-gray-800', 'p-4', 'rounded-lg', 'space-y-4');

        movieCard.innerHTML = `
        <a href="details.html?movieId=${id}&mediaType=${type}">
          <img src="${poster}" alt="${title}" class="w-full rounded-md hover:opacity-80 transition">
          <h3 class="text-xl font-semibold mt-2 hover:underline">${title}</h3>
        </a>
        <p class="text-gray-300"><strong>Date de sortie :</strong> ${releaseDate}</p>
        <button onclick="removeFromFavorites(${id}, '${type}')" class="bg-red-500 px-4 py-2 rounded-lg text-white mt-4 w-full">Retirer des favoris</button>
        `;
        favoritesList.appendChild(movieCard);
      })
      .catch(error => console.error('Erreur lors du chargement des favoris:', error));
  });
}

function removeFromFavorites(movieId, mediaType) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(fav => !(fav.id === movieId && fav.type === mediaType));
  localStorage.setItem('favorites', JSON.stringify(favorites));
  loadFavoriteMovies();  
}

loadFavoriteMovies();
