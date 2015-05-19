Composant et API Web pour travailler le port GPIO d'un RASPBERRY PI
======================================================

Introduction
------------

Serveur web offrant une API Web REST full sur un RASPBERRY PI pour la consultation de l'état du port GPIO. Le serveur présente également des composants web (Web Component du W3C).

Ce service est une application de l'API rpi-gpio : https://www.npmjs.com/package/rpi-gpio

Ce service est une application du web sémantique des données. Les données échangées respectent le format RDF, la syntaxe json-ld (W3C) et hydra (W3C) et définit un vocabulaire pour la description de l'état d'une port GPIO sur RASPBERRY.

Ce service est une application Polymer (ou plutot sera).

### Exemples

Lire l'état de la broche (pin) 7 du port GPIO.

Requête : 

    GET /gpio/broches/7 HTTP/1.1
    Host: <www>

Réponse : 

    HTTP1/1 200 OK
    
    {
        context:{
            gpio: http://www/gpio/vocabulaire
        }
        @id: http://www/gpio/broches/7,
        @type: gpio:Etat,
        etat: true
    }

La requête renvoie l'état de la broche (pin) 7 du port GPIO.

Exemple d'intégration dans une page web.

    <gpio-broche>7</gpio-broche>
    
    <!-- Import element -->
    <link rel="import" href="gpio-broche.html">
    
    <!-- Use element -->
    <gpio-broche pin="7"></gpio-broche>

Documentation
-------------

### Installation

L'installation et la configuration réseau du RASPBERRY PI est un prérequis.

L'installation de nodejs est un prérequis.

L'installation de bower est un prérequis :
> sudo npm install bower -g

Installer le matériel :-)
> git clone https://github.com/dahuchao/gpio-wapi.git

Dans le répertoire de l'application lancer la commande de résolution des dépendance npm : 
> npm install

Dans le répertoire public de l'application lancer la commande de résolution des dépendances bower : 
> cd public
> bower install

### Utilisation

Lancer le serveur : 
> sudo node serveur.js

Le serveur est à l'écoute sur le port 3000 à l'adresse de votre RASPBERRY PI.

Ouvrir votre navigateur préféré à l'adresse suivante : http://<addresse-ip-pi>:3000/lumiere

