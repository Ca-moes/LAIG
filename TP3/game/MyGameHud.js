/**
 * Game HUD display
 */
class MyGameHud extends CGFobject {
    /**
     * Starts the HUD
     *
     * This is just one class but it has 2 HUDs, on for each player
     *
     * @param {XMLscene} scene
     * @param {MyGameOrchestrator} orchestrator
     */
    constructor(scene, orchestrator) {
        super(scene);
        this.scene = scene
        this.orchestrator = orchestrator

        this.timeSprite = new MySpriteText(scene, "20:20")
        this.timeoutSprite = new MySpriteText(scene, Utils.formatTime(this.orchestrator.moveTimeout))
        this.playersSprite = new MySpriteText(scene, "P1 P2")
        this.player1score = new MySpriteText(scene, "0")
        this.player2score = new MySpriteText(scene, "0")
        this.message = new MySpriteText(scene, "Welcome to Talpa")

        this.billboard = new MyRectangle(scene, -4, -2, 4, 2)
        this.texture = new CGFtexture(scene, "scenes/images/tile.jpg")
    }

    /**
     * Updates the total time on the HUDs
     * @param time
     */
    updateTime(time) {
        this.timeSprite.string = time
    }

    /**
     * Updates the total left on the HUDs
     * @param time
     */
    updateTimeLeft(time) {
        this.timeoutSprite.string = time
    }

    /**
     * Updates the message being displayed on the HUDs
     * @param {String} msg message to update the HUDs with
     */
    updateMessage(msg) {
        this.message.string = msg
    }

    /**
     * Updates the Player 1 score
     * @param score
     */
    updatePlayer1Score(score) {
        this.player1score.string = score
    }

    /**
     * Updates the Player 2 score
     * @param score
     */
    updatePlayer2Score(score) {
        this.player2score.string = score
    }

    /**
     * Displays the both HUDs
     */
    display() {
        // Player 1 HUD
        this.scene.pushMatrix()

        this.orchestrator.hud1material.apply()

        // backboard
        this.scene.translate(0, 2, -10)
        this.texture.bind()
        this.billboard.display()

        // score p1
        this.scene.pushMatrix()
        this.scene.translate(-2.75, 0.5, 0.01)
        this.scene.scale(1.5, 1.5, 1)
        this.player1score.display()
        this.scene.popMatrix()

        // score p2
        this.scene.pushMatrix()
        this.scene.translate(2.75, 0.5, 0.01)
        this.scene.scale(1.5, 1.5, 1)
        this.player2score.display()
        this.scene.popMatrix()

        // label player
        this.scene.pushMatrix()
        this.scene.translate(0, 0, 0.01)
        this.scene.scale(0.7, 0.7, 1)
        this.playersSprite.display()
        this.scene.popMatrix()

        // timeout
        this.scene.pushMatrix()
        this.scene.translate(0, 1.5, 0.01)
        this.scene.scale(0.4, 0.4, 1)
        this.timeoutSprite.display()
        this.scene.popMatrix()

        // time
        this.scene.pushMatrix()
        this.scene.translate(0, 1, 0.01)
        this.scene.scale(0.7, 0.7, 1)
        this.timeSprite.display()
        this.scene.popMatrix()

        // message
        this.scene.pushMatrix()
        this.scene.translate(0, -1, 0.01)
        this.scene.scale(0.5, 0.5, 1)
        this.message.display()
        this.scene.popMatrix()

        this.scene.popMatrix()

        // player 2 HUD
        this.scene.pushMatrix()

        this.orchestrator.hud2material.apply()
        this.scene.translate(0, 2, 10)
        this.scene.rotate(Math.PI, 0, 1, 0)
        this.texture.bind()
        this.billboard.display()

        this.scene.pushMatrix()
        this.scene.translate(-2.75, 0.5, 0.01)
        this.scene.scale(1.5, 1.5, 1)
        this.player1score.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(2.75, 0.5, 0.01)
        this.scene.scale(1.5, 1.5, 1)
        this.player2score.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(0, 0, 0.01)
        this.scene.scale(0.7, 0.7, 1)
        this.playersSprite.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(0, 1.5, 0.01)
        this.scene.scale(0.4, 0.4, 1)
        this.timeoutSprite.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(0, 1, 0.01)
        this.scene.scale(0.7, 0.7, 1)
        this.timeSprite.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(0, -1, 0.01)
        this.scene.scale(0.5, 0.5, 1)
        this.message.display()
        this.scene.popMatrix()

        this.scene.popMatrix()
    }
}