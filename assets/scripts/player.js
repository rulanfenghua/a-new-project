cc.Class({
  extends: cc.Component,

  properties: {
    jumpHeight: 0,
    jumpDuration: 0, // 跳跃持续时间
    squashDuration: 0, // 辅助形变动作时间
    maxMoveSpeed: 0,
    accel: 0, // 加速度
    jumpAudio: {
      default: null,
      type: cc.AudioClip
    }
  },

  // LIFE-CYCLE CALLBACKS:
  setJumpAction() {
    var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut())
    var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn())
    var squash = cc.scaleTo(this.squashDuration, 1, 0.6)
    var stretch = cc.scaleTo(this.squashDuration, 1, 1.2)
    var scaleBack = cc.scaleTo(this.squashDuration, 1, 1)
    var callback = cc.callFunc(this._playJumpSound, this)
    return cc.repeatForever(cc.sequence(squash, stretch, jumpUp, scaleBack, jumpDown, callback))
  },
  startMoveAt(pos) {
    this.enabled = true
    this.xSpeed = 0
    this.node.setPosition(pos)
    this.node.runAction(this.setJumpAction())
  },
  stopMove() {
    this.node.stopAllActions()
  },
  getCenterPos() {
    var centerPos = cc.v2(this.node.x, this.node.y + this.node.height / 2)
    return centerPos
  },
  _onKeyDown(event) {
    switch(event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = true
        this.accRight = false
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = true
        this.accLeft = false
        break;
    }
  },
  _onKeyUp(event) {
    switch(event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = false
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = false
        break;
    }
  },
  _onTouchStart(event) {
    var touchLoc = event.getLocation()
    if (touchLoc.x >= cc.winSize.width / 2) {
      this.accLeft = false
      this.accRight = true
    } else {
      this.accLeft = true
      this.accRight = false
    }
  },
  _onTouchEnd(event) {
    this.accLeft = false
    this.accRight = false
  },
  _playJumpSound() {
    cc.audioEngine.playEffect(this.jumpAudio, false)
  },

  onLoad() {
    this.enabled = false
    this.accLeft = false
    this.accRight = false
    this.xSpeed = 0
    this.minPosX = -this.node.parent.width / 2
    this.maxPosX = this.node.parent.width / 2

    this.jumpAction = this.setJumpAction()

    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this)
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this)

    var touchReceiver = cc.Canvas.instance.node
    touchReceiver.on('touchstart', this._onTouchStart, this)
    touchReceiver.on('touchend', this._onTouchEnd, this)
  },
  onDestroy() {
    cc.SystemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this)
    cc.SystemEvent.off(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this)

    var touchReceiver = cc.Canvas.instance.node
    touchReceiver.off('touchstart', this._onTouchStart, this)
    touchReceiver.off('touchend', this._onTouchEnd, this)
  },

  start() {

  },

  update(dt) {
    if (this.accLeft) {
      this.xSpeed -= this.accel * dt
    } else if (this.accRight) {
      this.xSpeed += this.accel * dt
    }

    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed)
    }

    this.node.x += this.xSpeed * dt

    if (Math.abs(this.node.x) > this.node.parent.width / 2) {
      this.node.x = -(this.node.x / Math.abs(this.node.x)) * this.node.parent.width / 2
    }
  },
});
