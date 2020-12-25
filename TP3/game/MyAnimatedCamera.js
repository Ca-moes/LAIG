class MyAnimatedCamera extends CGFcamera {
    constructor(orchestrator, animation, fov, near, far, position, target) {
        super(fov, near, far, position, target)

        this.orchestrator = orchestrator
        this.animation = animation
        this.animationTime = 1000
        this.animationComplete = false
    }

    startAnimation() {
        this.startingTime = Date.now()
        this.endTime = this.startingTime + this.animationTime
        this.angle = 0
        this.animationComplete = false
    }

    animate(t) {
        if (this.animationComplete) return

        if (t*1000 >= this.endTime) {
            this.animationComplete = true
            this.orbit(CGFcameraAxis.Y, Math.PI - this.angle)
            this.orchestrator.animationEnd()
            return
        }

        let timeFactor = (t*1000 - this.startingTime) / (this.endTime - this.startingTime)
        let animationFactor = this.animation(timeFactor)
        let angle = Math.PI * animationFactor
        let increment = angle - this.angle
        this.angle += increment

        this.orbit(CGFcameraAxis.Y, increment)
    }
}