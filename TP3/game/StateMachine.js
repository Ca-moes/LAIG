const State = Object.freeze({
    READY: 0,
    STARTMOVE: 1,
    MOVE: 2
})

const Event = Object.freeze({
    PickPiece: 0
})

const SubState = Object.freeze({
    MoveState: 0
})

class StateMachine {
    constructor() {
        this.currentState = State.READY
    }

    initSubState(substate, context) {
        switch (substate) {
            case SubState.MoveState:
                if (this.currentState === State.STARTMOVE) {
                    this.substate = {
                        piece: context.piece,
                        startTile: context.startTile
                    }
                }
                if (this.currentState === State.MOVE) {
                    this.substate.endTile = context.endTile
                }
                break
            default:
                break
        }
    }

    /**
     * Receive an Event and process game state
     * @param {Event} event event to be processed
     */
    manageEvent(event) {
        switch (this.currentState) {
            case State.READY:
                if (event === Event.PickPiece) {
                    this.currentState = State.STARTMOVE
                }
                break
            case State.STARTMOVE:
                if (event === Event.PickPiece) {
                    this.currentState = State.MOVE
                }
                break
            case State.MOVE:
                /* Pick 2nd Piece */
                if (event === Event.PickPiece) {
                    this.currentState = State.STARTMOVE
                }
                break
            default:
                break
        }
    }
}
