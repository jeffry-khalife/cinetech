
function chargerFavoris() {
    const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    const container = document.getElementById('favoris-container');
    container.innerHTML = ''; 

    favoris.forEach((recette, index) => {
    const recetteDiv = document.createElement('article');
    recetteDiv.className = 'recette bg-white p-4 rounded-lg shadow-md';
    recetteDiv.innerHTML = `
        <img src="${recette.image}" alt="${recette.nom}" class="w-full h-40 object-cover rounded-lg mb-4">
        <div class="pt-5 self-center sm:pt-0 sm:pl-10 col-span-3">
            <h2 class="text-gray-800 capitalize text-xl font-bold">${recette.nom}</h2>
        </div>
        <div class="flex justify-between items-center">
        <button class="bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-700 transition">Voir plus</button><br>
        <div class="justify-self-end">
            <button onclick="supprimerFavori(${index})" class="text-black hover:text-red-500 text-lg">
            Supprimer
            </button>
        </div>
        </div>
        `;
        recetteDiv.addEventListener('click', function() {
            ouvrirModal(recette);
        });
        container.appendChild(recetteDiv);
        });
}

function supprimerFavori(index) {
    let favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    favoris.splice(index, 1);
    localStorage.setItem('favoris', JSON.stringify(favoris));

    chargerFavoris();
}

window.onload = function() {
    chargerFavoris();
};
