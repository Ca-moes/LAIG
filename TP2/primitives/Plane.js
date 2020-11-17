class Plane extends CGFobject {
    constructor(scene, uDivs, vDivs) {
        super(scene);
        this.updatedTexCoords = true; // no need for updateTexCoords

        this.uDivs = uDivs
        this.vDivs = vDivs

        const nurbsSurface = new CGFnurbsSurface(1, 1,
            [	// U = 0
                [ // V = 0..1;
                    [ -0.5, 0, 0.5, 1 ],
                    [ -0.5, 0, -0.5, 1 ],
                ],
                // U = 1
                [ // V = 0..1
                    [ 0.5, 0, 0.5, 1 ],
                    [ 0.5, 0, -0.5, 1 ],
                ]
            ]);

        // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
        this.obj = new CGFnurbsObject(this.scene, this.uDivs, this.vDivs, nurbsSurface)
    }


    display() {
        this.obj.display()
    }
}