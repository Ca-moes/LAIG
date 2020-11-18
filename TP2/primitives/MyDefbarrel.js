class MyDefbarrel extends CGFobject {
    constructor(scene, base, middle, height, stacks, slices) {
        super(scene)

        this.scene = scene

        this.updatedTexCoords = true; // no need for updateTexCoords

        const H = (4/3) * (middle - base)
        const h = (4/3) * base

        let angle = Math.atan(h/base)
        let aux = height / Math.tan(Math.PI / 2.5)

        this.surface = new Patch(scene, stacks, slices, 3, 3,
            [
                    [
                        [-base, 0, height, 1],
                        [-base - H, 0, height - aux , 1],
                        [-base - H, 0, aux, 1],
                        [-base, 0, 0, 1],
                    ],
                    [
                        [-base, h, height, 1],
                        [(base + H - base) * Math.cos(Math.PI - angle) - base, Math.sin(Math.PI - angle) * (base + h) + base, height - aux , 1],
                        [(base + H - base) * Math.cos(Math.PI - angle) - base, Math.sin(Math.PI - angle) * (base + h) + base, aux, 1],
                        [-base, h, 0, 1],
                    ],
                    [
                        [base, h, height, 1],
                        [(base + H - base) * Math.cos(angle) + base, Math.sin(angle) * (base + h) + base, height - aux , 1],
                        [(base + H - base) * Math.cos(angle) + base, Math.sin(angle) * (base + h) + base, aux, 1],
                        [base, h, 0, 1],
                    ],
                    [
                        [base, 0, height, 1],
                        [base + H, 0, height - aux , 1],
                        [base + H, 0, aux, 1],
                        [base, 0, 0, 1],
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