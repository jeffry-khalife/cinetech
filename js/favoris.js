const apiKey = '8c4b867188ee47a1d4e40854b27391ec';

    function loadFavoriteMovies() {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const favoritesList = document.getElementById('favorites-list');

      if (favorites.length === 0) {
        favoritesList.innerHTML = `<p class="text-center text-gray-300">Aucun film favori pour le moment.</p>`;
        return;
      }

      favorites.forEach(movieId => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr`)
          .then(res => res.json())
          .then(data => {
            const title = data.title || data.name;
            const poster = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
            const releaseDate = data.release_date || data.first_air_date || 'Inconnue';

            const movieCard = document.createElement('div');
            movieCard.classList.add('bg-gray-800', 'p-4', 'rounded-lg', 'space-y-4');

            movieCard.innerHTML = `
              <img src="${poster}" alt="${title}" class="w-full rounded-md">
              <h3 class="text-xl font-semibold">${title}</h3>
              <p class="text-gray-300"><strong>Date de sortie :</strong> ${releaseDate}</p>
              <button onclick="removeFromFavorites(${movieId})" class="bg-red-500 px-4 py-2 rounded-lg text-white mt-4 w-full">Retirer des favoris</button>
            `;
            
            favoritesList.appendChild(movieCard);
          })
          .catch(error => console.error('Erreur lors du chargement des films favoris:', error));
      });
    }

    function removeFromFavorites(movieId) {
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      favorites = favorites.filter(id => id !== movieId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      loadFavoriteMovies();  
    }

    loadFavoriteMovies();