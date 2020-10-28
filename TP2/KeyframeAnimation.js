class KeyframeAnimation extends Animation {
    constructor(keyframes) {
        super(keyframes[0].instant, keyframes[keyframes.length - 1].instant,
            keyframes[0].transformation, keyframes[keyframes.length - 1].transformation);

        this.keyframes = keyframes;
        this.current_keyframe = 0;
    }

    apply(scene) {
        scene.multMatrix(this.current_matrix);
    }

    update(t) {
        /* verificar se a animação está ativa */
        if (t < this.start || t > this.end) {
            return
        }

        if (this.next_keyframe === this.keyframes.length - 1 && t >= this.keyframes[this.keyframes.length - 1].instant) {
            /* TODO quando estamos no ultimo keyframe queremos manter a posição */
            return
        }

        if (this.keyframes.length === 1) {
            /* TODO cenas para quando so temos um keyframe */
            return
        }

        for (let i = 0; i < this.keyframes.length - 1; i++) {
            if (this.keyframes[i].instant <= t && t <= this.keyframes[i+1].instant) {
                this.current_keyframe = i
                this.next_keyframe = i+1
                break;
            }
        }

        const translation = {
            x: this.interpolate(this.keyframes[this.current_keyframe].translation.x,
                this.keyframes[this.next_keyframe].translation.x,
                t - this.keyframes[this.current_keyframe].instant ,
                this.keyframes[this.next_keyframe].instant - this.keyframes[this.current_keyframe].instant),
            y: this.interpolate(this.keyframes[this.current_keyframe].translation.y,
                this.keyframes[this.next_keyframe].translation.y,
                t - this.keyframes[this.current_keyframe].instant,
                this.keyframes[this.next_keyframe].instant - this.keyframes[this.current_keyframe].instant),
            z: this.interpolate(this.keyframes[this.current_keyframe].translation.z,
                this.keyframes[this.next_keyframe].translation.z,
                t - this.keyframes[this.current_keyframe].instant,
                this.keyframes[this.next_keyframe].instant - this.keyframes[this.current_keyframe].instant)
        }

        const rotation = {
            x: this.interpolate(this.keyframes[this.current_keyframe].rotation.x,
                this.keyframes[this.next_keyframe].rotation.x,
                t - this.keyframes[this.current_keyframe].instant,
                this.keyframes[this.next_keyframe].instant - this.keyframes[this.current_keyframe].instant),
            y: this.interpolate(this.keyframes[this.current_keyframe].rotation.y,
                this.keyframes[this.next_keyframe].rotation.y,
                t - this.keyframes[this.current_keyframe].instant,
                this.keyframes[this.next_keyframe].instant - this.keyframes[this.current_keyframe].instant),
            z: this.interpolate(this.keyframes[this.current_keyframe].rotation.z,
                this.keyframes[this.next_keyframe].rotation.z,
                t - this.keyframes[this.current_keyframe].instant,
                this.keyframes[this.next_keyframe].instant - this.keyframes[this.current_keyframe].instant)
        }

        const scale = {
            sx: this.interpolate(this.keyframes[this.current_keyframe].scale.sx,
                this.keyframes[this.next_keyframe].scale.sx,
                t - this.keyframes[this.current_keyframe].instant,
                this.keyframes[this.next_keyframe].instant - this.keyframes[this.current_keyframe].instant),
            sy: this.interpolate(this.keyframes[this.current_keyframe].scale.sy,
                this.keyframes[this.next_keyframe].scale.sy,
                t - this.keyframes[this.current_keyframe].instant,
                this.keyframes[this.next_keyframe].instant - this.keyframes[this.current_keyframe].instant),
            sz: this.interpolate(this.keyframes[this.current_keyframe].scale.sz,
                this.keyframes[this.next_keyframe].scale.sz,
                t - this.keyframes[this.current_keyframe].instant,
                this.keyframes[this.next_keyframe].instant - this.keyframes[this.current_keyframe].instant)
        }

        this.current_matrix = mat4.create()
        mat4.translate(this.current_matrix, this.current_matrix, [translation.x, translation.y, translation.z]);
        mat4.rotate(this.current_matrix, this.current_matrix, rotation.x * DEGREE_TO_RAD, [1, 0, 0]);
        mat4.rotate(this.current_matrix, this.current_matrix, rotation.y * DEGREE_TO_RAD, [0, 1, 0]);
        mat4.rotate(this.current_matrix, this.current_matrix, rotation.z * DEGREE_TO_RAD, [0, 0, 1]);
        mat4.scale(this.current_matrix, this.current_matrix, [scale.sx, scale.sy, scale.sz]);
    }

    interpolate(value1, value2, delta, time) {
        return value1 + (value2 - value1) * delta / time
    }
}