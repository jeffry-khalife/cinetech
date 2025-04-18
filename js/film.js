const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
let currentPage = 1;

function loadMovies(page = 1) {
  currentPage = page;
  showLoading();
  
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr&page=${page}`)
    .then(res => res.json())
    .then(data => {
      displayMovies(data.results, 'movie'); 
      createPagination(data.page, data.total_pages);
      hideLoading();
    })
    .catch(error => {
      console.error('Erreur lors du chargement des films populaires:', error);
      hideLoading();
    });
  

}

loadMovies();

function displayMovies(movies, mediaType) {
  const container = document.getElementById('movie-container');
  container.innerHTML = '';
  
  movies.forEach(movie => {
    const isFav = isFavorite(movie.id, mediaType); // Vérifier si le film/serie est favori
    const movieCard = document.createElement('div');
    movieCard.className = 'bg-gray-800 rounded shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105';
    movieCard.onclick = () => goToDetailPage(movie.id, mediaType);
    
    const title = movie.title || movie.name;
    const posterPath = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    
    movieCard.innerHTML = `
      <img src="${posterPath}" alt="${title}" class="w-full h-64 object-cover">
      <div class="p-4">
        <h3 class="text-xl">${title}</h3>
        <button onclick="event.stopPropagation(); toggleFavorite(${movie.id}, this, '${mediaType}')" class="text-2xl">
          ${heartIcon(isFav)}
        </button>
      </div>
    `;
    container.appendChild(movieCard);
  });
}

function goToDetailPage(movieId, mediaType) {
  window.location.href = `details.html?movieId=${movieId}&mediaType=${mediaType}`;
}

function createPagination(current, total) {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';
  const maxPagesToShow = 7;
  let startPage = Math.max(1, current - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(total, startPage + maxPagesToShow - 1);
  
  if (current > 1) {
    paginationContainer.innerHTML += `<button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700" onclick="loadMovies(${current - 1})">Préc.</button>`;
  }
  
  for (let i = startPage; i <= endPage; i++) {
    paginationContainer.innerHTML += `<button class="px-3 py-1 rounded ${i === current ? 'bg-white text-black font-bold' : 'bg-gray-700 hover:bg-gray-600 text-white'}" onclick="loadMovies(${i})">${i}</button>`;
  }
  
  if (current < total) {
    paginationContainer.innerHTML += `<button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700" onclick="loadMovies(${current + 1})">Suiv.</button>`;
  }
}

function isFavorite(movieId, mediaType) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites.some(fav => fav.id === movieId && fav.type === mediaType);
}

function toggleFavorite(movieId, button, mediaType) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  const existingIndex = favorites.findIndex(fav => fav.id === movieId && fav.type === mediaType);
  
  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
  } else {
    favorites.push({ id: movieId, type: mediaType });
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
  
  const isFav = existingIndex > -1;
  button.innerHTML = heartIcon(!isFav);
  button.classList.add('pop');
  
  setTimeout(() => button.classList.remove('pop'), 200);
}

function heartIcon(isFav) {
  return isFav ? '❤️' : '🤍';
}

function showLoading() {
  document.getElementById('loading-spinner').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading-spinner').classList.add('hidden');
}
