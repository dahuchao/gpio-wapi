// Chargement du module de gestion du système de fichier
var fs = require('fs');
var Hexastore = require('hexastore');

var db = new Hexastore();
db.importZip("bd-mesure");

var temperatures = db.search([
        [["id"], "valeur", ["mesure"]],
        [["id"], "date", ["date"]]
    ]);
dbRes.exportZip("bd-mesure");
console.log("---------------------");