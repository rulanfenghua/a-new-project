cc.Class({
  extends: cc.Component,

  properties: {
    pickRadius: 0,
  },

  // LIFE-CYCLE CALLBACKS:
  init(game) {
    this.game = game
    this.enabled = true
    this.node.opacity = 255
  },
  reuse(game) {
    this.init(game)
  },
  onPicked() {
    var pos = this.node.getPosition()
    this.game.gainScore(pos)
    this.game.despawnStar(this.node)
  },
  _getPlayerDistance() {
    var playerPos = this.game.player_instance.getCenterPos()
    var dist = this.node.position.sub(playerPos).mag()
    return dist
  },
  
  onLoad() {
    this.enabled = false
  },

  start() {

  },

  update(dt) {
    if (this._getPlayerDistance() < this.pickRadius) {
      this.onPicked()
      return
    }

    var opacityRatio = 1 - this.game.timer / this.game.starDuration
    var minOpacity = 50
    this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity))
  },
});
