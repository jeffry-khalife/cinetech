document.addEventListener("DOMContentLoaded", function() {
    let recettes = [];

    fetch("../json/data.json")
        .then(response => response.json())
        .then(data => {
            recettes = data.recettes;
        });

    function autocomplete(input, datalistId) {
        let datalist = document.getElementById(datalistId);
        input.addEventListener("input", function() {
            let value = this.value.toLowerCase();
            datalist.innerHTML = "";
            if (value.length > 1) {
                recettes.forEach(recette => {
                    let recetteNom = recette.nom.toLowerCase();
                    if (recetteNom.includes(value)) {
                        let option = document.createElement("option");
                        option.value = recette.nom;
                        datalist.appendChild(option);
                    }
                });
            }
        });
    }

    //c'est pour appliquer l'autocomplétion au champ de recherche
    autocomplete(document.getElementById("search-recette"), "recettes-list");
});

document.getElementById("search-button").addEventListener("click", function () {
        const searchQuery = document.getElementById("search-recette").value.toLowerCase().trim();
    
    
        fetch("../json/data.json")
            .then(response => response.json())
            .then(data => {
                const recetteTrouvee = data.recettes.find(recette => recette.nom.toLowerCase() === searchQuery);
    
    
                if (recetteTrouvee) {
                    const recetteId = encodeURIComponent(recetteTrouvee.nom);
                    // Rediriger vers la page des recettes avec un paramètre
                    window.location.href = `recettes.html?recette=${recetteId}`;
                } else {
                    alert("Recette non trouvée !");
                }
            })
            .catch(error => console.error("Erreur de chargement des recettes :", error));
    });
    
    
    document.addEventListener("DOMContentLoaded", function () {
        const params = new URLSearchParams(window.location.search);
        const recetteDemandee = params.get("recette");
    
    
        if (recetteDemandee) {
            fetch("../json/data.json")
                .then(response => response.json())
                .then(data => {
                    const recetteTrouvee = data.recettes.find(recette =>
                        recette.nom.toLowerCase() === decodeURIComponent(recetteDemandee).toLowerCase()
                    );
    
    
                    if (recetteTrouvee) {
                        ouvrirModal(recetteTrouvee);
                    } else {
                        console.warn("Recette non trouvée dans les données JSON :", recetteDemandee);
                    }
                })
                .catch(error => console.error("Erreur de chargement des recettes :", error));
        }
    });