import Phaser from 'phaser'
import {
  BOX_SIZE,
  CACTUS_HEIGHT,
  CACTUS_WIDTH,
  COLORS,
  ENEMY_TYPES,
  FPS,
  GAME_HEIGHT,
  GAME_WIDTH,
  LEVEL_SPEED_STEP,
  LEVEL_START_SPEED,
  PLAYER_HEIGHT,
  PLAYER_STATE,
  PLAYER_WIDTH,
  PTERO_HEIGHT,
  PTERO_WIDTH,
  SCORE_EVENTS,
  STATES,
} from '../config/constants.js'
import { Player } from '../objects/Player.js'
import { ScoreManager } from '../utils/score.js'
import { chance, randint } from '../utils/random.js'

const FRAME_DURATION = 1000 / FPS
const SCORE_INTERVAL = FRAME_DURATION * SCORE_EVENTS.INCREASE
const ENEMY_INTERVAL = FRAME_DURATION * SCORE_EVENTS.ENEMY_SPAWN
const DAY_INTERVAL = FRAME_DURATION * SCORE_EVENTS.DAY_NIGHT

const CACTUS_CHANCE = 33
const ENEMY_CHANCE = 50
const MAX_PTERO = 3

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')

    this.viewportY = 0
    this.levelSpeed = LEVEL_START_SPEED
    this.levelSpeedStep = LEVEL_SPEED_STEP
    this.color = COLORS.DAY
    this.invColor = COLORS.NIGHT
    this.state = STATES.PLAY

    this.platforms = []
    this.enemies = []

    this.timers = {
      score: 0,
      enemy: 0,
      dayNight: 0,
    }
  }

  create() {
    this.cameras.main.setBackgroundColor(this.color)

    this.background = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xffffff)
    this.background.setOrigin(0, 0)

    this.overlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.45)
    this.overlay.setOrigin(0, 0)
    this.overlay.setVisible(false)

    this.scoreManager = new ScoreManager()

    this.hudText = this.add.text(GAME_WIDTH - 12, 12, '', {
      fontFamily: '"Pixelify Sans", monospace',
      fontSize: '12px',
      color: this.invColor,
    }).setOrigin(1, 0)

    this.gameOverText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'OUT OF JUICE!', {
      fontFamily: '"Pixelify Sans", monospace',
      fontSize: '14px',
      color: this.invColor,
      align: 'center',
    }).setOrigin(0.5, 0.5)
    this.gameOverText.setVisible(false)

    this.createInput()

    this.player = new Player(this, GAME_WIDTH / 2 - PLAYER_WIDTH / 2, 128)
    this.player.sprite.setDepth(10)

    this.restart()
  }

  restart() {
    this.clearPlatforms()
    this.clearEnemies()

    this.viewportY = 0
    this.levelSpeed = LEVEL_START_SPEED
    this.color = COLORS.DAY
    this.invColor = COLORS.NIGHT
    this.cameras.main.setBackgroundColor(this.color)
    this.background.fillColor = Phaser.Display.Color.HexStringToColor(this.color).color

    this.timers.score = 0
    this.timers.enemy = 0
    this.timers.dayNight = 0
    this.waitForRestartRelease = false

    this.state = STATES.PLAY
    this.overlay.setVisible(false)
    this.gameOverText.setVisible(false)

    this.scoreManager.reset()

    this.player.reset(GAME_WIDTH / 2 - PLAYER_WIDTH / 2, 128)
    this.player.syncSprite(this.viewportY)

    this.platforms = []
    this.enemies = []

    this.spawnInitialPlatforms()
    this.updateHUD()
  }

  createInput() {
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    })
  }

  buildControls() {
    const left = this.keys.left.isDown || this.keys.a.isDown
    const right = this.keys.right.isDown || this.keys.d.isDown
    const down = this.keys.down.isDown || this.keys.s.isDown
    const jump = this.keys.up.isDown || this.keys.w.isDown || this.keys.space.isDown

    return { left, right, down, jump }
  }

  spawnInitialPlatforms() {
    const basePlatform = this.createPlatform(
      GAME_WIDTH / 2 - BOX_SIZE / 2,
      this.player.y + PLAYER_HEIGHT
    )
    this.platforms.push(basePlatform)

    const total = Math.ceil((GAME_HEIGHT * 2) / BOX_SIZE)
    for (let i = 6; i < total; i += 1) {
      const rawX = randint(0, GAME_WIDTH - BOX_SIZE / 2)
      const x = rawX - (rawX % (BOX_SIZE / 2))
      const platform = this.createPlatform(x, i * BOX_SIZE)
      this.platforms.push(platform)
      this.maybeCreateCactus(platform)
    }

    this.platforms.sort((a, b) => a.y - b.y)
    this.syncPlatforms()
  }

  createPlatform(x, y) {
    const sprite = this.add.sprite(x, y, 'box-sleep')
    sprite.setOrigin(0, 0)
    sprite.setDepth(1)

    return {
      x,
      y,
      width: BOX_SIZE,
      height: BOX_SIZE,
      sprite,
      state: 'sleep',
      attachedEnemy: null,
    }
  }

  maybeCreateCactus(platform) {
    if (platform.attachedEnemy || !chance(CACTUS_CHANCE)) {
      return
    }

    const enemy = this.createCactus(
      platform.x + BOX_SIZE / 2 - CACTUS_WIDTH / 2,
      platform.y - CACTUS_HEIGHT
    )
    this.enemies.push(enemy)
    platform.attachedEnemy = enemy
  }

  createCactus(x, y) {
    const sprite = this.add.sprite(x, y, 'cactus')
    sprite.setOrigin(0, 0)
    sprite.setDepth(2)

    return {
      type: ENEMY_TYPES.CACTUS,
      x,
      y,
      width: CACTUS_WIDTH,
      height: CACTUS_HEIGHT,
      velocityX: 0,
      velocityY: 0,
      sprite,
    }
  }

  spawnPtero() {
    const fromLeft = Math.random() > 0.5
    const startX = fromLeft ? -PTERO_WIDTH : GAME_WIDTH + PTERO_WIDTH
    const velocityX = fromLeft ? 2 : -2
    const velocityY = randint(-1, 1) * 0.5
    const y = randint(this.viewportY + GAME_HEIGHT / 2, this.viewportY + GAME_HEIGHT - 60)

    const sprite = this.add.sprite(startX, y, 'ptero-1')
    sprite.setOrigin(0, 0)
    sprite.setDepth(3)
    sprite.anims.play('ptero-fly')
    sprite.setFlipX(!fromLeft)

    const enemy = {
      type: ENEMY_TYPES.PTERO,
      x: startX,
      y,
      width: PTERO_WIDTH,
      height: PTERO_HEIGHT,
      velocityX,
      velocityY,
      sprite,
    }

    this.enemies.push(enemy)
  }

  update(time, delta) {
    const controls = this.buildControls()
    const jumpHeld = controls.jump

    if (this.state === STATES.DEAD) {
      if (!jumpHeld) {
        this.waitForRestartRelease = true
      } else if (this.waitForRestartRelease) {
        this.scene.start('MenuScene')
      }
      return
    }

    const step = delta / FRAME_DURATION
    const previousY = this.player.y

    this.player.handleInput(controls, this.player.onGround)
    this.player.applyPhysics(step)

    this.updatePlatforms(step, jumpHeld, previousY)
    this.updateEnemies(step)

    this.updateTimers(delta)

    this.viewportY += this.levelSpeed * step

    this.player.updateAnimation()
    this.player.syncSprite(this.viewportY)

    this.syncPlatforms()
    this.syncEnemies()

    if (this.player.hasFallen(this.viewportY) || this.collidesWithEnemy()) {
      this.onGameOver()
    }

    this.updateHUD()
  }

  updatePlatforms(step, jumpHeld, previousY) {
    const before = this.platforms.length
    this.platforms = this.platforms.filter(platform => {
      const keep = this.isInViewport(platform)
      if (!keep) {
        if (platform.attachedEnemy) {
          this.removeEnemy(platform.attachedEnemy)
        }
        platform.sprite.destroy()
      }
      return keep
    })

    const removed = before - this.platforms.length
    for (let i = 0; i < removed; i += 1) {
      const last = this.platforms[this.platforms.length - 1]
      const nextY = last ? last.y + BOX_SIZE : this.viewportY + GAME_HEIGHT + BOX_SIZE
      const rawX = randint(0, GAME_WIDTH - BOX_SIZE / 2)
      const x = rawX - (rawX % (BOX_SIZE / 2))
      const platform = this.createPlatform(x, nextY)
      this.platforms.push(platform)
      this.maybeCreateCactus(platform)
    }

    const previousBottom = previousY + PLAYER_HEIGHT
    const currentBottom = this.player.y + PLAYER_HEIGHT

    this.platforms.forEach(platform => {
      const overlapsX = (this.player.x - this.player.width / 5) > (platform.x - platform.width)
        && (this.player.x + this.player.width / 5) < (platform.x + platform.width)
      const platformTop = platform.y
      const playerDescending = this.player.velocityY >= 0
      const crossesPlatform = previousBottom <= platformTop && currentBottom >= platformTop

      if (overlapsX && playerDescending && crossesPlatform) {
        this.player.landOn(platformTop - PLAYER_HEIGHT)
        if (jumpHeld) {
          this.player.jump()
        }
        this.setPlatformState(platform, 'active')
      } else {
        this.setPlatformState(platform, 'sleep')
      }
    })
  }

  setPlatformState(platform, state) {
    if (platform.state === state) {
      return
    }

    platform.state = state

    if (state === 'active') {
      platform.sprite.play('box-awake-anim', true)
    } else {
      if (platform.sprite.anims?.isPlaying) {
        platform.sprite.anims.stop()
      }
      platform.sprite.setTexture('box-sleep')
    }
  }

  updateEnemies(step) {
    const toRemove = []

    this.enemies.forEach(enemy => {
      enemy.x += (enemy.velocityX || 0) * step
      enemy.y += (enemy.velocityY || 0) * step

      if (!this.isInViewport(enemy)) {
        toRemove.push(enemy)
      } else if (enemy.type === ENEMY_TYPES.PTERO) {
        enemy.sprite.setFlipX(enemy.velocityX < 0)
      }
    })

    toRemove.forEach(enemy => this.removeEnemy(enemy))
  }

  removeEnemy(enemy) {
    const idx = this.enemies.indexOf(enemy)
    if (idx !== -1) {
      this.enemies.splice(idx, 1)
    }
    enemy.sprite.destroy()
  }

  updateTimers(delta) {
    this.timers.score += delta
    this.timers.enemy += delta
    this.timers.dayNight += delta

    if (this.timers.score >= SCORE_INTERVAL) {
      const times = Math.floor(this.timers.score / SCORE_INTERVAL)
      this.timers.score -= SCORE_INTERVAL * times
      for (let i = 0; i < times; i += 1) {
        this.scoreManager.increase()
      }
    }

    if (this.timers.enemy >= ENEMY_INTERVAL) {
      this.timers.enemy -= ENEMY_INTERVAL
      this.maybeAddEnemy()
    }

    if (this.timers.dayNight >= DAY_INTERVAL) {
      this.timers.dayNight -= DAY_INTERVAL
      this.onNextDay()
    }
  }

  maybeAddEnemy() {
    const airborne = this.enemies.filter(e => e.type === ENEMY_TYPES.PTERO).length
    if (airborne >= MAX_PTERO) {
      return
    }

    if (chance(ENEMY_CHANCE)) {
      this.spawnPtero()
    }
  }

  onNextDay() {
    const temp = this.color
    this.color = this.invColor
    this.invColor = temp

    this.cameras.main.setBackgroundColor(this.color)
    this.background.fillColor = Phaser.Display.Color.HexStringToColor(this.color).color
    this.hudText.setColor(this.invColor)
    this.gameOverText.setColor(this.invColor)

    this.levelSpeed += this.levelSpeedStep
  }

  syncPlatforms() {
    this.platforms.forEach(platform => {
      platform.sprite.x = platform.x
      platform.sprite.y = platform.y - this.viewportY
      platform.sprite.setVisible(platform.sprite.y <= GAME_HEIGHT)
    })
  }

  syncEnemies() {
    this.enemies.forEach(enemy => {
      enemy.sprite.x = enemy.x
      enemy.sprite.y = enemy.y - this.viewportY
      enemy.sprite.setVisible(enemy.sprite.y <= GAME_HEIGHT)
    })
  }

  isInViewport(entity) {
    if (entity.y + entity.height < this.viewportY) {
      return false
    }
    if (entity.x + entity.width < 0) {
      return false
    }
    if (entity.x - entity.width > GAME_WIDTH) {
      return false
    }
    return true
  }

  collidesWithEnemy() {
    const playerRect = this.getPlayerRect()
    return this.enemies.some(enemy => {
      const rect = new Phaser.Geom.Rectangle(enemy.x, enemy.y, enemy.width, enemy.height)
      return Phaser.Geom.Intersects.RectangleToRectangle(playerRect, rect)
    })
  }

  getPlayerRect() {
    const ducking = this.player.state === PLAYER_STATE.DUCK
    const height = ducking ? PLAYER_HEIGHT - 10 : PLAYER_HEIGHT
    const yOffset = ducking ? PLAYER_HEIGHT - height : 0

    return new Phaser.Geom.Rectangle(
      this.player.x,
      this.player.y + yOffset,
      PLAYER_WIDTH,
      height,
    )
  }

  onGameOver() {
    if (this.state === STATES.DEAD) {
      return
    }

    this.state = STATES.DEAD
    this.overlay.setVisible(true)
    this.gameOverText.setVisible(true)
    this.waitForRestartRelease = false
  }

  updateHUD() {
    const hi = this.formatScore(this.scoreManager.highScore)
    const current = this.formatScore(this.scoreManager.score)
    this.hudText.setText(`HI ${hi} ${current}`)
  }

  formatScore(score) {
    return score.toString().padStart(5, '0')
  }

  clearPlatforms() {
    this.platforms.forEach(platform => platform.sprite.destroy())
    this.platforms = []
  }

  clearEnemies() {
    this.enemies.forEach(enemy => enemy.sprite.destroy())
    this.enemies = []
  }
}
