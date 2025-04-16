// Remplace ça par ta propre clé API
const apiKey = "TA_CLE_API";

document.addEventListener("DOMContentLoaded", function () {
    let filmsPopulaires = [];

    // Charger les films populaires depuis TheMovieDB
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr&page=1`)
        .then(res => res.json())
        .then(data => {
            filmsPopulaires = data.results; // stocke les films pour la recherche
            autocomplete(document.getElementById("search-film"), "films-list", filmsPopulaires);
        })
        .catch(error => console.error("Erreur lors du chargement des films populaires:", error));

    // Fonction d'autocomplétion
    function autocomplete(input, datalistId, films) {
        const datalist = document.getElementById(datalistId);
        input.addEventListener("input", function () {
            const value = this.value.toLowerCase();
            datalist.innerHTML = "";
            if (value.length > 1) {
                films.forEach(film => {
                    const titre = film.title.toLowerCase();
                    if (titre.includes(value)) {
                        const option = document.createElement("option");
                        option.value = film.title;
                        datalist.appendChild(option);
                    }
                });
            }
        });
    }

    // Gestion du bouton de recherche
    document.getElementById("search-button").addEventListener("click", function () {
        const searchQuery = document.getElementById("search-film").value.toLowerCase().trim();
        const filmTrouve = filmsPopulaires.find(film => film.title.toLowerCase() === searchQuery);

        if (filmTrouve) {
            const filmNomEncode = encodeURIComponent(filmTrouve.title);
            window.location.href = `film.html?film=${filmNomEncode}`;
        } else {
            alert("Film non trouvé dans les films populaires !");
        }
    });
});
