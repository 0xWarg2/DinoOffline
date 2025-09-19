import Phaser from 'phaser'
import BootScene from './scenes/BootScene.js'
import MenuScene from './scenes/MenuScene.js'
import GameScene from './scenes/GameScene.js'
import { GAME_HEIGHT, GAME_WIDTH } from './config/constants.js'

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  pixelArt: true,
  antialias: false,
  scale: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 2,
  },
  scene: [BootScene, MenuScene, GameScene],
}

new Phaser.Game(config)
