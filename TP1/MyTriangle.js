class MyTriangle extends CGFobject {
        constructor(scene, x1, y1, x2, y2, x3, y3) {
        super(scene);
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.x3 = x3
        this.y3 = y3

        this.initBuffers()
    }

    initBuffers() {
        this.vertices = [
            this.x1, this.y1, 0, // 0
            this.x2, this.y2, 0, // 1
            this.x3, this.y3, 0, // 2
        ]

        this.indices = [
            0, 1, 2,
        ]

        let v12 = [
            this.x2 - this.x1,
            this.y2 - this.y1,
            0]
        let v13 = [
            this.x3 - this.x1,
            this.y3 - this.y1,
            0
        ]
        let normal = vec3.create()
        vec3.cross(normal, v12, v13)
        vec3.normalize(normal, normal)

        this.normals = [
            normal[0], normal[1], normal[2],
            normal[0], normal[1], normal[2],
            normal[0], normal[1], normal[2]
        ]

        // calculate distances
        this.distA = Math.sqrt(Math.pow(v12[0], 2) + Math.pow(v12[1], 2) + Math.pow(v12[2], 2))
        this.distB = Math.sqrt(Math.pow(this.x3-this.x2, 2) + Math.pow(this.y3-this.y2, 2))
        this.distC = Math.sqrt(Math.pow(v13[0], 2) + Math.pow(v13[1], 2) + Math.pow(v13[2], 2))

        // alpha angle between a and c
        this.cosAlpha = (Math.pow(this.distA, 2) - Math.pow(this.distB, 2) + Math.pow(this.distC, 2)) / (2.0 * this.distA * this.distC)
        this.sinAlpha = Math.sqrt(1 - Math.pow(this.cosAlpha, 2))

        this.texCoords = [
            0, 1,
            1, 1,
            this.distC * this.cosAlpha, this.distC * this.sinAlpha
        ]

        this.primitiveType = this.scene.gl.TRIANGLES

        this.initGLBuffers()
    }

    updateTexCoords(coords) {
        this.texCoords = [
            0, 1,
            this.distA / coords.afs, 1,
            (this.distC * this.cosAlpha) / coords.afs, 1 - (this.distC * this.sinAlpha) / coords.aft,
        ]
        this.updateTexCoordsGLBuffers();
    }
}