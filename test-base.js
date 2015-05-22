// Chargement du module de gestion du système de fichier
var fs = require('fs');
var Hexastore = require('Hexastore');
require('datejs');

var dateReference = (3).hour().ago();
var db = new Hexastore();
db.importZip("bd-mesure");
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
    return true;
});
var dbRes = new Hexastore();
console.log("Les des mesures avant : " + dateReference);
console.log("*********************");
for (var i = 0; i < temperatures.length; i++) {
    var temperature = temperatures[i];
    dbRes.put([temperature.id, "date", temperature.date]);
    dbRes.put([temperature.id, "valeur", temperature.mesure]);
    var date = new Date(temperature.date);
    console.log("- Mesure : " + temperature.id + " le " + date.toString('d-MMM-yyyy/HH:mm') + " valeur: " + temperature.mesure);
}
//dbRes.exportZip("bd-mesure");
console.log("---------------------");