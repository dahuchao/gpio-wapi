// Chargement du module de gestion du système de fichier
var fs = require('fs');
var Hexastore = require('hexastore');
// Chargement du module de génération d'identifiant unique
var uuid = require('node-uuid');
// Chargement du module utilitaire de date
require('datejs');

console.log("*********************");

// Calcul de la commande utilisateur
var commande = process.argv[2];
// Journalisation de la commande
console.log('commande: ' + commande);
// Aiguillage de la commande vers sa fonction
switch (commande) {
case '--init':
    initialisation();
    break;
case '--lecture':
    lecture();
    break;
case '--creation':
    creation();
    break;
case '--nettoyage':
    nettoyage();
    break;
case '--purge':
    purge();
    break;
default:
    lecture();
}

/*
 * Fonction d'initialisation de la base de données
 */
function nettoyage() {
    var bd = new Hexastore();
    bd.importZip("bd-mesure");
    var dateReference = (3).minute().ago();
    var temperatures = bd.search([
        [["id"], "valeur", ["mesure"]],
        [["id"], "date", ["date"]]
    ]).filter(function (match) {
        var dateCourante = new Date(match.date);
        //console.log("match date : " + dateCourante);
        var comparaison = Date.compare(dateCourante, dateReference);
        var dateFiltrée = true;
        if (comparaison < 0) {
            dateFiltrée = false
        }
        return dateFiltrée;
    });
    var bdRes = new Hexastore();
    console.log("Les des mesures avant : %s (%s)", dateReference, temperatures.length);
    console.log("*********************");
    for (var i = 0; i < temperatures.length; i++) {
        var temperature = temperatures[i];
        bdRes.put([temperature.id, "date", temperature.date]);
        bdRes.put([temperature.id, "valeur", temperature.mesure]);
        var date = new Date(temperature.date);
        console.log("- Mesure le %s, valeur: %s.", date.toString('d-MMM-yyyy/HH:mm'), temperature.mesure);
    }
    bdRes.exportZip("bd-mesure");
    console.log("---------------------");
}

/*
 * Fonction d'initialisation de la base de données
 */
function initialisation() {
    var bd = new Hexastore();
    var id = uuid.v1();
    var maintenant = new Date()
    bd.put([id, "date", maintenant]);
    temperature = Math.floor((Math.random() * 50) + 1);
    bd.put([id, "valeur", temperature]);
    bd.exportZip("bd-mesure");
}

/*
 * Fonction de purge de la base de données
 */
function purge() {
    var bd = new Hexastore();
    bd.importZip("bd-mesure");
    bd.clear();
    bd.exportZip("bd-mesure");
}

/*
 * Fonction de lecture de la base de données
 */
function lecture() {
    var bd = new Hexastore();
    bd.importZip("bd-mesure");
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
    var bd = new Hexastore();
    bd.importZip("bd-mesure");
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