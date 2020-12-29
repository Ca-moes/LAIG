class MyDefbarrel extends CGFobject {
    constructor(scene, base, middle, height, stacks, slices) {
        super(scene)

        this.scene = scene

        this.updatedTexCoords = true; // no need for updateTexCoords

        const H = (4 / 3) * (middle - base)
        const h = (4 / 3) * base

        let aux = height / 3

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
                    [base + H, (4 / 3) * (base + H), aux, 1],
                    [base + H, (4 / 3) * (base + H), height - aux, 1],
                    [base, h, height, 1],
                ],
                [
                    [-base, h, 0, 1],
                    [-base - H, (4 / 3) * (base + H), aux, 1],
                    [-base - H, (4 / 3) * (base + H), height - aux, 1],
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