import Phaser from 'phaser';
import levelConfig from '../config/levelConfig';

export default class Enemy extends Phaser.GameObjects.Image {
    /* Se le pasa el scene donde estará el enemigo, su hubicacion xy
    y el path por el que se moverá. */
    constructor(scene, x, y, path) {
        // 'enemy' es el sprite con la imagen del enemigo.
        super(scene, x, y, 'enemy');

        this.scene = scene;
        this.path = path;
        this.hp = 0;
        this.enemySpeed = 0;
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

        // Add the enemy to our scene
        this.scene.add.existing(this);
    }
    
    // Este metodo se actualiza cada vez que lo hace el del juego.
    update(time, delta) {
        // Move the "t" point along the path
        this.follower.t += this.enemySpeed * delta;

        // Get x and y of the give "t" point
        this.path.getPoint(this.follower.t, this.follower.vec);

        // Rotate enemy
        if (this.follower.vec.y > this.y && this.follower.vec.y !== this.y) {
            this.angle = 0;
        }

        if (this.follower.vec.x > this.x && this.follower.vec.x !== this.x) {
            this.angle = -90;
        }


        // Set the x and y of our enemy
        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        // If we have reached the end of the path, remove the enemy
        if(this.follower.t >= 1) {
            this.setActive(false);
            this.setVisible(false);
            // TODO: update player health
        }
    }

    /* Este metodo llevará el estado del enemigo y al momento de morir
    lo reiniciará y lo regresará al inicio para reusarlo. */
    startOnPath() {
        // Reset health
        this.hp = levelConfig.initial.enemyHealth + levelConfig.incremental.enemyHealth;
        // Reset speed
        this.enemySpeed = levelConfig.initial.enemySpeed * levelConfig.incremental.enemySpeed;
        // Set the "t" parameter at the start of the path
        this.follower.t = 0;

        // Get x and y of the give "t" point
        this.path.getPoint(this.follower.t, this.follower.vec);

        // Set the x and y of our enemy
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
    }

    // Que ocurre cuando recibe daño
    receiveDamage(damage) {
        this.hp -= damage;

        // If hp drops below 0, we deactivate the enemy
        if(this.hp <= 0) {
            this.setActive(false);
            this.setVisible(false);
            // TODO: update the score
        }
    }
}