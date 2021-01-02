class MyAnimatedCamera extends CGFcamera {
    constructor(orchestrator, animation, fov, near, far, position, target) {
        super(fov, near, far, position, target)

        this.orchestrator = orchestrator
        this.animation = animation
        this.animationTime = 1000

        this.animationCompleted = true
    }

    startAnimation(type, time = 1, callback = () => this.orchestrator.custom.log("Finished Camera Animation"), position = [], target = []) {
        if (!this.animationCompleted) return
        this.animationCompleted = false

        this.type = type
        this.animationTime = time * 1000
        this.startingTime = Date.now()
        this.endTime = this.startingTime + this.animationTime
        this.angle = 0

        this.callback = callback

        this.originalTarget = [...this.target]
        this.originalPosition = [...this.position]

        this.desiredTarget = target
        this.desiredPosition = position
    }

    animate(t) {
        if (this.animationCompleted) return

        if (this.type === "orbit" || this.type === "orbit-callback") {
            if (t * 1000 >= this.endTime) {
                this.animationCompleted = true
                this.orbit(CGFcameraAxis.Y, Math.PI - this.angle)
                this.type === "orbit" ? this.orchestrator.animationEnd() : this.callback()
                return
            }
            let timeFactor = (t * 1000 - this.startingTime) / (this.endTime - this.startingTime)
            let animationFactor = this.animation(timeFactor)
            let angle = Math.PI * animationFactor
            let increment = angle - this.angle
            this.angle += increment
            this.orbit(CGFcameraAxis.Y, increment)
        } else if (this.type === "position") {
            if (t * 1000 >= this.endTime) {
                this.animationCompleted = true
                this.callback()
                return
            }
            let timeFactor = (t * 1000 - this.startingTime) / (this.endTime - this.startingTime)
            let animationFactor = this.animation(timeFactor)

            this.setPosition(vec3.fromValues(
                (this.originalPosition[0]) + animationFactor * (this.desiredPosition[0] - this.originalPosition[0]),
                (this.originalPosition[1]) + animationFactor * (this.desiredPosition[1] - this.originalPosition[1]),
                (this.originalPosition[2]) + animationFactor * (this.desiredPosition[2] - this.originalPosition[2])
            ))
            this.setTarget(vec3.fromValues(
                (this.originalTarget[0]) + animationFactor * (this.desiredTarget[0] - this.originalTarget[0]),
                (this.originalTarget[1]) + animationFactor * (this.desiredTarget[1] - this.originalTarget[1]),
                (this.originalTarget[2]) + animationFactor * (this.desiredTarget[2] - this.originalTarget[2])
            ))
        }
    }
}