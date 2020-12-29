/**
 * MyCircle
 * @constructor
 */

class MyCircle extends CGFobject {
    constructor(scene, radius, slices) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.updatedTexCoords = true; // no need for updateTexCoords
        this.initBuffers();
    };

    initBuffers() {

        var angle = 2.0 * Math.PI / this.slices;

        this.vertices = [0, 0, 0];
        this.texCoords = [0.5, 0.5]
        this.indices = [];
        this.normals = [0, 0, 1];

        var curr_angle = 0;
        var index_counter = 0;
        var x0, x1, y0, y1;

        for (var i = 0; i < this.slices; i++) {

            x0 = Math.cos(curr_angle) * this.radius;
            y0 = Math.sin(curr_angle) * this.radius;

            curr_angle += angle;

            x1 = Math.cos(curr_angle) * this.radius;
            y1 = Math.sin(curr_angle) * this.radius;

            this.vertices.push(x0, y0, 0);
            this.vertices.push(x1, y1, 0);

            this.texCoords.push((-Math.cos(curr_angle - angle) + 1) / 2, (Math.sin(curr_angle - angle) + 1) / 2);
            this.texCoords.push((-Math.cos(curr_angle) + 1) / 2, (Math.sin(curr_angle) + 1) / 2);

            this.indices.push(0, index_counter + 1, index_counter + 2);

            index_counter += 2;

            this.normals.push(0, 0, 1);
            this.normals.push(0, 0, 1);


        }


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

    applyTextures(factorS, factorT) {
        factorS = factorS || 1;
        factorT = factorT || 1;
        this.texCoords = [];


        this.initGLBuffers();
    }


}