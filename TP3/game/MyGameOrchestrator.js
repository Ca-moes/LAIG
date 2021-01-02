const Players = Object.freeze({
    HUMAN: 0,
    BOT_EASY: 1,
    BOT_NORMAL: 2
})

class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene

        // region Logging Utils
        this.custom = new CustomLogging()
        this.error = new CustomLogging('error')
        // endregion

        // region Preferences (interface)
        this.cameraAnimation = "easeInOutSine"
        this.cameraSpeed = 1
        this.moveAnimation = "easeInOutSine"
        this.moveSpeed = 1
        this.botDelay = 0
        this.moveTimeout = 10
        // endregion

        // region Components
        this.camera = new MyAnimatedCamera(this, Animations[this.cameraAnimation], 45 * DEGREE_TO_RAD, 0.1, 500, vec3.fromValues(0, 0, 15), vec3.fromValues(0, 0, 0))
        this.prolog = new MyPrologInterface(this)
        this.state = new LoadingState(this)
        // endregion

        //region Colors
        this.player1color = [153, 12, 20]
        this.player2color = [15, 50, 128]
        this.boxColor = [15, 15, 15]
        this.tileColor = [220, 220, 220]

        this.ambient = [0, 0, 0, 1]
        this.specular = [0.2, 0.2, 0.2, 1]
        this.emission = [0, 0, 0, 1]

        this.player1material = new CGFappearance(this.scene)
        this.player1material.setSpecular(...this.specular)
        this.player1material.setAmbient(...this.ambient)
        this.player1material.setEmission(...this.emission)
        this.player1material.setShininess(10)

        this.player2material = new CGFappearance(this.scene)
        this.player2material.setSpecular(...this.specular)
        this.player2material.setAmbient(...this.ambient)
        this.player2material.setEmission(...this.emission)
        this.player2material.setShininess(10)

        this.hud1material = new CGFappearance(this.scene)
        this.hud1material.setSpecular(...this.specular)
        this.hud1material.setEmission(...this.emission)
        this.hud1material.setShininess(10)

        this.hud2material = new CGFappearance(this.scene)
        this.hud2material.setSpecular(...this.specular)
        this.hud2material.setEmission(...this.emission)
        this.hud2material.setShininess(10)

        this.boxMaterial = new CGFappearance(this.scene)
        this.boxMaterial.setSpecular(...this.specular)
        this.boxMaterial.setAmbient(...this.ambient)
        this.boxMaterial.setEmission(...this.emission)
        this.boxMaterial.setShininess(10)

        this.tileMaterial = new CGFappearance(this.scene)
        this.tileMaterial.setSpecular(...this.specular)
        this.tileMaterial.setAmbient(...this.ambient)
        this.tileMaterial.setEmission(...this.emission)
        this.tileMaterial.setShininess(10)

        this.updateColors()
        //endregion

        // region Themes
        this.loadingScreen = new MyLoadingScreen(scene, this, 9)
        this.currentTheme = 0
        this.themesNames = {0: "space.xml", 1: "city.xml", 2: "izakaya.xml", 3: "room.xml", 4: "test.xml"}
        this.themes = []
        this.selectedTheme = 0
        this.loadScene()
        // endregion

        // region Models
        this.boxModel = new CGFOBJModel(scene, "models/box.obj")
        this.modelsNames = {"Default": 0, "Flat Chip": 1, "Round Chip": 2, "Donut Chip": 3}
        this.selectedModelPlayer1 = 0
        this.selectedModelPlayer2 = 0
        this.models = []
        // endregion

        // region Board Sizes
        this.boardSizes = {"6x6": 6, "8x8": 8, "10x10": 10, "12x12": 12}
        this.selectedBoardSize = 8
        // endregion
    }

    /**
     * Method to be called when user changes a color on Game Interface
     */
    updateColors() {
        this.player1material.setDiffuse(this.player1color[0] / 255.0, this.player1color[1] / 255.0, this.player1color[2] / 255.0, 1)
        this.hud1material.setDiffuse(this.player1color[0] / 255.0, this.player1color[1] / 255.0, this.player1color[2] / 255.0, 1)
        this.hud1material.setAmbient(this.player1color[0] / 255.0 * 0.35, this.player1color[1] / 255.0 * 0.35, this.player1color[2] / 255.0 * 0.35, 1)
        this.player2material.setDiffuse(this.player2color[0] / 255.0, this.player2color[1] / 255.0, this.player2color[2] / 255.0, 1)
        this.hud2material.setDiffuse(this.player2color[0] / 255.0, this.player2color[1] / 255.0, this.player2color[2] / 255.0, 1)
        this.boxMaterial.setDiffuse(this.boxColor[0] / 255.0, this.boxColor[1] / 255.0, this.boxColor[2] / 255.0, 1)
        this.tileMaterial.setDiffuse(this.tileColor[0] / 255.0, this.tileColor[1] / 255.0, this.tileColor[2] / 255.0, 1)
    }

    /**
     * Method to be called when user clicks "Reset Colors" on Game Interface
     * @returns {{color1: number[], color2: number[], tile: number[], box: number[]}}
     */
    resetColors() {
        this.player1color = [153, 12, 20]
        this.player2color = [15, 50, 128]
        this.boxColor = [15, 15, 15]
        this.tileColor = [220, 220, 220]
        this.updateColors()

        this.custom.log("Colors Reset")
        console.table({color1: this.player1color, color2: this.player2color, box: this.boxColor, tile: this.tileColor})

        return {color1: this.player1color, color2: this.player2color, box: this.boxColor, tile: this.tileColor}
    }

    /**
     * Callback to when XMLGraphScene is done loading the scene, this method either proceeds to the next scene
     * or if all scenes are already loaded it calls the onScenesLoadingComplete to start the menus
     */
    onThemeLoaded() {
        this.currentTheme++
        this.currentTheme >= 5 ? this.onScenesLoadingComplete() : this.loadScene()
    }

    /**
     * After the program is done loading the scenes it then proceeds to loading the models required
     */
    onScenesLoadingComplete() {
        this.updateScene()
        this.loadModels()
    }

    /**
     * This is the final part of the loading process, it loads the models, and adds the start game group
     * to the interface. Then it changes the state to Menu State, the user is now able to chose the preferences
     * for the game and start it.
     */
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

        this.loadingScreen.updateMessage("Loading Model: Donut Chip")
        this.models.push(new CGFOBJModel(this.scene, "models/donut_chip_piece.obj"))
        this.loadingScreen.updateProgress()

        this.loadingScreen.updateMessage("Loading Completed")

        this.scene.interface.addStartGameGroup(this)

        this.changeState(new MenuState(this))
        this.scene.camera = this.camera
        this.scene.interface.setActiveCamera(this.camera)
    }

    /**
     * Method to load a scene
     * Updates the Message on Loading Screen
     * Loads the Scene
     * Updates the Progress on Loading Screen
     */
    loadScene() {
        this.loadingScreen.updateMessage("Loading " + this.themesNames[this.currentTheme])
        // this timeout is just a "fancy" "useless" thing, we can load is no timeout, but this allows the user to see the
        // loading progress being incremented
        setTimeout(() => this.themes.push(new MySceneGraph(this.themesNames[this.currentTheme], this.scene, this)), 0)
        this.loadingScreen.updateProgress()
    }

    /**
     * Method to update the scene selected on interface
     */
    updateScene() {
        this.scene.updateScene(this.themes[this.selectedTheme])
        this.gameboardProperties = this.themes[this.selectedTheme].gameboardProperties

        if (this.gameboard) this.gameboard.updateBoard(this.gameboardProperties)
    }

    /**
     * Called on Game Start
     * This method starts the orchestrator, and the game itself, with preferences selected on menu state
     * @param {Object} preferences preferences for the game (type of game, board size, move timeout, difficulty)
     */
    init(preferences) {
        this.scene.interface.removeStartGameGroup()

        this.gameboard = new MyGameBoard(this.scene, this, this.selectedBoardSize, this.gameboardProperties)

        this.scene.interface.addThemesGroup({"Space": 0, "City": 1, "Izakaya": 2, "Room": 3, "Test": 4})
        this.scene.interface.addModelsGroup(this.modelsNames)
        this.scene.interface.addColorsGroup()

        this.player1 = preferences.player1
        this.player2 = preferences.player2
        this.currentPlayer = this.player1

        this.gameSequence = new MyGameSequence()

        this.startTime = Date.now() / 1000
        this.moveStartTime = Date.now() / 1000
        this.hud = new MyGameHud(this.scene, this)

        this.scene.camera = this.camera

        this.scene.interface.addGameGroup()
        this.scene.interface.addBotsDifficulties()
        this.scene.interface.addViewsGroup("selectedView", this.scene.graph.viewsIds, "View")
        this.scene.interface.addLightsGroup(this.scene.graph.lights)

        this.player1score = 0
        this.player2score = 0

        this.hud.updateMessage(("Player " + this.currentPlayer.code + " turn").toUpperCase())

        this.camera.setTarget(vec3.fromValues(this.gameboardProperties.x, this.gameboardProperties.y, this.gameboardProperties.z))
        this.camera.setPosition(vec3.fromValues(this.gameboardProperties.camera.x, this.gameboardProperties.camera.y, this.gameboardProperties.camera.z))
        this.resetCamera()

        this.scene.interface.setActiveCamera(null)
        this.changeState(new BoardAnimationState(this))
        this.state.startAnimation("start")

        this.custom.log("Game Started")
        console.table({
            "Player 1": Utils.getType(this.player1),
            "Player 2": Utils.getType(this.player2),
            "Timeout": this.moveTimeout,
            "Board Size": `${this.selectedBoardSize}x${this.selectedBoardSize}`
        })
    }

    /**
     * This method resets the animated camera.
     */
    resetCamera() {
        this.camera.setPosition(vec3.fromValues(this.gameboardProperties.camera.x, this.gameboardProperties.camera.y, this.gameboardProperties.camera.z))
        this.camera.setTarget(vec3.fromValues(this.gameboardProperties.x, this.gameboardProperties.y, this.gameboardProperties.z))

        if (this.currentPlayer.code !== 1) {
            this.camera.orbit(CGFcameraAxis.Y, Math.PI)
        }

        this.scene.camera = this.camera
    }

    /**
     * Method to update the score for player 1 and updates the HUD
     * @param {int} score player 1 score
     */
    updatePlayer1Score(score) {
        this.player1score = score
        this.hud.updatePlayer1Score(this.player1score.toString())
    }

    /**
     * Method to update the score for player 2 and updates the HUD
     * @param {int} score player 2 score
     */
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
        this.custom.logStateChanged(this.state.constructor.name)
    }

    /**
     * Method to handle a 'pickTile' event
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

    /**
     * Method to pass the turn to the next player, entering the camera animation state
     */
    nextTurn() {
        this.moveStartTime = Date.now() / 1000
        this.currentPlayer = this.currentPlayer.code === 1 ? this.player2 : this.player1

        this.changeState(new CameraAnimationState(this))
        this.camera.startAnimation("orbit", 1 / this.cameraSpeed)
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

    /**
     * Method to perform a bot movement
     * @param {MyTile} origin original tile position
     * @param {MyTile} destination destination tile position
     */
    performBotMove(origin, destination) {
        this.startPicking(origin)
        this.performMove(destination)
    }

    /**
     * Method to perform a bot remove movement
     * @param {MyTile} tile tile containing a piece to remove
     */
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
        } else if (this.scene.sceneInited && this.scene.timeSet) {
            this.state.update(time)
        }
    }

    /**
     * Method to display the orchestrator's elements
     * this method depends on the state, thus being delegated to the active state
     */
    display() {
        this.state.display()
    }

    /**
     * Method to perform an 'Undo' action
     * this method depends on the state, thus being delegated to the active state
     */
    undo() {
        this.state.undo()
    }

    /**
     * Method to start a new game, after the game over state, this method starts an identical
     * game to the previous one, if the user wishes to change the type of game, the difficulty, the
     * board size or the move timeout then they must reload the application
     */
    restart() {
        this.scene.interface.resetInterface()
        this.changeState(new BoardAnimationState(this))
        this.state.startAnimation("restart")
    }

    onRestartAnimationCompleted() {
        this.gameboard = new MyGameBoard(this.scene, this, this.selectedBoardSize, this.gameboardProperties)
        this.gameSequence = new MyGameSequence()
        this.currentPlayer = this.player1
        this.gameboard.auxiliaryBoard.emptyBoard()

        this.startTime = Date.now() / 1000

        this.camera.setPosition(vec3.fromValues(this.gameboardProperties.camera.x, this.gameboardProperties.camera.y, this.gameboardProperties.camera.z))

        this.hud.updateMessage(("Player " + this.currentPlayer.code + " turn").toUpperCase())

        this.custom.log("Restarted Game")
        this.changeState(new ReadyState(this))
    }

    replay() {
        this.changeState(new BoardAnimationState(this))
        this.state.startAnimation("replay")
    }

    onReplayAnimationCompleted() {
        this.camera.startAnimation("position", 1.5, () => {
                this.custom.log("Started Replay")
                this.changeState(new ReplayState(this))
            },
            [
                this.gameboardProperties.x,
                this.gameboardProperties.y + 15,
                this.gameboardProperties.z
            ],
            [
                this.gameboardProperties.x,
                this.gameboardProperties.y,
                this.gameboardProperties.z
            ])
    }

    pause() {
        this.custom.log("Paused Game")
        this.tempMessage = this.hud.message.string
        this.hud.updateMessage("PAUSED")

        this.scene.interface.removePauseButton()
        this.scene.interface.addContinueButton()
        this.state.pause()
    }

    continue() {
        this.custom.log("Continued Game")
        this.hud.updateMessage(this.tempMessage)

        this.scene.interface.addPauseButton()
        this.scene.interface.removeContinueButton()
        this.state.continue()
    }
}