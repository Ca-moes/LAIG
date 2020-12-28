class MyGameHud extends CGFobject {
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

    updateTime(time) {
        this.timeSprite.string = time
    }

    updateMessage(msg) {
        this.message.string = msg
    }

    updatePlayer1Score(score) {
        this.player1score.string = score
    }

    updatePlayer2Score(score) {
        this.player2score.string = score
    }

    display() {
        // Player 1 HUD
        this.scene.pushMatrix()

        this.orchestrator.player1material.apply()

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

        this.orchestrator.player2material.apply()
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