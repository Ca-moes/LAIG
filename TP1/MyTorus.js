class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, loops) {
        super(scene)

        this.inner = inner
        this.outer = outer
        this.slices = slices
        this.loops = loops

        this.initBuffers()
    }

    initBuffers() {
        this.vertices = []
        this.indices = []
        this.normals = []
        this.texCoords = []

        for (let loop = 0; loop <= this.loops; loop++) {
            const alpha = loop * 2 * Math.PI / this.loops
            const sinAlpha = Math.sin(alpha)
            const cosAlpha = Math.cos(alpha)

            for (let slice = 0; slice <= this.slices; slice++) {
                const beta = slice * 2 * Math.PI / this.slices
                const sinBeta = Math.sin(beta)
                const cosBeta = Math.cos(beta)

                const x = (this.outer + (this.inner * cosAlpha)) * cosBeta
                const y = (this.outer + (this.inner * cosAlpha)) * sinBeta
                const z = this.inner * sinAlpha;
                const s = (loop / this.loops);
                const t = 1 - (slice / this.slices);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
                this.texCoords.push(t, s);
            }
        }

        for (let loop = 0; loop < this.loops; loop++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const first = (loop * (this.slices + 1)) + slice;
                const second = first + this.slices + 1;

                this.indices.push(first, second + 1, second);
                this.indices.push(first, first + 1, second + 1);
            }
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(coords) {
        // todo - this method
    }
}