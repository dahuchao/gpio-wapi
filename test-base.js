// Chargement du module de gestion du système de fichier
var fs = require('fs');
var Hexastore = require('hexastore');
// Chargement du module de génération d'identifiant unique
var uuid = require('node-uuid');
// Chargement du module utilitaire de date
require('datejs');

var bd = new Hexastore();
bd.importZip("bd-mesure");

var temperatures = bd.search([
        [["id"], "valeur", ["mesure"]],
        [["id"], "date", ["date"]]
    ]);


console.log("Les mesures (%s/%s) : ", temperatures.length, bd.size());
console.log("*********************");
for (var i = 0; i < temperatures.length; i++) {
    if (i > 20) break;
    var temperature = temperatures[i];
    var date = new Date(temperature.date);
    var strDate = date.toString('d-MM-yyyy/HH:mm');
    temperature.date = strDate;
    console.log("- mesure %s du %s: %s.", temperature.id, strDate, temperature.mesure);
}

var temperature = Math.floor((Math.random() * 50) + 1);
// Génération d'un identifiant pour la nouvelle mesure
var id = uuid.v1();
// Date du jour
var maintenant = new Date();
var date = new Date(maintenant);
var strDate = date.toString('d-MM-yyyy/HH:mm');
var mesure = new Object();
mesure.date = strDate;
mesure.valeur = temperature;
// Enregistrement en base
bd.put([id, "date", mesure.date]);
bd.put([id, "valeur", mesure.valeur]);

bd.exportZip("bd-mesure");
console.log("---------------------");