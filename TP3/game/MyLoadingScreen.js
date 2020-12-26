class MyLoadingScreen extends CGFobject {
    constructor(scene, orchestrator, total) {
        super(scene);
        this.orchestrator = orchestrator

        this.progress = 0
        this.total = total

        this.loading = new MySpriteText(scene, "Loading")
        this.message = new MySpriteText(scene, "example")
        this.rectangle = new MyRectangle(scene, -4, -0.2, 4, 0.2)

        this.shader = new CGFshader(scene.gl, "shaders/loading.vert", "shaders/loading.frag")
    }

    updateMessage(message) {
        this.message.string = message
    }

    updateProgress() {
        this.progress += 1
    }

    display() {
        this.scene.pushMatrix()
        this.scene.translate(0, 2, 0)
        this.loading.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(0, -2, 0)
        this.scene.scale(0.4, 0.4, 1)
        this.message.display()
        this.scene.popMatrix()

        this.scene.setActiveShader(this.shader)
        this.shader.setUniformsValues({progress: this.progress / this.total})
        this.rectangle.display()
        this.scene.setActiveShader(this.scene.defaultShader)
    }
}