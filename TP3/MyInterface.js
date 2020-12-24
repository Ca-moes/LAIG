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
        const group = this.gui.addFolder("Views");
        group.open();

        this.scene.selectedView = this.scene.graph.defaultView

        list.push("default/reset")
        group.add(this.scene, id, list).name(name).onChange(this.scene.updateView.bind(this.scene))
    }

    /**
     * Creates a Folder in Interface for the Lights
     * @param {any} lights Map of Lights to pass to Folder
     */
    addLightsGroup(lights) {
        const group = this.gui.addFolder("Lights");
        group.open();

        for (let key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightFlags[key] = lights[key][0];
                group.add(this.scene.lightFlags, key).onChange(this.scene.updateLights.bind(this.scene))
            }
        }
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

        const options = group.addFolder("Options")
        options.open()
        let undo = {add: () => this.scene.orchestrator.undo()};
        let handshake = {add: () => this.scene.orchestrator.prolog.handshake()};
        let quit = {add: () => this.scene.orchestrator.prolog.quit()};
        options.add(handshake, 'add').name("Handshake");
        options.add(undo, 'add').name("Undo");
        options.add(quit, 'add').name("Quit");
    }

    addReplayButton() {
        if (this.replayButton == null)
            this.replayButton = this.preferences.add({replay: () => {this.scene.orchestrator.changeState(new ReplayState(this.scene.orchestrator))}}, "replay")
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

    removeReplayButton() {
        if (this.replayButton != null) {
            this.replayButton.remove()
            this.replayButton = null
        }
    }

    resetInterface() {
        this.removeReplayButton()
        this.removeRestartButton()
    }
}