class Patch extends CGFobject {
    constructor(scene, uDivs, vDivs, degreeU, degreeV, controlPoints) {
        super(scene);
        this.updatedTexCoords = true; // no need for updateTexCoords

        this.uDivs = uDivs
        this.vDivs = vDivs

        const nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, controlPoints)

        // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
        this.obj = new CGFnurbsObject(this.scene, this.uDivs, this.vDivs, nurbsSurface)
    }

    display() {
        this.obj.display()
    }
}