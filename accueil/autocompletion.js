document.addEventListener("DOMContentLoaded", function() {
    const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
    const input = document.getElementById("search-media");
    const datalist = document.getElementById("medias-list");

    input.addEventListener("input", function() {
        let query = this.value.trim().toLowerCase();
        datalist.innerHTML = ""; // Nettoyage avant ajout de nouvelles suggestions

        if (query.length > 1) {
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr&query=${query}`)
                .then(response => response.json())
                .then(data => {
                    data.results.forEach(media => {
                        let option = document.createElement("option");
                        option.value = media.title || media.name; // Certains films ont "title", certaines séries ont "name"
                        datalist.appendChild(option);
                    });
                })
                .catch(error => console.error("Erreur API :", error));
        }
    });
});
