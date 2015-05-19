API Web pour travailler le port GPIO d'un RASPBERRY PI
======================================================

Introduction
------------

Serveur web offrant une API Web REST full sur un RASPBERRY PI pour la consultation de l'état du port GPIO. Le serveur présente également des composants web (Web Component du W3C).

Exemple : HTTP GET http://www/gpio/5
La requête renvoie l'état du canal pin 5 du port GPIO.

Exemple : 


Documentation
-------------

### Installation

L'installation de nodejs est un prérequis.
L'installation de bower est un prérequis.
> sudo npm install bower -g

Dans le répertoire de l'application lancer la commande de résolution des dépendance npm.
> npm install

Dans le répertoire de l'application lancer la commande de résolution des dépendances bower.
> bower install

