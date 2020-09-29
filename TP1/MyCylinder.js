class MyCylinder extends CGFobject {

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

    /* this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords=[];

    /*
    Como percorre os vértices do cilindro
    Vai por camadas desde z=0 até z=height
    nº de stacks de vertices = nºstacks + 1
    
    
    var zdif = this.height/this.stacks;
    var rdif = (this.bottomRadius-this.topRadius)/this.stacks;
    var radius = this.bottomRadius;

    for (let z = 0; z < this.height; z+=zdif) {
        
        //atualizar radius para proxima camada
        radius-=rdif;
    } */

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

    var vbase = this.vertices.length;
    // centro da bottom base
    
    //Para z= 0
    // adicionar a vertices[] valores dos vertices
    for (var j = 0; j <= this.slices; j++) {
        // adiciona vertice current
        this.vertices.push(
            this.bottomRadius * Math.cos(j * delta_rad),
            this.bottomRadius * Math.sin(j * delta_rad),
            0)
        // adiciona vertice siguinte 
        this.vertices.push(
            this.bottomRadius * Math.cos((j+1) * delta_rad),
            this.bottomRadius * Math.sin((j+1) * delta_rad),
            0)
        // adiciona centro
        this.vertices.push(0,0,0);
        // liga ultimos 3
        this.indices.push(
            this.vertices.length - 2,
            this.vertices.length - 1,
            this.vertices.length - 3
        )
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}

updateTexCoords(coords) {
    // todo - this method
}
}