import Phaser from 'phaser';
import map from '../config/map';

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
    }

    create() {
        this.createMap();
        this.createPath();
        this.createCursor();
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
        return this.map[i][j] === 0;
    }

    createPath() {
        this.graphics = this.add.graphics();
        // The path the enemies follow
        this.path = this.add.path(96, -32);
        this.path.lineTo(96, 164);
        this.path.lineTo(480, 164);
        this.path.lineTo(480, 544);

        // Visualizing the path for debugging
        this.graphics.lineStyle(3, 0xffffff, 1);
        this.path.draw(this.graphics);
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
}
