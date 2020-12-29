class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, loops) {
        super(scene)

        this.inner = inner
        this.outer = outer
        this.slices = slices
        this.loops = loops


        this.updatedTexCoords = true; // no need for updateTexCoords

        this.initBuffers()
    }

    initBuffers() {
        this.vertices = []
        this.indices = []
        this.normals = []
        this.texCoords = []

        for (let slice = 0; slice <= this.slices; slice++) {
            const alpha = slice * 2 * Math.PI / this.slices
            const sinAlpha = Math.sin(alpha)
            const cosAlpha = Math.cos(alpha)

            for (let loop = 0; loop <= this.loops; loop++) {
                const beta = loop * 2 * Math.PI / this.loops
                const sinBeta = Math.sin(beta)
                const cosBeta = Math.cos(beta)

                const x = (this.outer + (this.inner * cosAlpha)) * cosBeta
                const y = (this.outer + (this.inner * cosAlpha)) * sinBeta
                const z = this.inner * sinAlpha;
                const s = (slice / this.slices);
                const t = 1 - (loop / this.loops);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
                this.texCoords.push(t, s);
            }
        }

        for (let slice = 0; slice < this.slices; slice++) {
            for (let loop = 0; loop < this.loops; loop++) {
                const first = (slice * (this.loops + 1)) + loop;
                const second = first + this.loops + 1;

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