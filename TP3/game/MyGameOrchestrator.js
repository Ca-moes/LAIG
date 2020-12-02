class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene
        this.gameSequence = new MyGameSequence()
        this.animator = new MyAnimator(this, this.gameSequence)
        // The gameboard is assigned to the orchestrator as soon as the XMLScene is Loaded
        this.theme = new MySceneGraph("test.xml", this.scene)
        // this.prolog = new MyPrologInterface(…)

        this.state = new ReadyState(this)
    }

    changeState(state) {
        this.state = state
    }

    pickTile(tile) {
        this.state.pickTile(tile)
    }

    animationEnd() {
        this.state.animationEnd()
    }

    startPicking(tile) {
        this.currentMovement = new MyGameMove(tile, null, this.gameboard)
    }

    performMove(tile) {
        this.currentMovement.destTile = tile
        this.currentMovement.processAnimations()
        this.gameSequence.addMove(this.currentMovement)
        this.currentMovement.animate(Date.now() / 1000)
    }

    /**
     * Method to update orchestrator elements
     * @param time time in seconds
     */
    update(time) {
        console.log(this.state.constructor.name)

        if (this.scene.sceneInited && !this.scene.timeSet) {
            this.theme.setAnimationsStartTime(time);
            this.scene.timeSet = true;
        }
        else if (this.scene.sceneInited && this.scene.timeSet) {
            this.theme.updateAnimations(time);
            this.gameboard.update(time)
        }
        if (this.currentMovement) {
            if (this.currentMovement.animationCompleted) {
                this.currentMovement = null
                this.animationEnd()
            }
        }
        this.animator.update(time)
    }

    display() {
        this.theme.displayScene()
        // linter may say its unresolved but as soon as the XMLScene is loaded
        // gameboard is assigned here
        this.gameboard.display()
        this.animator.display()
    }

    orchestrate() {
        // TODO state machine
    }
}