function chargerFavoris() {
    const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    const container = document.getElementById('favoris-container');
    container.innerHTML = ''; 

    favoris.forEach((titre, index) => {
    const titreDiv = document.createElement('article');
    titreDiv.className = 'titre bg-white p-4 rounded-lg shadow-md';
    titreDiv.innerHTML = `
        <img src="${titre.image}" alt="${titre.nom}" class="w-full h-40 object-cover rounded-lg mb-4">
        <div class="pt-5 self-center sm:pt-0 sm:pl-10 col-span-3">
            <h2 class="text-gray-800 capitalize text-xl font-bold">${titre.nom}</h2>
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
        titreDiv.addEventListener('click', function() {
            ouvrirModal(titre);
        });
        container.appendChild(titreDiv);
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
