import Phaser from 'phaser';
import map from '../config/map';
import Enemy from '../objects/Enemy';
import Turret from '../objects/Turret';
import Bullet from '../objects/Bullet';
import levelConfig from '../config/levelConfig';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init() {
        this.map = map.map(arr => {
            /* Mapeamos todo el arreglo y lo regresamos tal
            cual y como esta... (no entendí porque hacer esto) */
            return arr.slice();
        });
        this.level = 1;
        this.nextEnemy = 0;
        this.score = 0;
        this.baseHealth = levelConfig.initial.baseHealth;
        this.availableTurrets = levelConfig.initial.numOfTurrets;
        this.roundStarted = false;
        this.remainingEnemies = levelConfig.initial.numOfEnemies;

        /* Al momento de que la Scene está cargada manda un evento
        que puede ser escuchado en otros Scenes. En este caso va a 
        ser escuchado por la de UI para activarla. */
        this.events.emit('displayUI');
        this.events.emit('updateHealth', this.baseHealth);
        this.events.emit('updateScore', this.score);
        this.events.emit('updateTurrets', this.availableTurrets);
        this.events.emit('updateEnemies', this.remainingEnemies);

        /* Grab reference to "Game" scene  */
        this.UiScene = this.scene.get('Ui');
    }

    create() {
        this.events.emit('startRound', this.level, levelConfig.initial.timeToStartGame);

        this.UiScene.events.on('roundReady', () => {
            this.roundStarted = true;
        });

        this.createMap();
        this.createPath();
        this.createCursor();
        this.createGroups();
    }

    update(time, delta) {
        // if its time for the next enemy
        if (time > this.nextEnemy && this.roundStarted && this.enemies.countActive(true) < this.remainingEnemies ) {
            /* Busca por el primer objeto del grupo que este inactivo y no visible
            y si hay uno lo regresa y si no existe ninguno, retorna null */
            let enemy = this.enemies.getFirstDead();
            if(!enemy) {
                // Creamos un nuevo enemigo
                enemy = new Enemy(this, 0, 0, this.path);
                // Lo añadimos al grupo de enemigos
                this.enemies.add(enemy);
            }

            if(enemy) {
                enemy.setActive(true);
                enemy.setVisible(true);
                
                // Place the enemy at the start of the path
                enemy.startOnPath(this.level);

                // Next enemy will apear in the next time
                this.nextEnemy = time + 2000;
            }
        }
    }

    updateScore(score) {
        this.score += score;
        this.events.emit('updateScore', this.score);
    }

    updateHealth(health) {
        this.baseHealth -= health;
        this.events.emit('updateHealth', this.baseHealth);

        if (this.baseHealth <= 0) {
            this.events.emit('hideUI');
            this.scene.start('Title');
        }
    }

    increaseLevel() {
        // Stop round
        this.roundStarted = false;
        // Increment level
        this.level++;
        // Increment number of turrets
        this.updateTurrets(levelConfig.incremental.numOfTurrets);
        // Increment number of enemies
        this.updateEnemies(levelConfig.initial.numOfEnemies + levelConfig.incremental.numOfEnemies);
        this.events.emit('startRound', this.level, levelConfig.initial.timeToStartGame);
    }

    // Actualizamos el numero de enemigos que quedan en ese nivel
    updateEnemies(numberOfEnemies) {
        this.remainingEnemies += numberOfEnemies;
        this.events.emit('updateEnemies', this.remainingEnemies);
        if(this.remainingEnemies <= 0) {
            this.increaseLevel();
        }
    }

    updateTurrets(numberOfTurrets) {
        this.availableTurrets += numberOfTurrets;
        this.events.emit('updateTurrets', this.availableTurrets);
    }

    createGroups() {
        /* Se crea un grupo de enemigos con la clase Enemy y con "runChildUpdate"
        le decimos que corra su metodo "update" de la clase Enemy cada vez que el
        de la scene corre. */
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        // Creamos el grupo para las torretas pero sin "physics"
        this.turrets = this.add.group({ classType: Turret, runChildUpdate: true });
        // Grupo de bullets
        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        /* Detecta cuando 2 objetos se enciman y lanza una función */
        this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy.bind(this))
        this.input.on('pointerdown', this.placeTurret.bind(this));
    }

    createCursor() {
        this.cursor = this.add.image(32, 32, 'cursor');
        this.cursor.setScale(2);
        this.cursor.alpha = 0;

        // Cada vez que el mouse se mueve dentro del juego se ejecuta esta fn
        this.input.on('pointermove', pointer => {
            const { x, y } = pointer;
            /* Al momento de mover el mouse se van marcando casillas donde
            es posible poner torretas usando el grid de "map.js".
            Entonces para poder poner la imagen del cursor en los diferentes
            sectores, tomamos la posicion del cursor y la dividimos entre 64
            que al ser las medidas "width: 640, height: 512," se va a dividir
            en 10 espacios para X y en 8 para Y, asi sacando los index para
            poder acomodar el cursor en la pantalla. */
            const j = Math.floor(x / 64);
            const i = Math.floor(y / 64);

            // Revisamos si el campo esta disponible o no
            if(this.canPlaceTurret(i, j)) {
                /* Si esta disponible se cambia y se hace visible */
                this.cursor.setPosition(j * 64 + 32, i * 64 + 32);
                this.cursor.alpha = 0.8;
            } else {
                // Si no esta disponible se hace invisible el cursor
                this.cursor.alpha = 0;
            }
        });
    }

    canPlaceTurret(i, j) {
        return this.map[i][j] === 0 && this.availableTurrets > 0;
    }

    createPath() {
        this.graphics = this.add.graphics();
        // The path the enemies follow
        this.path = this.add.path(96, -32);
        this.path.lineTo(96, 164);
        this.path.lineTo(480, 164);
        this.path.lineTo(480, 544);

        // Visualizing the path for debugging
        // this.graphics.lineStyle(3, 0xffffff, 1);
        // this.path.draw(this.graphics);
    }

    createMap() {
        // Create our map
        this.bgMap = this.make.tilemap({ key: 'level1' });
        // Add tileset image
        this.tiles = this.bgMap.addTilesetImage('terrainTiles_default');
        // Create our background layer
        this.backgroundLayer = this.bgMap.createStaticLayer('Background', this.tiles, 0, 0);
        // Add tower
        this.add.image(480, 480, 'base');
    }

    getEnemy(x, y, distance) {
        // Te da todos los childs del grupo "enemies"
        const enemyUnits = this.enemies.getChildren();
        for(let i = 0; i < enemyUnits.length; i++) {
            // Va a buscar por el arreglo de enemigos y va a elegir el primero
            // que encuentre que este más cerca
            if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance) {
                return enemyUnits[i];
            }
        }
        return false;
    }

    addBullet(x, y, angle) {
        let bullet = this.bullets.getFirstDead();
        if(!bullet) {
            bullet = new Bullet(this, 0, 0);
            this.bullets.add(bullet);
        }
        bullet.fire(x, y, angle);
    }

    placeTurret(pointer) {
        const { x, y } = pointer;
        const j = Math.floor(x / 64);
        const i = Math.floor(y / 64);

        if(this.canPlaceTurret(i, j)) {
            let turret = this.turrets.getFirstDead();
            if(!turret) {
                turret = new Turret(this, 0, 0, this.map);
                this.turrets.add(turret);
            }
            turret.setActive(true);
            turret.setVisible(true);
            turret.place(i, j);
            this.updateTurrets(-1);
        }
    }

    damageEnemy(enemy, bullet) {
        if(enemy.active && bullet.active) {
            bullet.setActive(false);
            bullet.setVisible(false);

            // Decrece enemy HP
            enemy.receiveDamage(levelConfig.initial.bulletDamage);
        }
    }
}
