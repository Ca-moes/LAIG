class KeyframeAnimation extends Animation {
    constructor(keyframes) {
        super(keyframes[0].instant, 
            keyframes[keyframes.length - 1].instant,
            keyframes[0].transformation, 
            keyframes[keyframes.length - 1].transformation);

        this.keyframes = keyframes;
        this.current_keyframe = 0;
    }

    apply(scene) {
        scene.multMatrix(this.current_matrix);
    }

    update(t) {
        /* verificar se a animação está ativa */
        if (t < this.start) {
            this.visible = false;
            return
        }

        this.visible = true;

        if (this.next_keyframe === this.keyframes.length - 1 && t >= this.keyframes[this.keyframes.length - 1].instant) {
            /* quando estamos no ultimo keyframe queremos manter a posição */
            return
        }

        /* caso exista apenas um keyframe deve ser aplicado quando o tempo for oportuno */
        if (this.keyframes.length === 1) {
            // ? Não deve ser preciso esta linha abaixo
            this.current_matrix = mat4.create()
            mat4.translate(this.current_matrix, this.current_matrix, this.keyframes[this.current_keyframe].translation);
            mat4.rotate(this.current_matrix, this.current_matrix, this.keyframes[this.current_keyframe].rotation[0] * DEGREE_TO_RAD, [1, 0, 0]);
            mat4.rotate(this.current_matrix, this.current_matrix, this.keyframes[this.current_keyframe].rotation[1] * DEGREE_TO_RAD, [0, 1, 0]);
            mat4.rotate(this.current_matrix, this.current_matrix, this.keyframes[this.current_keyframe].rotation[2] * DEGREE_TO_RAD, [0, 0, 1]);
            mat4.scale(this.current_matrix, this.current_matrix, this.keyframes[this.current_keyframe].scale);

            /* definir o keyframe proximo key-frame para que este if não seja processado mais vezes que o necessário
            * utilizando o `if` anterior */
            this.next_keyframe = this.current_keyframe;
            return
        }

        for (let i = 0; i < this.keyframes.length - 1; i++) {
            if (this.keyframes[i].instant <= t && t <= this.keyframes[i+1].instant) {
                this.current_keyframe = i
                this.next_keyframe = i+1
                break;
            }
        }

        console.log(this.keyframes[this.current_keyframe]);
        console.log(this.keyframes[this.next_keyframe]);
        let time = (t - this.keyframes[this.current_keyframe].instant) / (this.keyframes[this.next_keyframe].instant - this.keyframes[this.current_keyframe].instant);

        let translation = vec3.create()
        vec3.lerp(translation, this.keyframes[this.current_keyframe].translation, this.keyframes[this.next_keyframe].translation, time)

        let rotation = vec3.create()
        vec3.lerp(rotation, this.keyframes[this.current_keyframe].rotation, this.keyframes[this.next_keyframe].rotation, time)

        let scale = vec3.create()
        vec3.lerp(scale, this.keyframes[this.current_keyframe].scale, this.keyframes[this.next_keyframe].scale, time)

        this.current_matrix = mat4.create()
        mat4.translate(this.current_matrix, this.current_matrix, translation);
        mat4.rotate(this.current_matrix, this.current_matrix, rotation[0] * DEGREE_TO_RAD, [1, 0, 0]);
        mat4.rotate(this.current_matrix, this.current_matrix, rotation[1] * DEGREE_TO_RAD, [0, 1, 0]);
        mat4.rotate(this.current_matrix, this.current_matrix, rotation[2] * DEGREE_TO_RAD, [0, 0, 1]);
        mat4.scale(this.current_matrix, this.current_matrix, scale);
    }
}