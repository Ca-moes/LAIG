class MyGameHud extends CGFobject {
    constructor(scene, orchestrator) {
        super(scene);
        this.scene = scene
        this.orchestrator = orchestrator

        this.timeSprite = new MySpriteText(scene, "20:20")
        this.billboard = new MyRectangle(scene, -3, -1, 3, 1)
        this.texture = new CGFtexture(scene, "scenes/images/testTexture.png")
    }

    updateTime(time) {
        this.timeSprite.string = time
    }

    display() {
        this.scene.pushMatrix()
        this.texture.bind()
        this.scene.translate(0, 2, -10)
        this.texture.bind()
        this.billboard.display()
        this.scene.translate(0, 0, 0.01)
        this.timeSprite.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.texture.bind()
        this.scene.translate(0, 2, 10)
        this.scene.rotate(Math.PI, 0, 1, 0)
        this.texture.bind()
        this.billboard.display()
        this.scene.translate(0, 0, 0.01)
        this.timeSprite.display()
        this.scene.popMatrix()
    }
}