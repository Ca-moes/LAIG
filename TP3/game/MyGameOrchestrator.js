class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene
        this.gameSequence = new MyGameSequence()
        this.animator = new MyAnimator(this, this.gameSequence)
        // The gameboard is assigned to the orchestrator as soon as the XMLScene is Loaded
        this.theme = new MySceneGraph("test.xml", this.scene)
        // this.prolog = new MyPrologInterface(…)

        this.stateMachine = new StateMachine()
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
            this.theme.updateAnimations(time);
            this.gameboard.update(time)
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

    notifyTileSelection(tile) {
        this.stateMachine.manageEvent(Event.PickPiece)
        switch (this.stateMachine.currentState) {
            case State.STARTMOVE:
                this.stateMachine.initSubState(SubState.MoveState, {piece: tile.getPiece(), startTile: tile})
                break
            case State.MOVE:
                this.stateMachine.initSubState(SubState.MoveState, {endTile: tile})

                const move = new MyGameMove(this.stateMachine.substate.piece,
                    this.stateMachine.substate.startTile,
                    this.stateMachine.substate.endTile,
                    this.gameboard)

                move.animate(Date.now() / 1000)
                this.gameSequence.addMove(move)
                break
            default:
                break
        }


    }

    orchestrate() {
        // TODO state machine
    }
}