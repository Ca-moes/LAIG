class MyAnimatedCamera extends CGFcamera {
    constructor(orchestrator, fov, near, far, position, target) {
        super(fov, near, far, position, target)

        this.orchestrator = orchestrator
        this.animationTime = 1500 // in milliseconds
    }

    startAnimation() {
        this.startingTime = Date.now()
        this.endTime = this.startingTime + this.animationTime
        this.angle = 0

        console.log("Start: " + this.startingTime)
        console.log("End: " + this.endTime)
    }

    easeInOutSine(timeFactor) {
        return -(Math.cos(Math.PI * timeFactor) - 1) / 2;
    }

    animate(t) {
        if (t*1000 >= this.endTime) {
            if (this.angle !== Math.PI) {
                this.orbit(CGFcameraAxis.Y, Math.PI - this.angle)
            }
            this.orchestrator.animationEnd()
            console.log("Left: " + (Math.PI - this.angle))
            return
        }

        let timeFactor = (t*1000 - this.startingTime) / (this.endTime - this.startingTime)
        let animationFactor = this.easeInOutSine(timeFactor)
        let angle = Math.PI * animationFactor
        let increment = angle - this.angle
        this.angle += increment

        this.orbit(CGFcameraAxis.Y, increment)
        console.log("Current Angle: " + this.angle)
    }
}