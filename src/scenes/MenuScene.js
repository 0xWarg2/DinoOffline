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

    const header = this.add.container(GAME_WIDTH / 2, 68)

    const title = this.add.text(0, 0, 'Offline DiRialo!', {
      fontFamily: '"Pixelify Sans", monospace',
      fontSize: '18px',
      color: '#1f2933',
    })
    title.setOrigin(0.5, 0.5)

    const logo = this.add.image(0, 0, 'logo-dino')
    logo.setOrigin(0.5, 0.5)
    logo.setDisplaySize(32, 32)

    const spacing = 8
    const totalWidth = logo.displayWidth + spacing + title.displayWidth
    logo.x = -totalWidth / 2 + logo.displayWidth / 2
    title.x = totalWidth / 2 - title.displayWidth / 2

    header.add([logo, title])

    const subtitle = this.add.text(
      GAME_WIDTH / 2,
      104,
      'The internet is napping — time to dash across the dunes!',
      {
        fontFamily: '"Pixelify Sans", monospace',
        fontSize: '10px',
        color: '#1f2933',
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 48 },
        lineSpacing: 4,
      }
    )
    subtitle.setOrigin(0.5, 0.5)

    const tips = [
      '🌵 Leap over cactus buddies',
      '🪽 Duck when the ptero swoops',
      '🏆 Stretch your run for hi-scores',
    ]

    tips.forEach((tip, index) => {
      this.add.text(36, 148 + index * 24, tip, {
        fontFamily: '"Pixelify Sans", monospace',
        fontSize: '10px',
        color: '#1f2933',
        lineSpacing: 4,
      })
    })

    const prompt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 72, 'Press SPACE or TAP to start', {
      fontFamily: '"Pixelify Sans", monospace',
      fontSize: '10px',
      color: '#64748b',
    })
    prompt.setOrigin(0.5, 0.5)

    const hiscore = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 44, `HI ${this.formatScore(this.scoreManager.highScore)}`, {
      fontFamily: '"Pixelify Sans", monospace',
      fontSize: '10px',
      color: '#1f2933',
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
