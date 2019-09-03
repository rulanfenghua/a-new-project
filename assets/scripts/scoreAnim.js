cc.Class({
  extends: cc.Component,

  properties: {
  },

  // LIFE-CYCLE CALLBACKS:
  init(scoreFX) {
    this.scoreFX = scoreFX
  },
  hideFX() {
    this.scoreFX.despawn()
  },

  // onLoad () {},

  start() {

  },

  // update (dt) {},
});
