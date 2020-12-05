class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene
        this.gameSequence = new MyGameSequence()
        this.animator = new MyAnimator(this, this.gameSequence)
        // The gameboard is assigned to the orchestrator as soon as the XMLScene is Loaded
        this.theme = new MySceneGraph("test.xml", this.scene)
        this.prolog = new MyPrologInterface(this)

        this.state = new ReadyState(this)

        this.currentPlayer = 1
    }

    /**
     * Changes the current Game State
     * @param {GameState} state
     */
    changeState(state) {
        this.state = state
        console.log("Changed state: " + this.state.constructor.name)
    }

    /**
     * Method to handle a 'pickValidTile' event
     * @param {MyTile} tile
     */
    pickTile(tile) {
        this.state.pickTile(tile)
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

    notifyReplyReceived(msg) {
        this.state.notifyReplyReceived(msg)
    }

    orchestrate() {
        /* state machine (we probably wont need this method as we are implementing a state pattern for every
         * element, State Pattern -> Thank god we had LPOO Last Semester */
    }
}