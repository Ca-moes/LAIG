const Players = Object.freeze({
    HUMAN: 0,
    BOT_EASY: 1,
    BOT_NORMAL: 2
})

class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene

        // Preferences (interface)
        this.cameraAnimation = "easeInOutSine"
        this.cameraSpeed = 1
        this.botDelay = 0
        // -----------------------

        this.prolog = new MyPrologInterface(this)
        this.theme = new MySceneGraph("test.xml", this.scene)
        this.state = new LoadingState(this)
    }

    // called on graph loaded
    init(preferences) {
        this.player1 = preferences.player1
        this.player2 = preferences.player2
        this.currentPlayer = this.player1

        this.gameSequence = new MyGameSequence()
        this.animator = new MyAnimator(this, this.gameSequence)

        this.hud = new MyGameHud(this.scene, this)
        this.startTime = Date.now() / 1000

        this.changeState(new ReadyState(this))

        this.camera = new MyAnimatedCamera(this, Animations[this.cameraAnimation], 45*DEGREE_TO_RAD, 0.1, 500, vec3.fromValues(0, 7, 15), vec3.fromValues(0, 0, 0))
        this.scene.camera = this.camera

        this.scene.interface.addGameGroup()

        this.player1score = 0
        this.player2score = 0

        this.hud.updateMessage(("Player " + this.currentPlayer.code + " turn").toUpperCase())
    }

    updatePlayer1Score(score) {
        this.player1score = score
        this.hud.updatePlayer1Score(this.player1score.toString())
    }

    updatePlayer2Score(score) {
        this.player2score = score
        this.hud.updatePlayer2Score(this.player2score.toString())
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
        this.changeState(new CameraAnimationState(this))
        this.camera.startAnimation()

        this.hud.updateMessage(("Player " + this.currentPlayer.code + " turn").toUpperCase())
        console.log("Player " + this.currentPlayer.code + " turn") // remove this on release
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
        this.state.display()
    }

    undo() {
        this.state.undo()
    }

    restart() {
        this.scene.interface.resetInterface()

        this.gameboard = this.theme.gameboard.clone()
        this.gameSequence = new MyGameSequence()
        this.currentPlayer = this.player1
        this.gameboard.auxiliaryBoard.emptyBoard()

        this.startTime = Date.now() / 1000

        this.camera.setPosition(vec3.fromValues(0, 7, 15))

        this.hud.updateMessage(("Player " + this.currentPlayer.code + " turn").toUpperCase())

        this.changeState(new ReadyState(this))
    }
}