class MyDefbarrel extends CGFobject {
    constructor(scene, base, middle, height, stacks, slices) {
        super(scene)

        this.scene = scene

        this.updatedTexCoords = true; // no need for updateTexCoords

        const H = (4 / 3) * (middle - base)
        const h = (4 / 3) * base

        const alpha = 20 * DEGREE_TO_RAD

        let aux = H / Math.tan(alpha)

        /* attempting to find why that value
        console.log(`
            middle: ${middle}
            H: ${H}
            middle + H: ${middle + H}
            (4/3)middle: ${(4/3)*middle}
            (4/3)middle + H: ${(4/3)*middle + H}
            (4/3)middle + h: ${(4/3)*middle + h}
            (4/3)middle + base: ${(4/3)*middle + base}
            h + H: ${h + H}
            base + H: ${base + H}
            value / H: ${10.1733333333 / H}
            value - H: ${10.1733333333 - H}
            value - base: ${10.1733333333 - base}
            value - middle: ${10.1733333333 - middle}
            answer: ${h + aux*Math.tan(alpha)}
        `) */

        this.surface = new Patch(scene, stacks, slices, 3, 3,
            [
                [
                    [base, 0, 0, 1],
                    [base + H, 0, aux, 1],
                    [base + H, 0, height - aux, 1],
                    [base, 0, height, 1],
                ],
                [
                    [base, h, 0, 1],
                    [base + H, (4.36/3)*middle, aux, 1],
                    [base + H, (4.36/3)*middle, height - aux, 1],
                    [base, h, height, 1],
                ],
                [
                    [-base, h, 0, 1],
                    [-base - H, (4.36/3)*middle, aux, 1],
                    [-base - H, (4.36/3)*middle, height - aux, 1],
                    [-base, h, height, 1],
                ],
                [
                    [-base, 0, 0, 1],
                    [-base - H, 0, aux, 1],
                    [-base - H, 0, height - aux, 1],
                    [-base, 0, height, 1],
                ],
            ])
    }

    display() {
        this.surface.display()
        this.scene.pushMatrix()
        this.scene.rotate(Math.PI, 0, 0, 1)
        this.surface.display()
        this.scene.popMatrix()
    }
}