import Phaser from 'phaser';

export default class UiScene extends Phaser.Scene {
    constructor() {
        /* Si a la scene sele pasa un objeto y este tiene la 
        propiedad active, este empieza a correr en parelelo
        en vez de cerrar la otra, por default es false y 
        esto hará que se corra desde el inicio */
        super({ key: 'Ui', active: true });
    }

    init() {
        /* Grab reference to "Game" scene  */
        this.gameScene = this.scene.get('Game');
    }

    create() {
        this.setupUIElements();
        this.setupEvents();
    }

    setupUIElements() {
        this.scoreText = this.add.text(5, 5, 'Score: 0', { fontSize: '16px', fill: '#fff' });
        this.healthText = this.add.text(10, 490, 'HP: 0', { fontSize: '16px', fill: '#fff' });
        this.turretsText = this.add.text(490, 5, 'Turrets: 0', { fontSize: '16px', fill: '#fff' });
        this.roundTimeText = this.add.text(180, 5, 'Round start in: 10s', { fontSize: '16px', fill: '#fff' });
        this.enemiesText = this.add.text(10, 470, 'Enemies remaining: 0', { fontSize: '16px', fill: '#fff' });
        this.levelText = this.add.text(0, 0, 'Level: 0', { fontSize: '40px', fill: '#fff' });
        
        // Center level text
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        Phaser.Display.Align.In.Center(
            this.levelText,
            this.add.zone(width / 2, height / 2, width, height)
        );

        this.hideUIElements();
    }

    hideUIElements() {
        this.scoreText.alpha = 0;
        this.healthText.alpha = 0;
        this.turretsText.alpha = 0;
        this.roundTimeText.alpha = 0;
        this.enemiesText.alpha = 0;
        this.levelText.alpha = 0;
    }

    setupEvents() {
        /* Hace visible el score al momento de entrar a la scene "Game"
        para que esta solo sea visible durante el juego y no todo el tiempo
        desde que incia el juego. */
        this.gameScene.events.on('displayUI', () => {
            this.scoreText.alpha = 1;
            this.healthText.alpha = 1;
            this.turretsText.alpha = 1;
            this.enemiesText.alpha = 1;
        });

        this.gameScene.events.on('updateScore', score => {
            this.scoreText.setText(`Score: ${score}`);
        });

        this.gameScene.events.on('updateEnemies', enemies => {
            this.enemiesText.setText(`Enemies remaining: ${enemies}`);
        });

        this.gameScene.events.on('updateHealth', health => {
            this.healthText.setText(`HP: ${health}`);
        });

        this.gameScene.events.on('updateTurrets', turrets => {
            this.turretsText.setText(`Turrets: ${turrets}`);
        });

        this.gameScene.events.on('hideUI', () => {
            this.hideUIElements();
        });

        this.gameScene.events.on('startRound', (level, startIn) => {
            this.roundTimeText.setText(`Round start in: 10s`);
            // Se coloca el nivel que se va a jugar
            this.levelText.setText(`Level: ${level}`);
            // Se hace visible el nivel en el que estamos
            this.levelText.alpha = 1;
            // Fade level text
            this.add.tween({
                // The object, or an array of objects, to run the tween on.
                targets: this.levelText,
                // The easing equation to use for the tween.
                ease:'Sine.easeInOut',
                // The duration of the tween in milliseconds. (default: 1000)
                duration: 1000,
                // The number of milliseconds to delay before the tween will start.
                delay: 2000,
                alpha: {
                    getStart: () => 1,
                    getEnd: () => 0
                },
                onComplete: () => {
                    // Se hace visible el contador que dice cuando iniciará la partida
                    this.roundTimeText.alpha = 1;
                    /* Se crea en evento de Phaser que nos permite usar una funcion las veces
                    que sean necesarias */
                    const timedEvent = this.time.addEvent({
                        delay: 1000, // Tiempo (milisegundos) que pasa entre funciones
                        callbackScope: this, // The scope (`this` object) with which to invoke the `callback`.
                        repeat: startIn -1, // Veces que se repetirá la fn
                        callback: () => {
                            // El ".repeatCount" muestra el numero de repeticiones de manera decreciente, osea 9, 8, 7...
                            // en cada repetición hasta llegar a 0
                            this.roundTimeText.setText(`Round start in: ${timedEvent.repeatCount}s`);

                            if (timedEvent.repeatCount === 0) {
                                this.events.emit('roundReady');
                                this.roundTimeText.alpha = 0;
                            }
                        }
                    });
                }
            });
            
        });
    }

}
