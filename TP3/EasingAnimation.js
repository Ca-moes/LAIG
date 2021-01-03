/**
 * Easing Animation class
 */
class EasingAnimation {
    /**
     * Starts the object
     * @param {Object} properties properties of the animation (duration, easing function, initialPosition, finalPosition
     * and heightLevels)
     * @param {Function} callback method to call when the animation ends
     */
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

    /**
     * Returns the Coordinates processed on the animate method
     * @returns {[x, y, z]}
     */
    getCoords() {
        return [this.x, this.y, this.z]
    }

    /**
     * Sets the starting and ending times for the animation
     * @param time starting time in seconds
     */
    setStartTime(time) {
        this.startTime = time
        this.endTime = this.startTime + this.duration
    }

    /**
     * Method to animate something with easing functions
     * This method is a mix between easing functions and keyframes,
     * the X and Z values are animated using only easing functions. The Y value is
     * animated using keyframes (height Levels) and to process the progress between
     * each keyframe (height level) an easing function is being used instead of a linear
     * interpolation
     * @param t time in seconds
     * @returns {[x, y, z]}
     */
    animate(t) {
        if (this.animationCompleted || t < this.startTime)
            return [this.x, this.y, this.z]

        if (t >= this.endTime) {
            this.animationCompleted = true
            this.callback()
            return [this.x, this.y, this.z]
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