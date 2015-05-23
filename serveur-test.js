/*************************************************
Serveur pour le traitement des mesures sur la sonde de température du RASPBERRY PI.
**************************************************/
// Chargement du module d'utilitaire lodash
var _ = require('lodash');
// Chargement du module expressjs
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
// Chargement du module de gestion du système de fichier
var fs = require('fs');
// Chargement du module de gestion du port GPIO 
var gpio = require('rpi-gpio');
// Chargement du module de génération d'identifiant unique
var uuid = require('node-uuid');
// Chargement du module de lecture des capteurs DS18B20
var ds18b20 = require('ds18b20');
// Chargement du module utilitaire de date
require('datejs');
// Initialisation du capteur
ds18b20.sensors(function (err, ids) {
    console.log("Identifians des capteurs w1 : %s", ids);
    // got sensor IDs ...
});
// Création de l'application express
var app = express();
// Définition du parseur du corp des requête
app.use(bodyParser.json());
// Définition de l'encodage des caractères
app.use(bodyParser.urlencoded({
    extended: true
}));
// for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
// Répertoire des pages du site web
var repertoireSite = 'public';
console.log('Ouverture du répertoire des pages du site web : %s', repertoireSite);
// Si le répertoire n'existe pas
if (!fs.existsSync(repertoireSite)) {
    // Information de l'utilisateur
    console.error('Répertoire des pages indisponible');
}
// Définition de l'URI du site web
app.use('/lumiere', express.static(repertoireSite));
// Méthode de lecture de la liste des températures
app.get('/gpio/temperatures', function (req, rep) {
    console.log("/gpio/temperatures");
    rep.send(null);
});
//**********************************************
// Serveur de l'API Web de la sonde de température
// Démarrage du serveur http
var serveur = app.listen(3000, function () {
    console.log('Ecoute sur le port %d', serveur.address().port);
});
//**********************************************
// Serveur de publication mesures de la sonde de température
// Chargement de socket.io
var io = require('socket.io').listen(serveur);
// Socket de composant web graphique des températures
var socketGraphique;
// Quand on client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    socket.emit('message', 'Vous êtes bien connecté !');
    socketGraphique = socket;
    console.log('Un client est connecté !');
});
// Méthode de capture d'une mesure sur la sonde de température
function capturerTemperature() {
    // Prise d'une mesure sur la sonde de température
    ds18b20.temperature('28-000006375d98', function (err, temperature) {
        // Si une erreur s'est produite
        if (err) {
            // Simulation d'une mesure par un calcul aléatoire
            temperature = Math.floor((Math.random() * 50) + 1);
            // Journalisation de la mesure
            console.log('Temperature simulée %d', temperature);
        } else {
            // Journalisation de la mesure
            console.log('Temperature courante %d', temperature);
        }
        // Génération d'un identifiant pour la nouvelle mesure
        var id = uuid.v1();
        // Date du jour
        var maintenant = new Date();
        var date = new Date(maintenant);
        var strDate = date.toString('d-MM-yyyy/HH:mm');
        temperature.date = strDate;
        var mesure = new Object();
        mesure.date = strDate;
        mesure.valeur = temperature;
        // Emission d'un message en direction du graphique historique des mesures
        socketGraphique.emit('mesure', mesure);
    });
};
// Ordonnanceur des prises de température
setInterval(capturerTemperature, 10000);