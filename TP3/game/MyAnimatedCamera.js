class MyAnimatedCamera extends CGFcamera {
    constructor(orchestrator, animation, fov, near, far, position, target) {
        super(fov, near, far, position, target)

        this.orchestrator = orchestrator
        this.animation = animation
    }

    startAnimation() {
        this.startingTime = Date.now()
        this.endTime = this.startingTime + this.orchestrator.preferences.cameraAnimationTime
        this.angle = 0

        console.log("Start: " + this.startingTime)
        console.log("End: " + this.endTime)
    }

    animate(t) {
        if (t*1000 >= this.endTime) {
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