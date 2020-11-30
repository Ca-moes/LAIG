class MyGameOrchestrator {
    constructor(scene, gameBoard, gameSequence, animator, theme, prolog) {
        this.scene = scene
        this.gameSequence = new MyGameSequence()
        this.animator = new MyAnimator(this, gameSequence)
        // we have this on XML, we need to remove it, as XML should only contain SCENE elements
        this.gameboard = new MyGameBoard(this.scene, 0, 0, 8)
        this.theme = new MySceneGraph("test.xml", this.scene)
        // this.prolog = new MyPrologInterface(…)
    }

    update(time) {
        this.animator.update(time)
    }

    display() {
        this.theme.display()
        this.gameboard.display()
        this.animator.display()
    }

    orchestrate() {
        // TODO still not sure what to do here
    }
}