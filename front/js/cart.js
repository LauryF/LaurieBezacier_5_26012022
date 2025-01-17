// Récupération de 'panier' du LS
let panierLS = localStorage.getItem("panier"); // String

// Prix total du panier - Valeur initiale
var totalPanier = 0;

// Eviter l'erreur (dans la console) lorsque LS vide
if (panierLS !== null) {
    afficherProduits();
} else {
    console.log("Aucun 'canap' n'est encore présent dans le panier")
};

async function afficherProduits() {

    let panierJS = JSON.parse(panierLS); // objet JS

    // Compteur = sert à récupérer l'index du array 'panier' - Valeur initiale
    let compteur = 0;

    // Boucle forEach sur 'panierJS' pour récupérer les 'canap' sélectionnés
    for (let canapsSelectPanierJS of panierJS) {
        // Appel de la fonction 'afficherProduit' ('rangée' dans une variable permet de récupérer le prix de chacun des 'canap')
        await afficherProduit(canapsSelectPanierJS, compteur);

        // Récupère l'index à chacun des tours (de la boucle)
        compteur = compteur + 1; // idem : 'compteur++;' 
    }

    // Changement du prix total du panier (visuellement)
    document.getElementById("totalPrice").innerHTML = totalPanier;

    // Suppression du noeud contenant la carte initiale
    let cardParent = document.getElementById("cart__items");
    let cardEnfant = document.querySelector("#cart__items > article");
    cardParent.removeChild(cardEnfant);

    // Nb d'articles
    document.getElementById("totalQuantity").innerText = panierJS.length;
};

// Fonction qui affiche chacun des 'canap' sélectionnés, en récupérant les données dans l'API et du LS et en affichant ces informations / attribut (en paramètre) 'canap' = clone de l'attribut 'canapsSelectPanierJS' déclaré antérieurement (objet JS)
function afficherProduit(canap, index) {
    return fetch("http://localhost:3000/api/products/" + canap.idProduit)
        .then(function (response) {
            //console.table(response)
            return response.json()
        })
        .then(function (data) {
            // Clonage de la carte initiale + récupération des infos de chacun des 'canap' sélectionnés

            // Carte initiale : récupération
            let card = document.querySelector("#cart__items > article");

            // Clonage de la carte exemple
            let clone = card.cloneNode(true);

            // Données récupérées dans l'API

            // Photo du 'canap' sélectionné
            clone.querySelector(".cart__item__img > img").setAttribute("src", data.imageUrl);
            //console.log(data.imageUrl)

            // Alt de la photo du 'canap' sélectionné
            clone.querySelector(".cart__item__img > img").setAttribute("alt", data.altTxt);

            // Nom du 'canap' sélectionné
            clone.querySelector(".cart__item__content__description > h2").innerText = data.name;

            // Données récupérées dans LS

            // Couleur du 'canap' sélectionné
            clone.querySelector(".cart__item__content .couleurProduitSelect").innerText = canap.couleur;

            // Quantité (initiale) du 'canap' sélectionné
            clone.querySelector(".itemQuantity").setAttribute("value", canap.qte);

            // Modification (de la valeur) de la quantité initiale
            clone.querySelector(".itemQuantity").addEventListener('change', function (event) {
                modifQte(index, event);
            });

            // Prix (initial) du 'canap' sélectionné
            let prixCanap = data.price * canap.qte;
            clone.querySelector(".cart__item__content .prixProduitSelect").innerText = prixCanap + " €";

            // Calcul du prix total du panier
            totalPanier = totalPanier + prixCanap;

            // Supression d'un 'canap' dans le panier
            let btnSup = clone.querySelector(".deleteItem");
            btnSup.addEventListener('click', function () {
                supCanap(index);
            });

            // Sélectionne le futur parent 
            let cardParent = document.getElementById("cart__items");
            // Ajout de nouveaux enfants (cards clonnées) à la fin de la liste des enfants (déjà existants) du parent 'cardParent'
            cardParent.appendChild(clone);
        })
        .catch(function (err) {});
};

