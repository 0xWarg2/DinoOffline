import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    this.load.setPath('assets/images')
    this.load.image('dino-stand', 'dino.png')
    this.load.image('dino-step2', 'dino_step2.png')
    this.load.image('dino-step3', 'dino_step3.png')
    this.load.image('dino-duck1', 'dino2.png')
    this.load.image('dino-duck2', 'dino2_rev.png')

    this.load.image('box-sleep', 'box_sleep.png')
    this.load.image('box', 'box.png')
    this.load.image('box-awake', 'box_2.png')

    this.load.image('cactus', 'cactus.png')

    this.load.image('ptero-1', 'enemy.png')
    this.load.image('ptero-2', 'enemy_2.png')
    this.load.image('ptero-3', 'enemy_3.png')
    this.load.image('ptero-4', 'enemy_4.png')
  }

  create() {
    this.createAnimations()
    this.scene.start('MenuScene')
  }

  createAnimations() {
    this.anims.create({
      key: 'dino-idle',
      frames: [{ key: 'dino-stand' }],
      frameRate: 6,
      repeat: -1,
    })

    this.anims.create({
      key: 'dino-run',
      frames: [
        { key: 'dino-stand' },
        { key: 'dino-step2' },
        { key: 'dino-step3' },
        { key: 'dino-step2' },
      ],
      frameRate: 12,
      repeat: -1,
    })

    this.anims.create({
      key: 'dino-duck',
      frames: [
        { key: 'dino-duck1' },
        { key: 'dino-duck2' },
      ],
      frameRate: 8,
      repeat: -1,
    })

    this.anims.create({
      key: 'box-awake-anim',
      frames: [
        { key: 'box-awake' },
        { key: 'box' },
      ],
      frameRate: 2,
      repeat: -1,
    })

    this.anims.create({
      key: 'ptero-fly',
      frames: [
        { key: 'ptero-1' },
        { key: 'ptero-2' },
        { key: 'ptero-3' },
        { key: 'ptero-4' },
      ],
      frameRate: 10,
      repeat: -1,
    })
  }
}
