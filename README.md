API Web pour travailler le port GPIO d'un RASPBERRY PI
======================================================

Introduction
------------

Serveur web offrant une API Web REST full sur un RASPBERRY PI pour la consultation de l'état du port GPIO. Le serveur présente également des composants web (Web Component du W3C).

### Exemple : 

Lire l'état du canal 5 du port GPIO.
Requête : 

    GET /gpio/5 HTTP/1.1
    Host: <www>

Réponse : 

    HTTP1/1 200 OK
    
    {
        context:{
            gpio: http://www/gpio/vocabulaire
        }
        id: http://www/gpio/5,
        type: gpio:Etat,
        etat: true
    }

La requête renvoie l'état du canal pin 5 du port GPIO.

Exemple d'intégration dans une page web.

Ce service est une application de l'API rpi-gpio : https://www.npmjs.com/package/rpi-gpio
Ce service est une application Polymer (ou plutot sera) : 

    <pi-gpio>7</pi-gpio>
 

Documentation
-------------

### Installation

L'installation de nodejs est un prérequis.
L'installation de bower est un prérequis :
> sudo npm install bower -g

Dans le répertoire de l'application lancer la commande de résolution des dépendance npm : 
> npm install

Dans le répertoire de l'application lancer la commande de résolution des dépendances bower : 
> bower install

### Utilisation

Lancer le serveur web expressjs : 
> sudo node serveur.js

Le serveur est à l'écoute sur le port 3000 à l'adresse de votre RASPBERRY PI.

Ouvrir votre navigateur préféré à l'adresse suivante : http://<addresse-ip-pi>:3000/lumiere

