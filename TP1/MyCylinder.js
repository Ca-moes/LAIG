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

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords=[];

    /*
    Como percorre os vértices do cilindro
    Vai por camadas desde z=0 até z=height
    nº de stacks de vertices = nºstacks + 1
    */
    
    var zdif = this.height/this.stacks;
    var rdif = (this.bottomRadius-this.topRadius)/this.stacks;
    var radius = this.bottomRadius;

    for (let z = 0; z < this.height; z+=zdif) {
        
        //atualizar radius para proxima camada
        radius-=rdif;
    }

    

    var ang = 0;
    var alphaAng = 2*Math.PI/this.slices;
    var textmap = 0;
    var textmapadd = 1/this.slices;

    // nº arestas = nº slices = nº faces
    for(var i = 0; i <= this.slices; i++){
        // All vertices have to be declared for a given face
        // even if they are shared with others, as the normals
        // in each face will be different

        var sa=Math.sin(ang); // valor para z
        var ca=Math.cos(ang); // valor para x

        this.vertices.push(ca, 0, -sa); // ZX plane face
        this.texCoords.push(textmap, 1);
        this.vertices.push(ca, 1, -sa); // Y=1 plane face
        this.texCoords.push(textmap, 0);
        this.normals.push(ca, 0, -sa, ca, 0, -sa);

        if (i!==0){
            // criar triangulos
            this.indices.push((i*2), (i*2+1), (i*2-1));
            this.indices.push((i*2), (2*i-1), (2*i-2));
        }
        ang+=alphaAng;
        textmap+=textmapadd;
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}

updateTexCoords(coords) {
    // todo - this method
}
}