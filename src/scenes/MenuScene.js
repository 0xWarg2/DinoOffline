import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../config/constants.js'
import { ScoreManager } from '../utils/score.js'

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    this.scoreManager = new ScoreManager()
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xffffff).setOrigin(0, 0)

    this.dino = this.add.sprite(GAME_WIDTH / 2 - 16, GAME_HEIGHT / 2 - 48, 'dino-stand')
    this.dino.setOrigin(0, 0)
    this.dino.anims.play('dino-run')

    const title = this.add.text(32, 64, 'No Internet', {
      fontFamily: 'Segoe UI, Tahoma, sans-serif',
      fontSize: '24px',
      color: '#222',
    })

    this.add.text(32, 112, 'Try:', {
      fontFamily: 'Segoe UI, Tahoma, sans-serif',
      fontSize: '16px',
      color: '#222',
    })

    const tips = [
      '● Checking the network cable or router',
      '● Resetting the modem or router',
      '● Reconnecting to Wi-Fi',
    ]

    tips.forEach((tip, index) => {
      this.add.text(44, 140 + index * 24, tip, {
        fontFamily: 'Segoe UI, Tahoma, sans-serif',
        fontSize: '14px',
        color: '#222',
      })
    })

    const prompt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 80, 'Press space to start', {
      fontFamily: 'Courier, monospace',
      fontSize: '14px',
      color: '#888',
    })
    prompt.setOrigin(0.5, 0.5)

    const hiscore = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 48, `HI ${this.formatScore(this.scoreManager.highScore)}`, {
      fontFamily: 'Courier, monospace',
      fontSize: '14px',
      color: '#444',
    })
    hiscore.setOrigin(0.5, 0.5)

    this.keys = this.input.keyboard.addKeys({
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
    })
  }

  update() {
    if (this.keys.space.isDown || this.keys.w.isDown || this.keys.up.isDown) {
      this.scene.start('GameScene')
    }
  }

  formatScore(score) {
    return score.toString().padStart(5, '0')
  }
}
