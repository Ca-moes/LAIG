class EasingAnimation {
    constructor(properties, callback) {
        this.animation = properties.animation
        this.duration = properties.duration
        this.initialPosition = properties.initialPosition
        this.finalPosition = properties.finalPosition
        this.heightLevels = properties.heightLevels

        this.callback = callback

        this.x = properties.initialPosition[0]
        this.y = properties.initialPosition[1]
        this.z = properties.initialPosition[2]

        this.animationCompleted = false
    }

    getCoords() {
        return [this.x, this.y, this.z]
    }

    setStartTime(time) {
        this.startTime = time
        this.endTime = this.startTime + this.duration
    }

    animate(t) {
        if (this.animationCompleted || t < this.startTime)
            return

        if (t >= this.endTime) {
            this.animationCompleted = true
            this.callback()
            return
        }

        let timeFactor = (t - this.startTime) / (this.endTime - this.startTime)
        let animationFactor = this.animation(timeFactor)

        this.x = (this.initialPosition[0]) + animationFactor * (this.finalPosition[0] - this.initialPosition[0])

        if ((t - this.startTime) >= this.heightLevels[this.heightLevels.length - 1].instant) {
            this.y = this.finalPosition[1]
        } else {
            for (let i = 0; i < this.heightLevels.length; i++) {
                // antes do primeiro keyframe
                if (i === 0 && (t - this.startTime) <= this.heightLevels[i].instant) {
                    this.y = this.initialPosition[1]
                    break
                }
                // entre o primeiro keyframe e o ultimo
                else if ((t - this.startTime) < this.heightLevels[i].instant && (t - this.startTime) > this.heightLevels[i - 1].instant) {
                    let yTimeFactor = (t - this.startTime - this.heightLevels[i-1].instant) / (this.heightLevels[i].instant - this.heightLevels[i-1].instant)
                    let yAnimationFactor = this.animation(yTimeFactor)

                    this.y = (this.heightLevels[i - 1].height) + yAnimationFactor * (this.heightLevels[i].height - this.heightLevels[i - 1].height)
                    break
                }
            }
        }

        this.z = (this.initialPosition[2]) + animationFactor * (this.finalPosition[2] - this.initialPosition[2])

        return [this.x, this.y, this.z]
    }
}