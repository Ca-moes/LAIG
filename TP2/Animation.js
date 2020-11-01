class Animation {
    constructor(instant_start, instant_end, transformation_start, transformation_end) {
        this.start = instant_start
        this.end = instant_end
        this.start_transformations = transformation_start
        this.end_transformations = transformation_end

        this.current_matrix = mat4.create()
    }

    apply() {
        throw("Abstract class cannot implement methods.");
    }

    update(t) {
        throw("Abstract class cannot implement methods.");
    }
}