class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene
        this.gameSequence = new MyGameSequence()
        this.animator = new MyAnimator(this, this.gameSequence)
        // The gameboard is assigned to the orchestrator as soon as the XMLScene is Loaded
        this.theme = new MySceneGraph("test.xml", this.scene)
        // this.prolog = new MyPrologInterface(…)

        this.state = new GameState(this)

        this.changeState(new ReadyState(this))
    }

    /**
     * Changes the current Game State
     * @param {GameState} state
     */
    changeState(state) {
        this.state = state
    }

    /**
     * Method to handle a 'pickValidTile' event
     * @param {MyTile} tile
     */
    pickValidTile(tile) {
        this.state.pickValidTile(tile)
    }

    /**
     * Method to handle a 'pickInvalidTile' event
     * @param {MyTile} tile
     */
    pickInvalidTile(tile) {
        this.state.pickInvalidTile(tile)
    }

    /**
     * Method to handle a 'animationEnd' event
     */
    animationEnd() {
        this.state.animationEnd()
    }

    /**
     * Method to start a game movement
     * @param {MyTile} tile Starting Point
     */
    startPicking(tile) {
        this.currentMovement = new MyGameMove(tile, null, this.gameboard)
    }

    /**
     * Method to perform a full movement
     * @param {MyTile} tile Ending Point
     */
    performMove(tile) {
        this.currentMovement.origTile.disableHighlighting()
        this.currentMovement.destTile = tile
        this.currentMovement.processAnimations()
        this.gameSequence.addMove(this.currentMovement)
        this.currentMovement.animate(Date.now() / 1000)
    }

    /**
     * Method to cancel an existing move as an Invalid Tile was picked
     */
    cancelMove() {
        this.currentMovement.origTile.disableHighlighting()
        this.currentMovement.origTile.getPiece().reset()
        this.currentMovement = null
    }

    /**
     * Method to update orchestrator elements
     * @param time time in seconds
     */
    update(time) {
        // prints on the console the current game state
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