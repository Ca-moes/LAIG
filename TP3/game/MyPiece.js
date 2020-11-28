/**
 * MyPiece
 * @constructor
 */

class MyPiece extends CGFobject{
    constructor(scene, type) {
        super(scene);
        this.scene = scene;
        this.type = type;
        this.updatedTexCoords = true; // no need for updateTexCoords

        this.obj = new MyCylinder(scene, 0.1, 1, 1, 4, 4)
    };

    getType(){
        return this.type
    }

    setType(type){
        this.type = type
    }

    display() {
        this.scene.pushMatrix()
        this.scene.rotate(Math.PI/4, 0, 0, 1)
        this.obj.display()
        this.scene.popMatrix()
    }
}