'use strict';
// Chargement du module expressjs
var express = require('express');
// Chargement du module de gestion du système de fichier
var fs = require('fs');
// Création de l'application express
var app = express();
// Configuration de l'application express
app.use(express.urlencoded());
app.use(express.json());
// Répertoire des pages du site web
var repertoireSite='C:\\Travail\\Chantiers\\testRaspberry';
console.log('Ouverture du répertoire des pages du site web : ');
console.log(repertoireSite);
if(!fs.existsSync(repertoireSite)){
    console.error('Répertoire des pages indisponible');
}
app.use('/lumiere', express.static(repertoireSite));

//**********************************************
// Démarrage du serveur
var serveur = app.listen(3000, function () {
    console.log('Ecoute sur le port %d', serveur.address().port);
});