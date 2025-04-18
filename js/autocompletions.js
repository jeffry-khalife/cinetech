document.addEventListener("DOMContentLoaded", function() {
const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const input = document.getElementById("search-media");
const datalist = document.getElementById("medias-list");
const searchButton = document.getElementById("search-button");

function searchMedia(query) {
    datalist.innerHTML = ""; 
    if (query.length > 1) {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr&query=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                data.results.forEach(media => {
                    const option = document.createElement("option");
                    option.value = media.title;  
                    option.dataset.id = media.id;  
                    option.dataset.type = "movie";  
                    datalist.appendChild(option);
                });
            })
            .catch(err => console.error("Erreur API autocomplétion films :", err));

        fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=fr&query=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                data.results.forEach(media => {
                    const option = document.createElement("option");
                    option.value = media.name;  
                    option.dataset.id = media.id;  
                    option.dataset.type = "tv";  
                    datalist.appendChild(option);
                });
            })
            .catch(err => console.error("Erreur API autocomplétion séries :", err));
    }
}

input.addEventListener("input", function() {
    const query = this.value.trim().toLowerCase();
    if (query.length > 1) {
        searchMedia(query);  
    }
});

searchButton.addEventListener("click", function() {
    const title = input.value.trim();
    if (!title) {
        alert("Veuillez entrer un titre de film ou de série.");
        return;
    }

    const selectedOption = Array.from(datalist.options).find(option => option.value.toLowerCase() === title.toLowerCase());

    if (selectedOption) {
        const mediaId = selectedOption.dataset.id;
        const mediaType = selectedOption.dataset.type;
        window.location.href = `pages/details.html?movieId=${mediaId}&mediaType=${mediaType}`;  
    } else {
        alert(`Aucun film ou série trouvé pour "${title}".`);
    }
});
});
