import Phaser from 'phaser';

export default class Bullet extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');

        this.scene = scene;
        this.dx = 0;
        this.dy = 0;
        // La bala desaparece despues de cierta distancia
        this.lifespan = 0;
        /* El primeero es la distancia que recorrerá y el segundo en cuanto tiempo (milisegundos)
        recorre la distancia */
        this.speed = Phaser.Math.GetSpeed(600, 1);

        // Add the bullet to the game
        this.scene.add.existing(this);
    }

    update(time, delta) {
        // Se trakea hasta cuando la bala ya no está viva
        this.lifespan -= delta;
        
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);

        if(this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

    fire(x, y, angle) {
        this.setActive(true);
        this.setVisible(true);

        // update position of bullet
        this.setPosition(x, y);

        // Calcula la trayectoria por la que la bala tiene que ir
        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);

        this.lifespan = 300;
    }
}