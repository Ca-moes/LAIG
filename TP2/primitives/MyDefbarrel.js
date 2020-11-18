class MyDefbarrel extends CGFobject {
    constructor(scene, base, middle, height, stacks, slices) {
        super(scene)

        this.scene = scene

        this.updatedTexCoords = true; // no need for updateTexCoords

        const r = base
        const R = middle
        const L = height
        const H = (4/3) * (R - r)
        const h = (4/3) * r

        let angle = Math.atan(h/r) // atan(4/3)
        let aux = L / Math.tan(Math.PI / 2.5)

        this.surface = new Patch(scene, stacks, slices, 3, 3,
            [
                    [
                        [-r, 0, L, 1],
                        [-(r + H), 0, L - aux , 1],
                        [-(r + H), 0, aux, 1],
                        [-r, 0, 0, 1],
                    ],
                    [
                        [-r, h, L, 1],
                        [(H) * Math.cos(Math.PI - angle) - r, Math.sin(Math.PI - angle) * (r+h) + r, L - aux , 1],
                        [(H) * Math.cos(Math.PI - angle) - r, Math.sin(Math.PI - angle) * (r+h) + r, aux, 1],
                        [-r, h, 0, 1],
                    ],
                    [
                        [r, h, L, 1],
                        [(H) * Math.cos(angle) + r, Math.sin(angle) * (r+h) + r, L - aux , 1],
                        [(H) * Math.cos(angle) + r, Math.sin(angle) * (r+h) + r, aux, 1],
                        [r, h, 0, 1],
                    ],
                    [
                        [r, 0, L, 1],
                        [r + H, 0, L - aux , 1],
                        [r + H, 0, aux, 1],
                        [r, 0, 0, 1],
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