const player = require('player')
const scoreFX = require('scoreFX')
const star = require('star')

cc.Class({
  extends: cc.Component,

  properties: {
    starPrefab: {
      default: null,
      type: cc.Prefab
    },
    scoreFXPrefab: {
      default: null,
      type: cc.Prefab
    },
    maxStarDuration: 0,
    minStarDuration: 0,
    ground: {
      default: null,
      type: cc.Node
    },
    player_instance: {
      default: null,
      type: player
    },
    scoreDisplay: {
      default: null,
      type: cc.Label
    },
    scoreAudio: {
      default: null,
      type: cc.AudioClip
    },
    btnNode: {
      default: null,
      type: cc.Node
    },
    gameOverNode: {
      default: null,
      type: cc.Node
    },
    controlHintLabel: {
      default: null,
      type: cc.Label
    },
    keyboardHint: {
      default: '',
      multiline: true
    },
    touchHint: {
      default: '',
      multiline: true
    }
  },

  // LIFE-CYCLE CALLBACKS:
  onStartGame() {
    this._resetScore()
    this.enabled = true
    this.btnNode.x = 3000
    this.gameOverNode.active = false
    this.player_instance.startMoveAt(cc.v2(0, this.groundY))
    this.spawnNewStar()
  },
  spawnNewStar() {
    var newStar = null
    if (this.starPool.size() > 0) {
      newStar = this.starPool.get(this)
    } else {
      newStar = cc.instantiate(this.starPrefab)
    }
    this.node.addChild(newStar)
    newStar.setPosition(this._getNewStarPosition())
    newStar.getComponent('star').init(this)
    this._startTimer()
    this.currentStar = newStar
  },
  despawnStar(star) {
    this.starPool.put(star)
    this.spawnNewStar()
  },
  spawnScoreFX() {
    var fx
    if (this.scorePool.size() > 0) {
      fx = this.scorePool.get()
      return fx.getComponent('scoreFX')
    } else {
      fx = cc.instantiate(this.scoreFXPrefab).getComponent('scoreFX')
      fx.init(this)
      return fx
    }
  },
  despawnScoreFX(scoreFX) {
    this.scorePool.put(scoreFX)
  },
  gainScore(pos) {
    this.score += 1
    this.scoreDisplay.string = 'Score: ' + this.score.toString()

    // 动画
    var fx = this.spawnScoreFX()
    this.node.addChild(fx.node)
    fx.node.setPosition(pos)
    fx.play()

    cc.audioEngine.playEffect(this.scoreAudio, false)
  },
  gameOver() {
    this.gameOverNode.active = true
    this.player_instance.enabled = false
    this.player_instance.stopMove()
    this.currentStar.destroy()
    this.btnNode.x = 0
  },
  _startTimer() {
    this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration)
    this.timer = 0
  },
  _resetScore() {
    this.score = 0
    this.scoreDisplay.string = 'Score: ' + this.score.toString()
  },
  _getNewStarPosition() {
    if (!this.currentStar) {
      this.currentStarX = (Math.random() - 0.5) * 2 * this.node.width / 2
    }
    var randX = 0
    var randY = this.groundY + Math.random() * this.player_instance.jumpHeight + 50
    var maxX = this.node.width / 2
    if (this.currentStarX >= 0) {
      randX = -Math.random() * maxX
    } else {
      randX = Math.random() * maxX
    }
    this.currentStarX = randX
    return cc.v2(randX, randY)
  },

  onLoad() {
    this.groundY = this.ground.y + this.ground.height / 2
    this.timer = 0
    this.starDuration = 0

    this.enabled = false

    var hintText = cc.sys.isMobile ? this.touchHint : this.keyboardHint
    this.controlHintLabel.string = hintText

    this.starPool = new cc.NodePool('star')
    this.scorePool = new cc.NodePool('scoreFX')
  },
  
  update(dt) {
    if (this.timer > this.starDuration) {
      this.gameOver()
      this.enabled = false
      return
    }
    this.timer += dt
  },
});
