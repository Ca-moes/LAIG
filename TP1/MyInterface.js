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
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    addDropdown(id, list, name) {
        const group = this.gui.addFolder("Views");
        group.open();

        list.push("default/reset")
        group.add(this.scene, id, list).name(name).onChange(this.scene.updateView.bind(this.scene))
    }

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
}