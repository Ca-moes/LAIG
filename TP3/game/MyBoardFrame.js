class MyBoardFrame extends CGFobject {
    constructor(scene, size) {
        super(scene);
        this.scene = scene

        this.size = size

        this.plane = new Plane(scene, 2, 2)
        this.rectangle = new Plane(scene, 2, 2)
        this.triangle = new MyTriangle(scene, 0, 0.5, 1, -0.5, 0, -0.5)
    }

    display() {
        this.scene.pushMatrix()
        this.scene.orchestrator.player2material.apply()
        this.scene.translate(0, 0, 0.25 + this.size / 2)
        this.scene.scale(this.size, 1, 0.5)
        this.rectangle.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.orchestrator.player2material.apply()
        this.scene.translate(0, 0, -0.25 - this.size / 2)
        this.scene.scale(this.size, 1, 0.5)
        this.rectangle.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.orchestrator.player1material.apply()
        this.scene.translate(-0.25 - this.size / 2, 0, 0)
        this.scene.scale(0.5, 1, this.size)
        this.rectangle.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.orchestrator.player1material.apply()
        this.scene.translate(0.25 + this.size / 2, 0, 0)
        this.scene.scale(0.5, 1, this.size)
        this.rectangle.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.orchestrator.player2material.apply()
        this.scene.translate(this.size / 2 + 0.25, 0, 0.5 + this.size / 2)
        this.scene.scale(0.5, 1, 0.5)
        this.scene.rotate(Math.PI / 2, 0, 1, 0)
        this.scene.rotate(Math.PI / 2, 1, 0, 0)
        this.triangle.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.orchestrator.player2material.apply()
        this.scene.translate(-this.size / 2, 0, 0.25 + this.size / 2)
        this.scene.rotate(Math.PI, 0, 1, 0)
        this.scene.scale(0.5, 1, 0.5)
        this.scene.rotate(Math.PI / 2, 1, 0, 0)
        this.triangle.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.orchestrator.player2material.apply()
        this.scene.translate(-this.size / 2 - 0.25, 0, -0.5 - this.size / 2)
        this.scene.rotate(-Math.PI / 2, 0, 1, 0)
        this.scene.scale(0.5, 1, 0.5)
        this.scene.rotate(Math.PI / 2, 1, 0, 0)
        this.triangle.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.orchestrator.player2material.apply()
        this.scene.translate(this.size / 2, 0, -0.25 - this.size / 2)
        this.scene.scale(0.5, 1, 0.5)
        this.scene.rotate(Math.PI / 2, 1, 0, 0)
        this.triangle.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.orchestrator.player1material.apply()
        this.scene.translate(this.size / 2 + 0.5, 0, -0.25 - this.size / 2)
        this.scene.rotate(-Math.PI, 0, 1, 0)
        this.scene.scale(0.5, 1, 0.5)
        this.scene.rotate(Math.PI / 2, 1, 0, 0)
        this.triangle.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.orchestrator.player1material.apply()
        this.scene.translate(-this.size / 2 - 0.25, 0, -this.size / 2)
        this.scene.rotate(Math.PI / 2, 0, 1, 0)
        this.scene.scale(0.5, 1, 0.5)
        this.scene.rotate(Math.PI / 2, 1, 0, 0)
        this.triangle.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.orchestrator.player1material.apply()
        this.scene.translate(-this.size / 2 - 0.5, 0, this.size / 2 + 0.25)
        this.scene.scale(0.5, 1, 0.5)
        this.scene.rotate(Math.PI / 2, 1, 0, 0)
        this.triangle.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.orchestrator.player1material.apply()
        this.scene.translate(this.size / 2 + 0.25, 0, this.size / 2)
        this.scene.rotate(-Math.PI / 2, 0, 1, 0)
        this.scene.scale(0.5, 1, 0.5)
        this.scene.rotate(Math.PI / 2, 1, 0, 0)
        this.triangle.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(0, -0.01, 0)
        this.scene.scale(this.size * 1.15, 1, this.size * 1.15)
        this.scene.rotate(Math.PI, 1, 0, 0)
        this.plane.display()
        this.scene.popMatrix()
    }

}