/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * To be Used Later
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () {
        };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    /**
     * Creates a Folder in Interface for the Views
     * @param {*} id Variable to keep the current View
     * @param {*} list List of Views ID
     * @param {*} name Name to Display in Interface
     */
    addViewsGroup(id, list, name) {
        if (this.views != null)
            this.gui.removeFolder(this.views)

        this.views = this.gui.addFolder("Views");
        this.views.open();

        this.scene.selectedView = this.scene.graph.defaultView

        list.push("default/reset")
        this.views.add(this.scene, id, list).name(name).onChange(this.scene.updateView.bind(this.scene))
    }

    /**
     * Creates a Folder in Interface for the Lights
     * @param {any} lights Map of Lights to pass to Folder
     */
    addLightsGroup(lights) {
        if (this.lights != null)
            this.gui.removeFolder(this.lights)
        this.lights = this.gui.addFolder("Lights");
        this.lights.open();

        for (let key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightFlags[key] = lights[key][0];
                this.lights.add(this.scene.lightFlags, key).onChange(this.scene.updateLights.bind(this.scene))
            }
        }
    }

    /**
     * This method adds a group to the interface containing the preferences to start a new game
     * @param {MyGameOrchestrator} orchestrator
     */
    addStartGameGroup(orchestrator) {
        this.startOptions = this.gui.addFolder("Start Game");
        this.startOptions.open();

        this.startOptions.add(orchestrator, "selectedBoardSize", orchestrator.boardSizes).name("Size")
        this.startOptions.add(orchestrator, 'moveTimeout', 5, 30, 1).name("Move Timeout")
        this.startOptions.add({start: () => orchestrator.state.menu.startGame()}, "start").name("Start Game")
    }

    /**
     * This method removes the start game group
     */
    removeStartGameGroup() {
        this.gui.removeFolder(this.startOptions)
    }

    /**
     * This method takes a list of themes and adds them to the interface, so the user can change
     * the current theme on runtime
     * @param {Object} themes {theme1: 0, theme2: 1, ...} themes loaded on orchestrator
     */
    addThemesGroup(themes) {
        this.themes = this.gui.addFolder("Themes");
        this.themes.open();

        this.themes.add(this.scene.orchestrator, "selectedTheme", themes).name("Theme").onChange(() => {
            this.scene.orchestrator.updateScene();
            this.scene.orchestrator.resetCamera()
        })
    }

    /**
     * This method takes a list of models and adds them to the interface, so the user can change
     * the current model on runtime
     * @param {Object} models {model1: 0, model2: 1, ...} models loaded on orchestrator
     */
    addModelsGroup(models) {
        let modelsGroup = this.themes.addFolder("Models")
        modelsGroup.open()

        modelsGroup.add(this.scene.orchestrator, "selectedModelPlayer1", models).name("Player 1")
        modelsGroup.add(this.scene.orchestrator, "selectedModelPlayer2", models).name("Player 2")
    }

    /**
     * This method adds the option to change some colors on runtime
     */
    addColorsGroup() {
        let colors = this.themes.addFolder("Colors")

        this.color1 = colors.addColor(this.scene.orchestrator, 'player1color').name("Player 1").onChange(() => this.scene.orchestrator.updateColors())
        this.color2 = colors.addColor(this.scene.orchestrator, 'player2color').name("Player 2").onChange(() => this.scene.orchestrator.updateColors())
        this.box = colors.addColor(this.scene.orchestrator, 'boxColor').name("Box Color").onChange(() => this.scene.orchestrator.updateColors())
        this.tile = colors.addColor(this.scene.orchestrator, 'tileColor').name("Tile Color").onChange(() => this.scene.orchestrator.updateColors())
    }

    /**
     * Method to add options concerning the Game to the interface
     */
    addGameGroup() {
        const group = this.gui.addFolder("Game")
        group.open()

        this.preferences = group.addFolder("Preferences");

        this.bots = this.preferences.addFolder("Bots")
        this.bots.open()
        this.bots.add(this.scene.orchestrator, 'botDelay', 0, 5.0).name("Delay")

        const camera = this.preferences.addFolder("Camera Settings")
        camera.open()

        camera.add(this.scene.orchestrator, 'cameraAnimation', AnimationIndexes).name("Animation").onChange(() => {
            this.scene.orchestrator.camera.animation = Animations[this.scene.orchestrator.cameraAnimation]
        })

        camera.add(this.scene.orchestrator, 'cameraSpeed', 0.1, 5).name("Speed").onChange(() => {
            this.scene.orchestrator.camera.animationTime = 1000 / this.scene.orchestrator.cameraSpeed
        })

        const moves = this.preferences.addFolder("Move Settings")
        moves.open()

        moves.add(this.scene.orchestrator, 'moveAnimation', AnimationIndexes).name("Animation")
        moves.add(this.scene.orchestrator, 'moveSpeed', 0.1, 5).name("Speed")

        this.optionsFolder = group.addFolder("Options")
        const options = {
            handshake: () => this.scene.orchestrator.prolog.handshake(),
            undo: () => this.scene.orchestrator.undo(),
            quit: () => {
                this.scene.orchestrator.prolog.quit()
                close()
            },
            resetCamera: () => this.scene.orchestrator.resetCamera(),
            resetColors: () => {
                let colors = this.scene.orchestrator.resetColors()
                this.color1.setValue(colors.color1)
                this.color2.setValue(colors.color2)
                this.box.setValue(colors.box)
                this.tile.setValue(colors.tile)
            }
        }

        this.optionsFolder.open()
        this.optionsFolder.add(options, 'handshake').name("Handshake Server")
        this.optionsFolder.add(options, 'quit').name("Quit");
        this.optionsFolder.add(options, 'undo').name("Undo");
        this.optionsFolder.add(options, 'resetCamera').name("Reset Camera");
        this.optionsFolder.add(options, 'resetColors').name("Reset Colors");
    }

    /**
     * Method to add the replay button
     */
    addReplayButton() {
        if (this.replayButton == null)
            this.replayButton = this.preferences.add({
                replay: () => {
                    this.scene.orchestrator.replay()
                }
            }, "replay").name("Replay")
    }

    /**
     * Method to remove the replay button
     */
    removeReplayButton() {
        if (this.replayButton != null) {
            this.replayButton.remove()
            this.replayButton = null
        }
    }

    /**
     * Method to add the restart button
     */
    addRestartButton() {
        if (this.restartButton == null)
            this.restartButton = this.preferences.add({
                restart: () => {
                    this.scene.orchestrator.restart()
                }
            }, "restart").name("Restart")
    }

    /**
     * Method to remove the restart button
     */
    removeRestartButton() {
        if (this.restartButton != null) {
            this.restartButton.remove()
            this.restartButton = null
        }
    }

    /**
     * Method to reset interface, removing replay and restart button
     */
    resetInterface() {
        this.removeReplayButton()
        this.removeRestartButton()
    }

    addPauseButton() {
        if (this.pauseButton == null) this.pauseButton = this.optionsFolder.add({ pause: () => this.scene.orchestrator.pause() }, 'pause').name("Pause");
    }

    addContinueButton() {
        if (this.continueButton == null) this.continueButton = this.optionsFolder.add({continue: () => this.scene.orchestrator.continue() }, 'continue').name("Continue");
    }

    removeContinueButton() {
        if (this.continueButton != null) {
            this.continueButton.remove()
            this.continueButton = null
        }
    }

    removePauseButton() {
        if (this.pauseButton != null) {
            this.pauseButton.remove()
            this.pauseButton = null
        }
    }

    addBotsDifficulties() {
        let diffs = {"Easy": 1, "Normal": 2}
        if (this.scene.orchestrator.player1.type !== Players.HUMAN) {
            this.bots.add(this.scene.orchestrator.player1, "type", diffs).name("Player 1").onChange(() => this.scene.orchestrator.player1.type = parseInt(this.scene.orchestrator.player1.type))
        }
        if (this.scene.orchestrator.player2.type !== Players.HUMAN) {
            this.bots.add(this.scene.orchestrator.player2, "type", diffs).name("Player 2").onChange(() => this.scene.orchestrator.player2.type = parseInt(this.scene.orchestrator.player2.type))
        }
    }
}