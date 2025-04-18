const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movieId');
const mediaType = urlParams.get('mediaType') || 'movie';

function loadMovieDetails() {
    fetch(`https://api.themoviedb.org/3/${mediaType}/${movieId}?api_key=${apiKey}&language=fr`)
    .then(res => res.json())
    .then(data => {
        const title = data.title || data.name;
        const poster = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
        const isFav = isFavorite(data.id);
        document.getElementById('movie-detail').innerHTML = `
            <div class="flex flex-col md:flex-row gap-4">
                <img src="${poster}" alt="${title}" class="w-full md:w-1/3 rounded">
                <div class="flex flex-col space-y-2">
                    <h2 class="text-3xl font-bold mb-2">${title}</h2>
                    <p class="text-gray-300">${data.overview || 'Pas de description.'}</p>
                    <p><strong>Note :</strong> ${data.vote_average || 'N/A'}</p>
                    <p><strong>Date de sortie :</strong> ${data.release_date || data.first_air_date || 'Inconnue'}</p>
                    <p><strong>Genres :</strong> ${data.genres.map(g => g.name).join(', ') || 'Non spécifié'}</p>
                </div>
            </div>
        `;
        loadSimilarMovies(data.id); 
        loadComments();  
    })
    .catch(error => {
        console.error("Erreur détails :", error);
    });
}

function loadSimilarMovies(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=fr`)
    .then(res => res.json())
    .then(data => {
        const similarMoviesList = document.getElementById('similar-movies-list');
        similarMoviesList.innerHTML = '';
        if (data.results.length === 0) {
            similarMoviesList.innerHTML = `<p class="text-gray-300">Aucune suggestion de films similaires.</p>`;
            return;
        }
        const limitedResults = data.results.slice(0, 4);
        limitedResults.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('bg-gray-800', 'p-4', 'rounded-lg', 'space-y-4');
    
            const moviePoster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
            movieCard.innerHTML = `
            <a href="details.html?movieId=${movie.id}&mediaType=movie"><img src="${moviePoster}" alt="${movie.title}" class="w-full rounded-md"></a>
            <h3 class="text-xl font-semibold">${movie.title}</h3>
            <p class="text-gray-300"><strong>Date de sortie :</strong> ${movie.release_date || 'Inconnue'}</p>
            `;
            
            similarMoviesList.appendChild(movieCard);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des films similaires:', error));
}

function displayComments(comments) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';  

    if (comments.length === 0) {
        commentsList.innerHTML = `<p class="text-gray-300">Aucun commentaire pour ce film.</p>`;
    } else {
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('p-4', 'bg-gray-700', 'rounded-lg');
            commentDiv.innerHTML = `
                <p class="text-gray-300"><strong>${comment.author}</strong></p>
                <p class="text-gray-400">${comment.content}</p>
                <p class="text-gray-500"><small>${new Date(comment.created_at).toLocaleDateString()}</small></p>
            `;
            commentsList.appendChild(commentDiv);
        });
    }
}

function loadComments() {
    fetch(`https://api.themoviedb.org/3/${mediaType}/${movieId}/reviews?api_key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
        let allComments = [];
        if (data.results && data.results.length > 0) {
            allComments = allComments.concat(data.results);  
        }

        const localComments = JSON.parse(localStorage.getItem('comments')) || {};
        const movieComments = localComments[movieId] || [];
        allComments = allComments.concat(movieComments.map(comment => ({
            author: 'Utilisateur Local', 
            content: comment,
            created_at: new Date().toISOString()
        })));

        displayComments(allComments); 
    })
    .catch(err => {
        console.error("Erreur lors de la récupération des commentaires :", err);
        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = `<p class="text-gray-300">Impossible de charger les commentaires pour ce film.</p>`;
    });
}

function saveComment() {
    const commentInput = document.getElementById('comment-input');
    const newComment = commentInput.value.trim();
    if (newComment === '') {
        alert("Veuillez saisir un commentaire avant de l'ajouter.");
        return;
    }

    const comments = JSON.parse(localStorage.getItem('comments')) || {};
    const movieComments = comments[movieId] || [];
    movieComments.push(newComment);

    comments[movieId] = movieComments;
    localStorage.setItem('comments', JSON.stringify(comments));

    loadComments();  
    commentInput.value = ''; 
}

function isFavorite(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(movieId);
}

function heartIcon(isFav) {
    return isFav ? '❤️' : '🤍';
}

function toggleFavorite(movieId, button) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFav = isFavorite(movieId);
    if (isFav) {
        favorites.splice(favorites.indexOf(movieId), 1);
    } else {
        favorites.push(movieId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    button.innerHTML = heartIcon(!isFav);
    button.classList.add('pop');
    setTimeout(() => button.classList.remove('pop'), 200);
}

loadMovieDetails(); 