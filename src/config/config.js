export default {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 640,
    height: 512,
    // Se le dice a Phaser que se va a usar arte de pixeles 
    // en el juego y hace que no se vea tan pixelado
    pixelArt: true,
    // Hace que cuando el arte de pixeles se esta cargando en
    // el canvas este no e vea blurri y algo más...
    roundPixels: true,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 0 }
      }
    }
  };