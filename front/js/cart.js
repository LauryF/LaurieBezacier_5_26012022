// Eviter l'erreur (dans la console) lorsque LS vide

// Récupération de l'id de chaque produit dans LS
let panierLS = localStorage.getItem("panier");
//console.log(panierLS)

if (panierLS !== null) {
    afficherProduits();
} else {
    console.log("Aucun produit n'est encore présent dans le panier")
}

function afficherProduits() {

    // Création des cartes - Page 'cart'

    var panierJS = JSON.parse(panierLS); // objet JS

    // Boucle forEach sur 'panierJS' pour récupérer les 'id' des canaps sélectionnés
    for (let canapsSelectPanierJS of panierJS) {

        /* let idCanapSelect = canapsSelectPanierJS.idProduit;
        console.log(idCanapSelect) */

        // Appel de la fonction 'recupDataAPI'
        recupDataAPI_LS(canapsSelectPanierJS);
        //console.log(canapsSelectPanierJS)
    }

    // Carte initiale : récupération
    let card = document.querySelector("#cart__items > article");

    // Suppression du noeud contenant la carte initiale (visuellement)
    let cardParent = document.getElementById("cart__items");
    let cardEnfant = document.querySelector("#cart__items > article");
    cardParent.removeChild(cardEnfant);

    // Fonction qui récupère les données des produits du catalogue de l'API et du LS + affichage des informations des produits / attribut 'canap' = clone de l'attribut 'SelectPanierJS' (objet JS)
    function recupDataAPI_LS(canap) {
        fetch("http://localhost:3000/api/products/" + canap.idProduit)
            .then(function (response) {
                //console.table(response)
                return response.json()
            })
            .then(function (data) {
                // Afficher les données sous forme de tableau
                //console.table(data)

                // Clonage des cartes + récupération des infos de chaque canap sélectionné

                // Clonage de la carte exemple
                let clone = card.cloneNode(true);
                //console.log(clone)

                // Données récupérées dans l'API
                // Photo du produit sélectionné
                clone.querySelector(".cart__item__img > img").setAttribute("src", data.imageUrl);
                //console.log(data.imageUrl)

                // Alt de la photo du produit sélectionné
                clone.querySelector(".cart__item__img > img").setAttribute("alt", data.altTxt);

                // Nom du produit sélectionné
                clone.querySelector(".cart__item__content__description > h2").innerText = data.name;

                // Prix du produit sélectionné
                clone.querySelector(".cart__item__content .prixProduitSelect").innerText = data.price + " €";

                // Données récupérées dans LS
                // Couleur du produit sélectionné
                clone.querySelector(".cart__item__content .couleurProduitSelect").innerText = canap.couleur;

                // Quantité (initiale) du produit sélectionné
                let inputQte = clone.querySelector(".cart__item__content .cart__item__content__settings__quantity > input");
                inputQte.setAttribute("value", canap.qte);


                // Pour connaitre l'index de l'objet 'produit' (dont on souhaite modifier la quantité) dans le array 'panier JS'
                const indexProduit = (item) => (item.idProduit == produit.idProduit) && (item.couleur == produit.couleur); // méthode 'item' : true (si 'idProduit' du 'panier(LS)' est identique à celui de l'objet JS 'produit' (de panier(JS))) ou false (si différent)
                let index = panierLS.findIndex(indexProduit); // méthode 'findIndex' : '-1' s'il n'existe pas , sinon renvoie son 'index'

                if (Input.addEventListener('change', changeQte(canap))) // Si qté modifiée
                {
                    // alors modification du panier dans LS
                    let qteChange = parseInt(panierLS[index].qte) + parseInt(canap.qte);

                    // Modification (de la valeur) de la quantité initiale
                    panierLS[index].qte = qteChange;

                    // Conversion du array (objet JS) en 'string' (pour pouvoir le re-stocker dans LS) 
                    panierLS = JSON.stringify(panierJS); // string
                    // Création d'une nouvelle valeur à la clé 'panier'
                    localStorage.setItem("panier", panierLS);
                    console.log("La quantité d'un produit a été modifiée (dans LS)")
                }

                function changeQte(canap) {
                    qteInput.setAttribute("value", canap.qte);

                    //canap.qte = qteInput.value;
                };



                // Ajout de nouveaux enfants (cards clonnées) à la fin de la liste des enfants (déjà existants) du parent 'cardParent'
                cardParent.appendChild(clone);


                // Supression d'un 'canap' dans le panier

                let btnSup = document.querySelector(".cart__item__content__settings__delete .deleteItem")

                btnSup.addEventListener('click', supCanap(produit));
                console.log('btnSup fonctionne')

                function supCanap(produit) {

                    // Pour connaitre l'index de l'objet 'produit' (à supprimer) dans le array 'panier'
                    const indexProduit = (item) => (item.idProduit == produit.idProduit) && (item.couleur == produit.couleur); // méthode 'item' : true (si 'idProduit' du 'panier(LS)' est identique à celui de l'objet JS 'produit' (de panier(JS))) ou false (si différent)
                    let index = panierJS.findIndex(indexProduit); // méthode 'findIndex' : '-1' s'il n'existe pas , sinon renvoie son 'index'
                    console.log(index)

                    if (index !== -1) {
                        panierJS.splice(index, 1);
                        alert("le canap a bien été supprimé")
                    }
                };
            })
            .catch(function (err) {});
    };
};