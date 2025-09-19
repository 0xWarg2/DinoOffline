import { STORAGE_KEYS } from '../config/constants.js'

export class ScoreManager {
  constructor() {
    const stored = window.localStorage.getItem(STORAGE_KEYS.HIGH_SCORE)
    this.highScore = stored ? parseInt(stored, 10) : 0
    this.score = 0
  }

  reset() {
    this.score = 0
  }

  increase(amount = 1) {
    this.score += amount
    if (this.score > this.highScore) {
      this.highScore = this.score
      window.localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(this.highScore))
    }
  }
}
