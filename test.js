//var exemple = "{ '{\"etat\":true}': ''}";
var req = "{ '{\"etat\":true}': ''}";
console.log("req: " + req);
//var reg = /{ '({.*})': ''}/g;
var reg = new RegExp("{ '({.*})': ''}", 'g');
//if (!reg.test(req)) throw err;
var res = reg.exec(req);
console.log("res: " + res);
//var res = res.match(reg);
//console.log("res: " + res);
var body = res[1];
console.log("body: " + body);
body = JSON.parse(body);
var etat = body.etat;
console.log("etat: " + etat);
//debugger;

// Chargement du module de gestion du système de fichier
var fs = require('fs');
var Hexastore = require('Hexastore');
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
    var date = new Date(temperature.date);
    //debugger;
    console.log("Le " + date.toDateString() + " mesure: " + temperature.mesure);
}
console.log("---------------------");