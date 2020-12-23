const Players = Object.freeze({
    HUMAN: 1,
    BOT_EASY: 2,
    BOT_NORMAL: 3
})

class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene

        // Preferences (interface)
        this.cameraAnimation = "easeInOutSine"
        this.cameraSpeed = 1
        this.botDelay = 0
        // -----------------------

        this.theme = new MySceneGraph("test.xml", this.scene)
        this.state = new LoadingState(this)
    }

    // called on graph loaded
    init() {
        this.player1 = {
            type: Players.BOT_NORMAL,
            code: 1
        }
        this.player2 = {
            type: Players.BOT_EASY,
            code: 2
        }
        this.currentPlayer = this.player1

        this.gameSequence = new MyGameSequence()
        this.animator = new MyAnimator(this, this.gameSequence)
        this.prolog = new MyPrologInterface(this)

        this.state = new ReadyState(this)

        this.camera = new MyAnimatedCamera(this, Animations[this.cameraAnimation], 45*DEGREE_TO_RAD, 0.1, 500, vec3.fromValues(0, 7, 15), vec3.fromValues(0, -2, 0))
        this.scene.camera = this.camera
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
        this.currentMovement = new MyGameMove(tile, null, this.gameboard.clone())
    }

    nextTurn() {
        this.currentPlayer = this.currentPlayer.code === 1 ? this.player2 : this.player1
        this.camera.startAnimation()
        console.log("Player " + this.currentPlayer.code + " turn")
    }

    /**
     * Method to perform a full movement
     * @param {MyTile} tile Ending Point
     */
    performMove(tile) {
        this.currentMovement.origTile.disableHighlighting()
        this.currentMovement.destTile = tile
        this.currentMovement.processAnimations(this.gameboard.auxiliaryBoard.getNextPieceCoords())
        this.gameSequence.addMove(this.currentMovement)
        this.currentMovement.animate(Date.now() / 1000)
    }

    performBotMove(origin, destination) {
        this.startPicking(origin)
        this.performMove(destination)
    }

    performBotRemove(tile) {
        this.startPicking(tile)
        this.performMove(tile)
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
            this.state.update(time)
        }
    }

    display() {
        this.theme.displayScene()
        this.gameboard.display()
        this.animator.display()
    }

    undo() {
        let move = this.gameSequence.undo()
        if (move != null) {
            this.gameboard.auxiliaryBoard.undo()

            this.gameboard = move.gameboard
            this.gameboard.orchestrator = this

            this.prolog.checkFinalState(this.state, (reply) => {
                this.state = (reply === 0) ? new RemoveState(this) : new ReadyState(this)
                this.nextTurn()

                console.log("Undo Movement")
            })
        }
    }
}