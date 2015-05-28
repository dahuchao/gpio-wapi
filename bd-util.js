// Chargement du module de gestion du système de fichier
var fs = require('fs');
var Hexastore = require('hexastore');
// Chargement du module de génération d'identifiant unique
var uuid = require('node-uuid');
// Chargement du module utilitaire de date
require('datejs');

var bd = new Hexastore();
bd.importZip("bd-mesure");

console.log("*********************");

// print process.argv
var commande = process.argv[2];
console.log('commande: ' + commande);
switch (commande) {
case '--lecture':
    lecture();
    break;
case '--creation':
    creation();
    break;
case '--purge':
    purge();
    break;
default:
    lecture();
}
/*
* Fonction de purge de la base de données
*/
function purge() {
    bd.clear();
    bd.exportZip("bd-mesure");
}

/*
* Fonction de lecture de la base de données
*/
function lecture() {
    var temperatures = bd.search([
        [["id"], "valeur", ["mesure"]],
        [["id"], "date", ["date"]]
    ]);
    //temperatures = bd.all();
    console.log("Les mesures (%s/%s) : ", temperatures.length, bd.size());
    for (var i = 0; i < temperatures.length; i++) {
        var temperature = temperatures[i];
        //var date = new Date(temperature.date);
        //var strDate = date.toString('d-MM-yyyy/HH:mm');
        //temperature.date = strDate;
        console.log("- mesure %s du %s: %s.", temperature.id, temperature.date, temperature.mesure);
    }
}

/*
* Fonction de création d'une mesure dans la base de données
*/
function creation() {
    var mesure = new Object();
    var temperature = Math.floor((Math.random() * 50) + 1);
    // Génération d'un identifiant pour la nouvelle mesure
    var id = uuid.v1();
    // Date du jour
    var maintenant = new Date();
    var date = new Date(maintenant);
    var strDate = date.toString('d-MM-yyyy/HH:mm');
    mesure.id = id;
    mesure.date = strDate;
    mesure.valeur = temperature;
    console.log("nouvelle mesure: %s", JSON.stringify(mesure));
    // Ajout dans le graph
    //bd.addSPO(mesure);
    bd.put([id, "date", mesure.date]);
    bd.put([id, "valeur", mesure.valeur]);
    // enregistrement de la base
    bd.exportZip("bd-mesure");
}

console.log("---------------------");