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
        this.moveTimeout = 10
        // -----------------------
        this.camera = new MyAnimatedCamera(this, Animations[this.cameraAnimation], 45*DEGREE_TO_RAD, 0.1, 500, vec3.fromValues(0, 0, 15), vec3.fromValues(0, 0, 0))

        this.prolog = new MyPrologInterface(this)
        this.state = new LoadingState(this)

        // Colors
        this.player1color = [153, 12, 20]
        this.player2color = [15, 50, 128]
        this.player1material = new CGFappearance(this.scene)
        this.player1material.setSpecular(0.1, 0.2, 0.2, 1)
        this.player1material.setAmbient(0, 0, 0, 1)
        this.player1material.setEmission(0, 0, 0, 1)
        this.player1material.setShininess(10)

        this.player2material = new CGFappearance(this.scene)
        this.player2material.setSpecular(0.1, 0.1, 0.2, 1)
        this.player2material.setAmbient(0, 0, 0, 1)
        this.player2material.setEmission(0.0, 0.0, 0.0, 1)
        this.player2material.setShininess(10)

        this.updateColors()
        // -----------------------

        // Themes
        this.loadingScreen = new MyLoadingScreen(scene, this, 7)
        this.currentTheme = 0
        this.themesNames = {0: "test.xml", 1: "izakaya.xml", 2: "space.xml", 3: "city.xml"}
        this.themes = []
        this.selectedTheme = 0
        this.loadScene()
        // -----------------------

        // Models
        this.modelsNames = {"Default": 0, "Flat Chip": 1, "Round Chip": 2}
        this.selectedModel = 0
        this.models = []
        // -----------------------

        // Board Sizes
        this.boardSizes = {"6x6": 6, "8x8": 8, "10x10": 10, "12x12": 12}
        this.selectedBoardSize = 8
        // -----------------------
    }

    updateColors() {
        this.player1material.setDiffuse(this.player1color[0]/255.0,this.player1color[1]/255.0, this.player1color[2]/255.0, 1)
        this.player2material.setDiffuse(this.player2color[0]/255.0,this.player2color[1]/255.0, this.player2color[2]/255.0, 1)
    }

    resetColors() {
        this.player1color = [153, 12, 20]
        this.player2color = [15, 50, 128]
        this.updateColors()

        return {color1: this.player1color, color2: this.player2color}
    }

    onColorsChanged() {
        this.updateColors()
    }

    onThemeLoaded() {
        this.currentTheme++
        if (this.currentTheme >= 4) {
            this.onScenesLoadingComplete()
        } else {
            this.loadScene()
        }
    }

    onScenesLoadingComplete() {
        this.updateScene()
        this.loadModels()
    }

    loadModels() {
        this.loadingScreen.updateMessage("Loading Model: Default")
        this.models.push(new CGFOBJModel(this.scene, "models/default_piece.obj"))
        this.loadingScreen.updateProgress()
        this.loadingScreen.updateMessage("Loading Model: Flat Chip")
        this.models.push(new CGFOBJModel(this.scene, "models/flat_chip_piece.obj"))
        this.loadingScreen.updateProgress()
        this.loadingScreen.updateMessage("Loading Model: Round Chip")
        this.models.push(new CGFOBJModel(this.scene, "models/round_chip_piece.obj"))
        this.loadingScreen.updateProgress()

        this.loadingScreen.updateMessage("Loading Completed")

        this.scene.interface.addStartGameGroup(this)

        this.changeState(new MenuState(this))
        this.scene.camera = this.camera
        this.scene.interface.setActiveCamera(this.camera)
    }

    loadScene() {
        this.loadingScreen.updateMessage("Loading " + this.themesNames[this.currentTheme])
        this.themes.push(new MySceneGraph(this.themesNames[this.currentTheme], this.scene, this))
        this.loadingScreen.updateProgress()
    }

    updateScene() {
        this.scene.updateScene(this.themes[this.selectedTheme])
        this.gameboardProperties = this.themes[this.selectedTheme].gameboardProperties
        this.scene.camera = this.camera

        if (this.gameboard)
            this.gameboard.updateBoard(this.gameboardProperties)
    }

    // called on graph loaded
    init(preferences) {
        this.scene.interface.removeStartGameGroup()

        this.gameboard = new MyGameBoard(this.scene, this, this.selectedBoardSize, this.gameboardProperties)

        this.scene.interface.addThemesGroup({"Test": 0, "Izakaya": 1, "Space": 2, "City": 3})
        this.scene.interface.addModelsGroup(this.modelsNames)
        this.scene.interface.addColorsGroup()

        this.player1 = preferences.player1
        this.player2 = preferences.player2
        this.currentPlayer = this.player1

        this.gameSequence = new MyGameSequence()
        this.animator = new MyAnimator(this, this.gameSequence)

        this.hud = new MyGameHud(this.scene, this)
        this.startTime = Date.now() / 1000

        this.scene.camera = this.camera

        this.scene.interface.addGameGroup()

        this.player1score = 0
        this.player2score = 0

        this.hud.updateMessage(("Player " + this.currentPlayer.code + " turn").toUpperCase())

        this.camera.setTarget(vec3.fromValues(this.gameboardProperties.x, this.gameboardProperties.y, this.gameboardProperties.z))
        this.camera.setPosition(vec3.fromValues(this.gameboardProperties.camera.x, this.gameboardProperties.camera.y, this.gameboardProperties.camera.z))
        this.resetCamera()

        this.scene.interface.setActiveCamera(null)
        this.changeState(new ReadyState(this))
    }

    resetCamera() {
        this.camera.setTarget(vec3.fromValues(this.gameboardProperties.x, this.gameboardProperties.y, this.gameboardProperties.z))
        this.camera.setPosition(vec3.fromValues(this.gameboardProperties.camera.x, this.gameboardProperties.camera.y, this.gameboardProperties.camera.z))

        if (this.currentPlayer.code !== 1) {
            this.camera.orbit(CGFcameraAxis.Y, Math.PI)
        }

        this.scene.camera = this.camera
        console.log("Game Camera Reset")
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
        this.currentMovement = new MyGameMove(tile, null, this.gameboard)
    }

    nextTurn() {
        this.startTime = Date.now() / 1000
        this.currentPlayer = this.currentPlayer.code === 1 ? this.player2 : this.player1
        this.changeState(new CameraAnimationState(this))
        this.camera.startAnimation()

        this.hud.updateMessage(("Player " + this.currentPlayer.code + " turn").toUpperCase())
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
            this.themes[this.selectedTheme].setAnimationsStartTime(time);
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

        this.gameboard = new MyGameBoard(this.scene, this, this.selectedBoardSize, this.gameboardProperties)
        this.gameSequence = new MyGameSequence()
        this.currentPlayer = this.player1
        this.gameboard.auxiliaryBoard.emptyBoard()

        this.startTime = Date.now() / 1000

        this.camera.setPosition(vec3.fromValues(this.gameboardProperties.camera.x, this.gameboardProperties.camera.y, this.gameboardProperties.camera.z))

        this.hud.updateMessage(("Player " + this.currentPlayer.code + " turn").toUpperCase())

        this.changeState(new ReadyState(this))
    }
}