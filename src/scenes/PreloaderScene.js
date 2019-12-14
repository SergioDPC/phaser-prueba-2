import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    /* El init es uno de los metodos pre construidos.
       Cuando la Scene es inicializada este metodo será
       llamado primero antes que el 'preload' */
    init() {
        this.readyCount = 0;
    }

    preload() {
        // Time event for logo
        this.timedEvent = this.time.delayedCall(2000, this.ready, [], this);
        this.createPreloader();
        this.loadAssets();
    }

    createPreloader() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add logo image
        this.add.image(width / 2, height / 2 - 100, 'logo');

        // Display progress bar
        /* 'this.add.graphics' nos permite crear graficos sin tener que usar imagenes.
            En este caso lo creamos para crear una barra de carga simple */
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);

        // Loading text
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading',
            style: {
                font: '20px monospace',
                fill: '#fff'
            }
        });
        loadingText.setOrigin(0.5,0.5);

        // Porcent text
        const porcentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#fff'
            }
        });
        porcentText.setOrigin(0.5,0.5);

        // Loading assets text
        const assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#fff'
            }
        });
        assetText.setOrigin(0.5,0.5);

        // Update progress bar
        this.load.on('progress', value => {
            porcentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
        });

        // Update file progress text
        this.load.on('fileprogress', file => {
            assetText.setText(`Loading asset: ${file.key}`);
        });

        // Remove progress bar when complete
        this.load.on('complete', () => {
            progressBox.destroy();
            progressBar.destroy();
            assetText.destroy();
            loadingText.destroy();
            porcentText.destroy();
            this.ready();
        });
    }

    loadAssets() {
        // Load assets needed in our game
        this.load.image('bullet', '/src/assets/level/bulletDark2_outline.png');
        this.load.image('tower', '/src/assets/level/tank_bigRed.png');
        this.load.image('enemy', '/src/assets/level/tank_sand.png');
        this.load.image('base', '/src/assets/level/tankBody_darkLarge_outline.png');
        this.load.image('title', '/src/assets/ui/title.png');
        this.load.image('cursor', '/src/assets/ui/cursor.png');
        this.load.image('blueButton1', '/src/assets/ui/blue_button02.png');
        this.load.image('blueButton2', '/src/assets/ui/blue_button03.png');

        // Placeholder
        // this.load.image('logo2', '/src/assets/logo.png');

        // Tile map in JSON formart
        this.load.tilemapTiledJSON('level1', '/src/assets/level/level1.json');
        this.load.spritesheet('terrainTiles_default', '/src/assets/level/terrainTiles_default.png', {
            frameWidth: 64, frameHeight: 64
        });
    }

    /* El ready lo creamos para cambiar de scene.
       En este caso se lanzará en una de los 2 casos:
       - Que el juego haya terminado de cargar todo y luego
       termine de pasar 1 segundo imedio
       - Que pase un segundo imedio y aun siga cargando assets
       y cambie al terminar de cargarlos */
    ready() {
        /* Este metodo lo creamos para que se vea el logo en pantalla 
        auqnue sea un rato antes de entrar al juego */
        this.readyCount ++;
        if(this.readyCount === 2) {
            this.scene.start('Title');
            // this.scene.start('Game');
        }
    }

    /* create() {
        // this.scene.start('Game');
    } */
}
