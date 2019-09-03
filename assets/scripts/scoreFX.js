cc.Class({
  extends: cc.Component,

  properties: {
    anim:{
      default: null,
      type: cc.Animation
    }
  },

  // LIFE-CYCLE CALLBACKS:
  init(game) {
    this.game = game
    this.anim.getComponent('scoreAnim').init(this)
  },
  despawn() {
    this.game.despawnScoreFX(this.node)
  },
  play() {
    this.anim.play('score_pop')
  },

  // onLoad () {},

  start() {

  },

  // update (dt) {},
});
