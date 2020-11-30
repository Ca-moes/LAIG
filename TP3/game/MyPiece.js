/**
 * MyPiece
 * @constructor
 */

class MyPiece extends CGFobject{
    constructor(scene, type, material, texture, model) {
        super(scene);
        this.scene = scene;
        this.type = type;
        this.updatedTexCoords = true; // no need for updateTexCoords

        this.material = material
        this.texture = texture
        this.tile = null
        this.obj = model.obj
        this.height = model.height
    };

    getType(){
        return this.type
    }

    setType(type){
        this.type = type
    }

    getTile(){
        return this.tile
    }

    setTile(tile){
        this.tile = tile
    }

    display() {
        this.scene.pushMatrix()

        this.material.apply()
        if (this.texture)
            this.texture.bind()

        // as the models are being made on a 5x5 XY Plane, we need to rescale them
        this.scene.scale(0.2, 0.2, 0.2)
        this.scene.translate(0, this.height/2, 0)

        this.obj.display()
        this.scene.popMatrix()
    }

    toString() {
        return (this.type === 1) ? "Red Piece" : "Blue Piece"
    }
}

/*
usar com cylinder

*/