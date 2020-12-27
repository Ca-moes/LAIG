class MyAnimatedCamera extends CGFcamera {
    constructor(orchestrator, animation, fov, near, far, position, target) {
        super(fov, near, far, position, target)

        this.orchestrator = orchestrator
        this.animation = animation
        this.animationTime = 1000

        this.animationCompleted = false
    }

    startAnimation() {
        this.animationCompleted = false
        this.startingTime = Date.now()
        this.endTime = this.startingTime + this.animationTime
        this.angle = 0
    }

    animate(t) {
        if (this.animationCompleted)
            return

        if (t*1000 >= this.endTime) {
            this.animationCompleted = true
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