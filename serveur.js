// Chargement du module expressjs
var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
// Chargement du module de gestion du système de fichier
var fs = require('fs');
// Chargement du module de gestion du port GPIO 
var gpio = require('rpi-gpio');
var uuid = require('node-uuid');
var Hexastore = require('Hexastore');
var mydb = new Hexastore();

// Création de l'application express
var app = express();
app.use(bodyParser.json());
// Configuration de l'application express
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

// Répertoire des pages du site web
var repertoireSite = 'public';
console.log('Ouverture du répertoire des pages du site web : ');
console.log(repertoireSite);
if (!fs.existsSync(repertoireSite)) {
    console.error('Répertoire des pages indisponible');
}
app.use('/lumiere', express.static(repertoireSite));

function nettoyer(saleBody) {
    //format de req.body { '{"etat":true}': ''}
    var keys = Object.keys(saleBody);
    var body = keys[0];
    body = JSON.parse(body);
    return body;
}

app.get('/gpio/temperatures', function (req, rep) {
    var db = new Hexastore();
    db.importZip("bd-mesure");
    var temperatures = db.search([
        [["id"], "valeur", ["mesure"]],
        [["id"], "date", ["date"]]
    ]);
    console.log("Les des mesures : ");
    console.log("*********************");
    for (var i = 0; i < temperatures.length; i++) {
        var temperature = temperatures[i];
        //debugger;
        console.log("Le " + temperature.date + " mesure: " + temperature.mesure);
    }
    console.log("---------------------");
    rep.send(temperatures);
});

app.post('/gpio/temperature', function (req, rep) {
    var db = new Hexastore();
    db.importZip("bd-mesure");
    var id = uuid.v1();
    var maintenant = new Date()
    db.put([id, "date", maintenant]);
    temperature = Math.floor((Math.random() * 50) + 1);
    db.put([id, "valeur", temperature]);
    db.exportZip("bd-mesure");
    console.log("Ajout de la mesure: " + temperature);
    rep.send(temperature);
});

app.put('/gpio/led', function (req, rep) {
    //format de req.body { '{"etat":true}': ''} objet Json mal formatté par Polymer
    body = nettoyer(req.body);
    var etat = body.etat;
    var db = new Hexastore();
    db.importZip("bd-mesure");
    var id = uuid.v1();
    var maintenant = new Date()
    db.put([id, "date", maintenant]);
    temperature = Math.floor((Math.random() * 50) + 1);
    db.put([id, "valeur", temperature]);
    db.exportZip("bd-mesure");
    console.log("Modification de l'état de la led: " + etat);
});

app.put('/gpio/broches/:broche', function (req, rep) {
    var broche = req.params.broche;
    console.log('Modification de la broche ' + broche + ':' + req.body);
    gpio.setup(broche, gpio.DIR_OUT, function () {
        // Calcul du nouvel état de la broche
        var etat = req.body.etat;
        // Changement de l'état de la broche
        gpio.write(broche, etat, function (err) {
            if (err) throw err;
            rep.send('Allumage de la broche: ' + broche);
        });
    });
});

app.get('/gpio/broches/:broche', function (req, rep) {
    var idBroche = req.params.broche;
    console.log('Lecture de la broche ' + idBroche + ' du GPIO.');
    gpio.setup(idBroche, gpio.DIR_IN, function () {
        gpio.read(idBroche, function (err, etat) {
            if (err) throw err;
            var broche = {
                context: {
                    gpio: 'http://www/',
                },
                '@id': 'http://www/gpio/broches/7',
                '@type': 'gpio:Etat',
                etat: etat
            }
            rep.send(broche);
        });
    });
});

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

app.get('/eteindre', function (req, res) {
    res.send('Eteindre le canal 7.');
    gpio.write(7, false, function (err) {
        if (err) throw err;
        console.log('Extinction du canal 7.');
    });
});

//**********************************************
// Démarrage du serveur
var serveur = app.listen(3000, function () {
    console.log('Ecoute sur le port %d', serveur.address().port);
});