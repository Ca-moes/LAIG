class MenuState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);

        this.menu = new MyMenu(this.orchestrator.scene, this.orchestrator)
        this.orchestrator.scene.camera = new CGFcamera(45*DEGREE_TO_RAD, 0.1, 500, vec3.fromValues(0, 0, 15), vec3.fromValues(0, 0, 0))
    }

    display() {
        this.menu.display()
    }

    animationEnd() {

    }

    pickTile(tile) {

    }

    update(time) {

    }

    undo() {

    }
}