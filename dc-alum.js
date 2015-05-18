'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcAlum', ['ngResource'])

// Création du controleur du wiki
.controller('dcAlumController', ['$scope', '$resource',
    function ($scope, $resource) {
        $scope.edition = false;
        // Chemin du dossier des pages dans dropbox
        var actionneur = 'http://192.168.1.30:3000';
        $scope.allumer = function () {
            console.info('allumage.');
            // Ressource des pages du wiki
            var Allumage = $resource(actionneur + '/allumer');
            Allumage.get(function () {
                console.info('allumée.');
            });
        };
        $scope.eteindre = function () {
            console.info('éteindre.');
            // Ressource des pages du wiki
            var Eteindre = $resource(actionneur + '/eteindre');
            Eteindre.get(function () {
                console.info('eteinte.');
            });
        };
    }]);