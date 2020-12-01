class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene
        this.gameSequence = new MyGameSequence()
        this.animator = new MyAnimator(this, this.gameSequence)
        // The gameboard is assigned to the orchestrator as soon as the XMLScene is Loaded
        this.theme = new MySceneGraph("test.xml", this.scene)
        // this.prolog = new MyPrologInterface(…)
    }

    update(time) {
        if (this.scene.sceneInited && !this.scene.timeSet) {
            this.theme.setAnimationsStartTime(time / 1000);
            this.scene.timeSet = true;
        }
        else if (this.scene.sceneInited && this.scene.timeSet) {
            this.theme.updateAnimations(time / 1000);
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

    orchestrate() {
        // TODO still not sure what to do here
    }
}