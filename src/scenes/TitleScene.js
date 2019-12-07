import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    create() {
        this.createTitle();
        this.createPlayButton();
    }

    createTitle() {
        // Title image
        this.titleImage = this.add.image(0, 0, 'title');
        this.centerObject(this.titleImage, 1);
    }

    createPlayButton() {
        // Play button
        // El 'setInteractive' le da a la imagen eventos como el hover y otros.
        this.gameButton = this.add.sprite(0, 0, 'blueButton1').setInteractive();
        this.centerObject(this.gameButton, -1);

        this.gameText = this.add.text(0, 0, 'Play', {
            fontSize: '32px',
            fill: '#fff'
        });
        // Nos permite alinear un "gameObject" dentro de otro "gameObject" en este caso el texto con el boton
        Phaser.Display.Align.In.Center(this.gameText, this.gameButton);

        this.gameButton.on('pointerdown', pointer => {
            this.scene.start('Game');
        });

        this.gameButton.on('pointerover', pointer => {
            this.gameButton.setTexture('blueButton2');
        });

        this.gameButton.on('pointerout', pointer => {
            this.gameButton.setTexture('blueButton1');
        });
    }

    centerObject(gameObject, offset = 0) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        gameObject.x = width / 2;
        gameObject.y = height / 2 - offset * 100;
    }
}
