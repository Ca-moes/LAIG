class MenuState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);

        this.menu = new MyMenu(this.orchestrator.scene, this.orchestrator)
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

    continue() {

    }

    pause() {

    }
}