/**
 * Loading Screen Class
 */
class MyLoadingScreen extends CGFobject {
    /**
     * Starts a loading screen
     * @param {XMLscene} scene
     * @param {MyGameOrchestrator} orchestrator
     * @param total total elements to be loaded (to update the shader)
     */
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

    /**
     * This method updates the message being displayed on the Loading Screen
     * @param message
     */
    updateMessage(message) {
        this.message.string = message
    }

    /**
     * Updates the progress on the loading screen
     */
    updateProgress() {
        this.progress++
    }

    /**
     * Displays the loading screen
     */
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