import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GRAVITY,
  PLAYER_HEIGHT,
  PLAYER_STATE,
  PLAYER_WIDTH,
} from '../config/constants.js'

const WALK_SPEED = 2
const JUMP_VELOCITY = -9

export class Player {
  constructor(scene, x, y) {
    this.scene = scene
    this.sprite = scene.add.sprite(0, 0, 'dino-stand')
    this.sprite.setOrigin(0, 0)
    this.width = PLAYER_WIDTH
    this.height = PLAYER_HEIGHT

    this.reset(x, y)
  }

  reset(x, y) {
    this.x = x
    this.y = y
    this.velocityX = 0
    this.velocityY = 0
    this.state = PLAYER_STATE.DEFAULT
    this.facing = 1
    this.onGround = false
    this.updateAnimation(true)
  }

  handleInput(controls, onGround) {
    this.onGround = onGround
    this.velocityX = 0

    if (controls.left) {
      this.velocityX = -WALK_SPEED
      this.facing = -1
    }

    if (controls.right) {
      this.velocityX = WALK_SPEED
      this.facing = 1
    }

    if (controls.down && this.onGround) {
      this.velocityX = 0
      this.state = PLAYER_STATE.DUCK
    } else {
      this.state = PLAYER_STATE.DEFAULT
    }
  }

  applyPhysics(step) {
    this.velocityY += GRAVITY * step

    this.x += this.velocityX * step
    this.y += this.velocityY * step

    if (this.x < 0) {
      this.x = 0
    }
    if (this.x > GAME_WIDTH - this.width) {
      this.x = GAME_WIDTH - this.width
    }

    this.onGround = false
  }

  hasFallen(cameraY) {
    return this.y + this.height/2 > cameraY + GAME_HEIGHT
  }

  landOn(y) {
    this.y = y
    this.velocityY = 0
    this.onGround = true
  }

  jump() {
    this.velocityY = JUMP_VELOCITY
    this.onGround = false
    this.scene.events.emit('player-jump')
  }

  updateAnimation(force = false) {
    const key = this.state === PLAYER_STATE.DUCK
      ? 'dino-duck'
      : (Math.abs(this.velocityX) > 0.1 ? 'dino-run' : 'dino-idle')

    if (force || this.sprite.anims?.currentAnim?.key !== key) {
      this.sprite.anims.play(key, true)
    }

    this.sprite.setFlipX(this.facing === -1)
  }

  syncSprite(cameraY) {
    this.sprite.x = this.x
    this.sprite.y = this.y - cameraY
  }
}
