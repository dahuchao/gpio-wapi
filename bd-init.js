// Chargement du module de gestion du système de fichier
var fs = require('fs');
var uuid = require('node-uuid');
var Hexastore = require('Hexastore');
var db = new Hexastore();
var id = uuid.v1();
var maintenant = new Date()
db.put([id, "date", maintenant]);
temperature = Math.floor((Math.random() * 50) + 1);
db.put([id, "valeur", temperature]);
db.exportZip("bd-mesure");
