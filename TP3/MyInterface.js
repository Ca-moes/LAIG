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

    addThemesGroup(themes) {
        this.themes = this.gui.addFolder("Themes");
        this.themes.open();

        this.themes.add(this.scene.orchestrator, "selectedTheme", themes).name("Theme").onChange(() => { this.scene.orchestrator.updateScene() })
    }

    addModelsGroup(models) {
        this.themes.add(this.scene.orchestrator, "selectedModel", models).name("Model")
    }

    addColorsGroup() {
        this.themes.addColor(this.scene.orchestrator, 'player1color').name("Player 1").onChange(() => this.scene.orchestrator.onColorsChanged())
        this.themes.addColor(this.scene.orchestrator, 'player2color').name("Player 2").onChange(() => this.scene.orchestrator.onColorsChanged())
    }

    addGameGroup() {
        const group = this.gui.addFolder("Game")
        group.open()

        this.preferences = group.addFolder("Preferences");

        const bots = this.preferences.addFolder("Bots")
        bots.open()
        bots.add(this.scene.orchestrator, 'botDelay', 0, 3.0).name("Delay")

        const camera = this.preferences.addFolder("Camera Settings")
        camera.open()

        camera.add(this.scene.orchestrator, 'cameraAnimation', AnimationIndexes).name("Animation").onChange(() => {
            this.scene.orchestrator.camera.animation = Animations[this.scene.orchestrator.cameraAnimation]
        })

        camera.add(this.scene.orchestrator, 'cameraSpeed', 0.1, 2.5).name("Speed").onChange(() => {
            this.scene.orchestrator.camera.animationTime = 1000 / this.scene.orchestrator.cameraSpeed
        })

        const optionsFolder = group.addFolder("Options")
        const options = {
            handshake: () => this.scene.orchestrator.prolog.handshake(),
            undo: () => this.scene.orchestrator.undo(),
            quit: () => this.scene.orchestrator.prolog.quit(),
            resetCamera: () => this.scene.orchestrator.resetCamera()
        }

        optionsFolder.open()
        optionsFolder.add(options, 'handshake').name("Handshake Server")
        optionsFolder.add(options, 'quit').name("Quit Server");
        optionsFolder.add(options, 'undo').name("Undo");
        optionsFolder.add(options, 'resetCamera').name("Reset Camera");
    }

    addReplayButton() {
        if (this.replayButton == null)
            this.replayButton = this.preferences.add({replay: () => {this.scene.orchestrator.changeState(new ReplayState(this.scene.orchestrator))}}, "replay")
    }

    removeReplayButton() {
        if (this.replayButton != null) {
            this.replayButton.remove()
            this.replayButton = null
        }
    }

    addStartButton(obj) {
        if (this.startButton == null)
            this.startButton = this.gui.add({start: () => obj.startGame()}, "start")
    }

    removeStartButton() {
        if (this.startButton != null) {
            this.startButton.remove()
            this.startButton = null
        }
    }

    addRestartButton() {
        if (this.restartButton == null)
            this.restartButton = this.preferences.add({restart: () => {this.scene.orchestrator.restart()}}, "restart")
    }

    removeRestartButton() {
        if (this.restartButton != null) {
            this.restartButton.remove()
            this.restartButton = null
        }
    }

    resetInterface() {
        this.removeReplayButton()
        this.removeRestartButton()
    }
}