// 'index' = 'compteur'
function modifQte(index, event) {

    let panierJS = JSON.parse(panierLS); // objet JS

    // Modification (de la valeur) de la quantité initiale
    panierJS[index].qte = event.target.value; // event.target = représente l'input 'ciblé' (dans le DOM) 

    console.log("quantité initiale modifiée")

    // Conversion du array (objet JS) en 'string' (pour pouvoir le re-stocker dans LS) 
    panierLS = JSON.stringify(panierJS); // string

    // Création d'une nouvelle valeur à la clé 'panier'
    localStorage.setItem("panier", panierLS);

    console.log("panier mis à jour sur LS");

    // Pour rafraichir la page : mise à jour des infos
    document.location.reload();
};

// 'index' = 'compteur'
function supCanap(index) {

    let panierJS = JSON.parse(panierLS); // objet JS

    panierJS.splice(index, 1);

    // Conversion du array (objet JS) en 'string' (pour pouvoir le re-stocker dans LS) 
    panierLS = JSON.stringify(panierJS); // string

    // Création d'une nouvelle valeur à la clé 'panier'
    localStorage.setItem("panier", panierLS);

    // Pour rafraichir la page : mise à jour des infos
    document.location.reload();

    console.log("le canap a bien été supprimé");
};

// Formulaire coordonnées utilisateur

// Vérification des données utilisateur

// First Name (en HTML et CSS)

// Regex
let regex_LastName = /^[a-zA-ZÀ-ÿ '-]+$/;
let regex_AdressCity = /^[a-zA-Z0-9\é\è\ê\s,.'-]{3,}$/;
let regex_Mail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Last Name
let lastNameUser = document.getElementById("lastName");
lastNameUser.addEventListener('change', function (event) {
    validateChampForm(event, "lastNameErrorMsg", regex_LastName);
});

// Address
let addressUser = document.getElementById("address");
addressUser.addEventListener('change', function (event) {
    validateChampForm(event, "addressErrorMsg", regex_AdressCity);
});

// City
let cityUser = document.getElementById("city");
cityUser.addEventListener('change', function (event) {
    validateChampForm(event, "cityErrorMsg", regex_AdressCity);
});

// Mail
let mailUser = document.getElementById("email");
mailUser.addEventListener('change', function (event) {
    validateChampForm(event, "emailErrorMsg", regex_Mail);
});

// Afficher et prévenir
function validateChampForm(event, idMessError, regex) {
    let messError = document.getElementById(idMessError);
    if (isValidOrEmpty(event.target.value, regex)) {
        messError.innerText = " ";
    } else {
        messError.innerText = "Valeur du champ incorrecte";

        // Pour empêcher l'envoi des données du formulaire
        event.preventDefault();
    }
};

// Vérifie la valeur du champ grâce au Regex (boolean)
function isValidOrEmpty(value, regex) {
    return regex.test(value) || value == "";
};

// Envoi des données utilisateur - Btn 'Commander !'

let form = document.querySelector("form");

form.addEventListener('submit', function (event) {

    // Pour empêcher les paramètres par défaut du 'submit'
    event.preventDefault()

    let panierJS = JSON.parse(panierLS);

    let newFirstName = document.getElementById("firstName").value;
    let newLastName = document.getElementById("lastName").value;
    let newAddress = document.getElementById("address").value;
    let newCity = document.getElementById("city").value;
    let newEmail = document.getElementById("email").value;

    var arrayIdProduct = [];
    for (let canapsSelect of panierJS) {
        arrayIdProduct.push(canapsSelect.idProduit);
    };

    let contactUser = {
        contact: {
            firstName: newFirstName,
            lastName: newLastName,
            address: newAddress,
            city: newCity,
            email: newEmail
        },
        products: arrayIdProduct
    };
    console.log(arrayIdProduct);

    fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactUser)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log('Success:', data);

            let idCommandeUser = data.orderId;
            console.log(idCommandeUser);

            // Redirection vers la page 'confirmation'
            document.location.replace("../html/confirmation.html?orderId=" + idCommandeUser);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
});