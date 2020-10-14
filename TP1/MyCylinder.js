class MyCylinder extends CGFobject {
    constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
        super(scene);
        this.height = height;
        this.body = new MyCylinderBody(scene, height, topRadius, bottomRadius, stacks, slices);
        this.bot_circle = new MyCircle(scene, bottomRadius, slices);
        this.top_circle = new MyCircle(scene, topRadius, slices);

        this.initBuffers()
    }

    display(){
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.top_circle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.bot_circle.display();
        this.scene.popMatrix();

        this.body.display();
    };
}

class MyCylinderBody extends CGFobject {
    constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
        super(scene);
        this.height = height;
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;
        this.stacks = stacks;
        this.slices = slices;
    
        this.initBuffers()
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        var r = this.bottomRadius;
        var delta_r = (this.topRadius - this.bottomRadius) / this.stacks;
        var delta_rad = 2 * Math.PI / this.slices;
        var delta_z = this.height / this.stacks;
        var m = this.height / (this.bottomRadius - this.topRadius);
        var maxheight;
    
        if (this.bottomRadius > this.topRadius)
            maxheight = this.topRadius * m + this.height;
        else maxheight = this.bottomRadius * m + this.height;
    
        for (var i = 0; i <= this.stacks; i++) {
            for (var j = 0; j <= this.slices; j++) {
            this.vertices.push(
                r * Math.cos(j * delta_rad),
                r * Math.sin(j * delta_rad),
                i * delta_z
            );
            if (Math.abs(this.bottomRadius - this.topRadius) < 0.0001) {
                this.normals.push(
                Math.cos(j * delta_rad),
                Math.sin(j * delta_rad),
                0);
            } else if (this.bottomRadius > this.topRadius) {
                this.normals.push(
                maxheight * Math.cos(j * delta_rad) / Math.sqrt(Math.pow(this.bottomRadius, 2) + Math.pow(maxheight, 2)),
                maxheight * Math.sin(j * delta_rad) / Math.sqrt(Math.pow(this.bottomRadius, 2) + Math.pow(maxheight, 2)),
                this.bottomRadius / Math.sqrt(Math.pow(this.bottomRadius, 2) + Math.pow(maxheight, 2))
                );
            } else {
                this.normals.push(
                maxheight * Math.cos(j * delta_rad) / Math.sqrt(Math.pow(this.topRadius, 2) + Math.pow(maxheight, 2)),
                maxheight * Math.sin(j * delta_rad) / Math.sqrt(Math.pow(this.topRadius, 2) + Math.pow(maxheight, 2)),
                this.topRadius / Math.sqrt(Math.pow(this.topRadius, 2) + Math.pow(maxheight, 2))
                );
            }
            this.texCoords.push(j / this.slices, i / this.stacks);
    
            }
            r = (i + 1) * delta_r + this.bottomRadius;
        }
    
        for (var i = 0; i < this.stacks; i++) {
            for (var j = 0; j < this.slices; j++) {
            this.indices.push(
                i * (this.slices + 1) + j,
                i * (this.slices + 1) + (j + 1),
                (i + 1) * (this.slices + 1) + (j + 1)
            );
            this.indices.push(
                (i + 1) * (this.slices + 1) + (j + 1),
                (i + 1) * (this.slices + 1) + j,
                i * (this.slices + 1) + j
            );
    
            }
        }
    
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    updateTexCoords(coords) {
        // todo - this method
    }
}