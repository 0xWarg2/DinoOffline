export const GAME_WIDTH = 320
export const GAME_HEIGHT = 480
export const FPS = 60

export const PLAYER_WIDTH = 32
export const PLAYER_HEIGHT = 32
export const BOX_SIZE = 32
export const CACTUS_WIDTH = 18
export const CACTUS_HEIGHT = 24
export const PTERO_WIDTH = 32
export const PTERO_HEIGHT = 20

export const GRAVITY = 9 / 16
export const LEVEL_START_SPEED = 0.8
export const LEVEL_SPEED_STEP = 0.1

export const STATES = {
  MENU: 'menu',
  PLAY: 'play',
  DEAD: 'dead',
}

export const PLAYER_STATE = {
  DEFAULT: 'default',
  DUCK: 'duck',
}

export const ENEMY_TYPES = {
  CACTUS: 'cactus',
  PTERO: 'ptero',
}

export const SCORE_EVENTS = {
  INCREASE: 10,
  DAY_NIGHT: FPS * 12,
  ENEMY_SPAWN: FPS,
}

export const STORAGE_KEYS = {
  HIGH_SCORE: 'offline_dino_highscore',
}

export const COLORS = {
  DAY: '#ffffff',
  NIGHT: '#222222',
}
