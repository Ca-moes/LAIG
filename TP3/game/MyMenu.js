class Option extends CGFobject {
    constructor(scene, texture, shader, option) {
        super(scene);

        this.selected = false
        this.scene = scene
        this.texture = texture
        this.shader = shader
        this.option = option
        this.obj = new MyRectangle(scene, -1.5, -1, 1.5, 1)
    }

    toString() {
        return "Option: " + this.option + " - selected: " + this.selected
    }

    display() {
        if (this.selected)
            this.scene.setActiveShader(this.shader)
        this.texture.bind()
        this.obj.display()
        if (this.selected)
            this.scene.setActiveShader(this.scene.defaultShader)
    }
}

class MyMenu extends CGFobject {
    constructor(scene, orchestrator) {
        super(scene);

        this.orchestrator = orchestrator

        this.welcome = new MySpriteText(scene, "WELCOME TO TALPA")
        this.credits = new MySpriteText(scene, "GONCALO TEIXEIRA : ANDRE GOMES")
        this.label1 = new MySpriteText(scene, "PLAYER 1")
        this.label2 = new MySpriteText(scene, "PLAYER 2")


        this.human = new CGFtexture(scene, "scenes/images/human.png")
        this.easy = new CGFtexture(scene, "scenes/images/easy.png")
        this.normal = new CGFtexture(scene, "scenes/images/normal.png")

        this.shader = new CGFshader(this.scene.gl, "shaders/highlightoption.vert", "shaders/highlightoption.frag")

        this.human1 = new Option(scene, this.human, this.shader, 0)
        this.easy1 = new Option(scene, this.easy, this.shader, 1)
        this.normal1 = new Option(scene, this.normal, this.shader, 2)

        this.human2 = new Option(scene, this.human, this.shader, 3)
        this.easy2 = new Option(scene, this.easy, this.shader, 4)
        this.normal2 = new Option(scene, this.normal, this.shader, 5)

        this.human1.selected = true
        this.human2.selected = true

        this.options = [this.human1, this.easy1, this.normal1, this.human2, this.easy2, this.normal2]

        this.scene.interface.addStartButton(this)
    }

    startGame() {
        // consult GameOrchestrator for codes
        let player1, player2
        for (let i = 0; i < 3; i++)
            if (this.options[i].selected)
                player1 = { type: i, code: 1}
        for (let i = 3; i < 6; i++)
            if (this.options[i].selected)
                player2 = { type: i - 3, code: 2}

        //console.clear()
        console.log("Game Started", "\n", "Player1:", player1, "\n", "Player2:", player2)
        this.orchestrator.scene.gui.removeStartButton()
        this.orchestrator.init({player1: player1, player2: player2})
    }

    activateOption(option) {
        this.options[option].selected = true
        if (option < 3) {
            for (let i = 0; i < 3; i++)
                if (option !== i && this.options[i].selected) this.options[i].selected = false
        } else {
            for (let i = 3; i < 6; i++) {
                if (option !== i && this.options[i].selected) this.options[i].selected = false
            }
        }
    }

    logPicking() {
        if (this.scene.pickMode === false) {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                for (let i = 0; i < this.scene.pickResults.length; i++) {
                    const obj = this.scene.pickResults[i][0];
                    if (obj instanceof Option) {
                        // const customId = this.scene.pickResults[i][1];
                        // console.log("Picked object: " + obj.toString() + ", with pick id " + customId);
                        this.activateOption(obj.option)
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    display() {
        this.logPicking()
        this.scene.clearPickRegistration();

        // player 1
        this.scene.registerForPick(this.human1.option, this.human1)
        this.scene.pushMatrix()
        this.human.bind()
        this.scene.translate(-9.25, -3, 0)
        this.human1.display()
        this.scene.popMatrix()

        this.scene.registerForPick(this.easy1.option, this.easy1)
        this.scene.pushMatrix()
        this.easy.bind()
        this.scene.translate(-6.25, -3, 0)
        this.easy1.display()
        this.scene.popMatrix()

        this.scene.registerForPick(this.normal1.option, this.normal1)
        this.scene.pushMatrix()
        this.normal.bind()
        this.scene.translate(-3.25, -3, 0)
        this.normal1.display()
        this.scene.popMatrix()

        // player 2
        this.scene.registerForPick(this.human2.option, this.human2)
        this.scene.pushMatrix()
        this.human.bind()
        this.scene.translate(3.25, -3, 0)
        this.human2.display()
        this.scene.popMatrix()

        this.scene.registerForPick(this.easy2.option, this.easy2)
        this.scene.pushMatrix()
        this.easy.bind()
        this.scene.translate(6.25, -3, 0)
        this.easy2.display()
        this.scene.popMatrix()

        this.scene.registerForPick(this.normal2.option, this.normal2)
        this.scene.pushMatrix()
        this.normal.bind()
        this.scene.translate(9.25, -3, 0)
        this.normal2.display()
        this.scene.popMatrix()

        // Labels
        this.scene.pushMatrix()
        this.scene.translate(-6, 0, 0)
        this.label1.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(6, 0, 0)
        this.label2.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(0, 4, 0)
        this.welcome.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(0, -6, 0)
        this.scene.scale(0.3, 0.3, 1)
        this.credits.display()
        this.scene.popMatrix()
    }
}