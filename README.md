Composant et API Web pour travailler le port GPIO d'un RASPBERRY PI
======================================================

Introduction
------------

Serveur web offrant une API Web REST full sur un RASPBERRY PI pour la consultation de l'état du port GPIO. Le serveur présente également des composants web (Web Component du W3C).

Ce service est une application de l'API rpi-gpio : https://www.npmjs.com/package/rpi-gpio

Ce service est une application du web sémantique des données. Les données échangées respectent le format RDF, la syntaxe json-ld (W3C) et hydra (W3C) et définit un vocabulaire pour la description de l'état d'une port GPIO sur RASPBERRY.

Ce service est une application de Web component Polymer.

### Exemples

#### Lire l'état de la broche (pin) 7 du port GPIO.

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

    <!-- Import element -->
    <link rel="import" href="gpio-broche.html">
    
    <!-- Use element -->
    <gpio-broche pin="7"></gpio-broche>

#### Consulter le graphique historique de la sonde de température

    <!-- Import element -->
    <link rel="import" href="gpio-sonde-temperature.html">
    
    <!-- Use element -->
    <gpio-sonde-temperature></gpio-sonde-temperature>

Documentation
-------------

### Installation

`docker build -t dahu.chao/gpio-wapi .`
`docker run -d -p 3000:3000 dahu.chao/gpio-wapi`

L'installation et la configuration réseau du RASPBERRY PI est un prérequis.

L'installation de nodejs est un prérequis.

Installer les sources de l'application
> git clone https://github.com/dahuchao/gpio-wapi.git

Dans le répertoire de l'application lancer la commande de résolution des dépendances npm : 
> npm install

Lancement
> npm start

#### Lancement pas docker

Fabrication de l'image applicative

`docker build -t dahu.chao/gpio-wapi .`

Démarrage d'un conteneur

`docker run -d -p 3000:3000 dahu.chao/gpio-wapi`

### Utilisation

Lancer le serveur : 
> sudo node serveur.js
< Ouvrir l'application dans votre navigateur à l'adresse http://[addresse-ip-pi]:[port-ip-pi]/lumiere

Le service communique l'adresse de l'application web.

Documentation complète sur le wiki : https://github.com/dahuchao/gpio-wapi/wiki
