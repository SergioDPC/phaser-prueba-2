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
        this.hideUIElements();
    }

    hideUIElements() {
        this.scoreText.alpha = 0;
        this.healthText.alpha = 0;
    }

    setupEvents() {
        /* Hace visible el score al momento de entrar a la scene "Game"
        para que esta solo sea visible durante el juego y no todo el tiempo
        desde que incia el juego. */
        this.gameScene.events.on('displayUI', () => {
            this.scoreText.alpha = 1;
            this.healthText.alpha = 1;
        });

        this.gameScene.events.on('updateScore', score => {
            this.scoreText.setText(`Score: ${score}`);
        });

        this.gameScene.events.on('updateHealth', health => {
            this.healthText.setText(`HP: ${health}`);
        });

        this.gameScene.events.on('hideUI', () => {
            this.hideUIElements();
        });
    }

}
