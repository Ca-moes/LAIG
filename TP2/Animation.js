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

    clone() {
        return Object.assign(
            Object.create(
                // Set the prototype of the new object to the prototype of the instance.
                // Used to allow new object behave like class instance.
                Object.getPrototypeOf(this),
            ),
            // Prevent shallow copies of nested structures like arrays, etc
            JSON.parse(JSON.stringify(this)),
        );
    }
}