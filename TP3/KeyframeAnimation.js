class KeyframeAnimation extends Animation {
    constructor(keyframes) {
        super(keyframes[0].instant,
            keyframes[keyframes.length - 1].instant,)

        this.keyframes = keyframes
        this.startTime = 0
        this.visible = true

        // to make object invisible when animation is not yet performed
        this.current_matrix = mat4.create()
        this.current_matrix[0] = 0
        this.current_matrix[5] = 0
        this.current_matrix[10] = 0
        this.current_matrix[15] = 0
    }

    setStartingTime(time) {
        this.startTime = time
    }


    interpolate(initialValues, finalValues, time) {
        let timeFactor = (time - initialValues.instant) / (finalValues.instant - initialValues.instant)

        let translation = vec3.create()
        vec3.lerp(translation, initialValues.translation, finalValues.translation, timeFactor)

        let rotation = vec3.create()
        vec3.lerp(rotation, initialValues.rotation, finalValues.rotation, timeFactor)

        let scale = vec3.create()
        vec3.lerp(scale, initialValues.scale, finalValues.scale, timeFactor)

        return {
            translation: translation,
            rotation: rotation,
            scale: scale
        }
    }


    apply(scene) {
        scene.multMatrix(this.current_matrix)
    }

    update(t) {
        let time = t - this.startTime;

        // depois do ultimo keyframe
        if (time >= this.keyframes[this.keyframes.length - 1].instant) {
            let lastKeyframe = this.keyframes.length - 1
            mat4.identity(this.current_matrix)
            mat4.translate(this.current_matrix, this.current_matrix, this.keyframes[lastKeyframe].translation)
            mat4.rotate(this.current_matrix, this.current_matrix, this.keyframes[lastKeyframe].rotation[0] * DEGREE_TO_RAD, [1, 0, 0])
            mat4.rotate(this.current_matrix, this.current_matrix, this.keyframes[lastKeyframe].rotation[1] * DEGREE_TO_RAD, [0, 1, 0])
            mat4.rotate(this.current_matrix, this.current_matrix, this.keyframes[lastKeyframe].rotation[2] * DEGREE_TO_RAD, [0, 0, 1])
            mat4.scale(this.current_matrix, this.current_matrix, this.keyframes[lastKeyframe].scale)
        } else {
            for (let i = 0; i < this.keyframes.length; i++) {
                // antes do primeiro keyframe
                if (i === 0 && time <= this.keyframes[i].instant) {
                    break
                }
                // entre o primeiro keyframe e o ultimo
                else if (time < this.keyframes[i].instant && time > this.keyframes[i - 1].instant) {
                    let interpolated = this.interpolate(this.keyframes[i - 1], this.keyframes[i], time)

                    mat4.identity(this.current_matrix) //reset the matrix
                    mat4.translate(this.current_matrix, this.current_matrix, interpolated.translation)
                    mat4.rotate(this.current_matrix, this.current_matrix, interpolated.rotation[0] * DEGREE_TO_RAD, [1, 0, 0])
                    mat4.rotate(this.current_matrix, this.current_matrix, interpolated.rotation[1] * DEGREE_TO_RAD, [0, 1, 0])
                    mat4.rotate(this.current_matrix, this.current_matrix, interpolated.rotation[2] * DEGREE_TO_RAD, [0, 0, 1])
                    mat4.scale(this.current_matrix, this.current_matrix, interpolated.scale)

                    break
                }
            }
        }
    }
}