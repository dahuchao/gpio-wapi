// Chargement du module de gestion du système de fichier
var fs = require('fs');
var Hexastore = require('Hexastore');
require('datejs');

var db = new Hexastore();
db.importZip("bd-mesure");

var dateReference = (3).minute().ago();
var temperatures = db.search([
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
var dbRes = new Hexastore();
console.log("Les des mesures avant : %s (%s)", dateReference, temperatures.length);
console.log("*********************");
for (var i = 0; i < temperatures.length; i++) {
    var temperature = temperatures[i];
    dbRes.put([temperature.id, "date", temperature.date]);
    dbRes.put([temperature.id, "valeur", temperature.mesure]);
    var date = new Date(temperature.date);
    console.log("- Mesure le %s, valeur: %s.", date.toString('d-MMM-yyyy/HH:mm'), temperature.mesure);
}
dbRes.exportZip("bd-mesure");
console.log("---------------------");