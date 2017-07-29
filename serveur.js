/*************************************************
Serveur pour le traitement des mesures sur la sonde de température du RASPBERRY PI.
**************************************************/
// Chargement du module d'utilitaire lodash
//var _ = require('lodash');
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
// Chargement du module de base de données en model de graphe Hexastore
var Hexastore = require('hexastore');
// Chargement du module de lecture des capteurs DS18B20
var ds18b20 = require('ds18b20');
// Chargement du module utilitaire de date
require('datejs');
// Initialisation du capteur
ds18b20.sensors(function (err, ids) {
    console.log("Identifiants des capteurs w1 : %s", ids);
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
app.use('/', express.static(repertoireSite));
// Méthode de nettoyage du corp des requêtes provenant polymer core-ajax
function nettoyer(saleBody) {
    //format de req.body { '{"etat":true}': ''}
    var keys = Object.keys(saleBody);
    var body = keys[0];
    body = JSON.parse(body);
    return body;
};
// Méthode de lecture de la liste des températures
app.get('/gpio/temperatures', function (req, rep) {
    console.log("/gpio/temperatures");
    var bd = new Hexastore();
    bd.importZip("bd-mesure");
    var temperatures = bd.search([
        [["id"], "valeur", ["valeur"]],
        [["id"], "date", ["date"]]
    ]);
    console.log("Les mesures (%s) : ", temperatures.length);
    console.log("*********************");
    for (var i = 0; i < temperatures.length; i++) {
        if (i > 20) break;
        var temperature = temperatures[i];
        var date = new Date(temperature.date);
        var strDate = date.toString('d-MM-yyyy/HH:mm');
        //temperature.date = strDate;
        console.log("Le %s mesure: %s.", temperature.date, temperature.valeur);
    }
    console.log("---------------------");
    rep.send(temperatures);
});
// Méthode d'enregistrement d'une nouvelle mesure de température prise sur le serveur
app.post('/gpio/temperature', function (req, rep) {
    var bd = new Hexastore();
    bd.importZip("bd-mesure");
    var id = uuid.v1();
    var maintenant = new Date();
    bd.put([id, "date", maintenant]);
    temperature = Math.floor((Math.random() * 50) + 1);
    bd.put([id, "valeur", temperature]);
    bd.exportZip("bd-mesure");
    console.log("Ajout de la mesure: " + temperature);
    rep.send(temperature);
});
// Méthode de lecture de l'état d'une broche du GPIO du serveur RASPBERRY
app.get('/gpio/broches/:broche', function (req, rep) {
    console.log("get/gpio/broches/:broche");
    var idBroche = req.params.broche;
    console.logl('Lecture de la broche %s du GPIO.', idBroche);
    gpio.setup(idBroche, gpio.DIR_IN, function (erreur) {
        if (erreur) {
            rep.send(erreur);
        } else {
            gpio.read(idBroche, function (erreur, etat) {
                if (erreur) {
                    rep.send(erreur);
                } else {
                    var broche = {
                        context: {
                            gpio: 'http://www/',
                        },
                        '@id': 'http://www/gpio/broches/7',
                        '@type': 'gpio:Etat',
                        etat: etat
                    }
                    rep.send(broche);
                }
            });
        }
    });
});
// Méthode de changement de l'état d'une broche du GPIO du serveur RASPBERRY
app.get('/gpio/test', function (req, rep) {
    console.log("put/gpio/test");
    var ret = new Object();
    ret.valeur = "valeur test";
    console.log("Retour : %s", JSON.stringify(ret));
    rep.send(ret);
});
// Méthode de changement de l'état d'une broche du GPIO du serveur RASPBERRY
app.put('/gpio/broches/:broche', function (req, rep) {
    console.log("put/gpio/broches/:broche");
    var broche = req.params.broche;
    console.log('Modification de la broche %s:%s', broche, req.body);
    var etat = req.body.etat;
    console.log('Modification de la broche %s:%s', broche, etat);
    gpio.setup(broche, gpio.DIR_OUT, function (erreur) {
        if (erreur) {
            rep.send(erreur);
        } else {
            // Calcul du nouvel état de la broche
            var etat = req.body.etat;
            // Changement de l'état de la broche
            gpio.write(broche, etat, function (erreur) {
                if (erreur) {
                    rep.send(erreur);
                } else {
                    rep.send('Changement état broche(%s): %s.', broche, etat);
                }
            });
        }
    });
});
// Méthode de changement de l'état de la LED
app.put('/gpio/led', function (req, rep) {
    //format de req.body { '{"etat":true}': ''} objet Json mal formatté par Polymer
    body = nettoyer(req.body);
    var etat = body.etat;
    var bd = new Hexastore();
    bd.importZip("bd-mesure");
    var id = uuid.v1();
    var maintenant = new Date()
    bd.put([id, "date", maintenant]);
    temperature = Math.floor((Math.random() * 50) + 1);
    bd.put([id, "valeur", temperature]);
    bd.exportZip("bd-mesure");
    console.log("Modification de l'état de la led: " + etat);
});
// Méthode pour allumer la LED du serveur
app.get('/allumer', function (req, res) {
    res.send('Allumage du canal 7.');
    gpio.setup(7, gpio.DIR_OUT, write);

    function write() {
        gpio.write(7, true, function (err) {
            if (err) throw err;
            console.log('Alimentation du canal 7.');
        });
    }
});
// Méthode pour éteindre la LED du serveur
app.get('/eteindre', function (req, res) {
    res.send('Eteindre le canal 7.');
    gpio.write(7, false, function (err) {
        if (err) throw err;
        console.log('Extinction du canal 7.');
    });
});
//**********************************************
// Serveur de l'API Web de la sonde de température
// Démarrage du serveur http
var serveur = app.listen(3000, function () {
    var host = serveur.address().address;
    var port = serveur.address().port;
    console.log('< Adresse application http://%s:%s', host, port);
});
//**********************************************
// Serveur de publication mesures de la sonde de température
// Chargement de socket.io
var io = require('socket.io').listen(serveur);
// Socket des abonnés au flux de publication des mesures de la sonde de température
var socketAbonnes = new Array();
// Quand on client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    socket.emit('message', 'Vous êtes bien connecté !');
    socketAbonnes.push(socket);
    console.log('Nouvel abonné à la publication des mesures !');
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
        var mesure = new Object();
        mesure.date = strDate;
        mesure.valeur = temperature;
        // Création d'une base de données
        var bd = new Hexastore();
        // Intialisation de la base de données
        bd.importZip("bd-mesure");
        // Enregistrement en base
        bd.put([id, "date", maintenant]);
        bd.put([id, "valeur", temperature]);
        // Enregistrement de la base de données des mesures de température
        bd.exportZip("bd-mesure");
        // Emission d'un message en direction du graphique historique des mesures
        for (i = 0; i < socketAbonnes.length; i++) {
            var socket = socketAbonnes[i];
            socket.emit('temperature', mesure);
        }
    });
};
// Ordonnanceur des prises de température
setInterval(capturerTemperature, 10000);
