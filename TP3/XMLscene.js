/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.orchestrator = new MyGameOrchestrator(this)

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this);

        this.selectedView = -1
        this.lightFlags = {}

        this.last = performance.now();

        // Sprites
        this.shaderAppearance = new CGFappearance(this);
        this.spriteShader = new CGFshader(this.gl, "shaders/spritesheet.vert", "shaders/spritesheet.frag");

        this.gl.enable(this.gl.BLEND);         // enables blending
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        // shaders
        this.tileHighlightingShader = new CGFshader(this.gl, "shaders/tilehighlighting.vert", "shaders/tilehighlighting.frag")

        // enable picking
        this.setPickEnabled(true);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(false);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();
        //TO-DO this.initCameras();

        // add dropdown for views with default view selected
        this.interface.addViewsGroup("selectedView", this.graph.viewsIds, "View")
        // add lights block
        this.interface.addLightsGroup(this.graph.lights)
        // update view and lights accordingly
        this.updateView()
        this.updateLights()

        // gameboard is assigned to the orchestrator here
        this.orchestrator.gameboard = this.orchestrator.theme.gameboard
        this.orchestrator.gameboard.orchestrator = this.orchestrator

        this.interface.addGameGroup()

        this.sceneInited = true;
        this.setUpdatePeriod(1000.0/20.0); // 60Hz

        this.timeSet = false
    }

    /**
     * Displays the scene.
     */
    display() {
        this.now = performance.now();
        const fps = 1000 / (this.now - this.last);
        this.last = this.now;

        document.getElementById('fps').firstElementChild.innerHTML = "FPS: " + Math.round(fps)
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(false);
            this.lights[i].enable();
        }
        
        this.updateLights();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();
 
            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            this.orchestrator.display();
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    update(t) {
        this.orchestrator.update(t / 1000)
    }

    /**
     * Updates the View if the Camera is changed via Interface
     */
    updateView() {
        if (this.selectedView === "default/reset") {
            this.initCameras()
        } else {
            this.camera = this.graph.views[this.selectedView]
        }
        this.interface.setActiveCamera(this.camera)
    }

    /**
     * Updates the Lights if these are changed via Interface
     */
    updateLights() {
        let i = 0;
        for (let key in this.lightFlags) {
            if (this.lightFlags.hasOwnProperty(key)) {
                if (this.lightFlags[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(true);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }
    }
}