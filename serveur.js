'use strict';
// Chargement du module expressjs
var express = require('express');
// Chargement du module de gestion du système de fichier
var fs = require('fs');
// Chargement du module de gestion du port GPIO 
var gpio = require('rpi-gpio');

// Création de l'application express
var app = express();
// Configuration de l'application express
app.use(express.urlencoded());
app.use(express.json());
// Répertoire des pages du site web
var repertoireSite = 'public';
console.log('Ouverture du répertoire des pages du site web : ');
console.log(repertoireSite);
if (!fs.existsSync(repertoireSite)) {
    console.error('Répertoire des pages indisponible');
}
app.use('/lumiere', express.static(repertoireSite));

app.put('/gpio/broches/:broche', function (req, rep) {
    var broche = req.params.broche;
    console.log('Alimentation de la broche ' + broche + '.');
    gpio.setup(broche, gpio.DIR_OUT, function () {
        gpio.write(broche, true, function (err) {
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