/**
 * Game's Sequence of Moves
 */
class MyGameSequence {
    /**
     * Starts an Empty Stack of Movements
     */
    constructor() {
        this.moves = []
    }

    /**
     * Adds a Movement to the stack
     * @param gameMove
     */
    addMove(gameMove) {
        this.moves.push(gameMove)
    }

    /**
     * Undoes the last movement and pops it from the stack
     * @returns {MyGameMove}    The last Movement performed
     */
    undo() {
        return this.moves.pop()
    }

    /**
     * Allows for Orchestrator to replay the last movement
     * @returns {MyGameMove}    The last Movement performed
     */
    replay() {
        return this.moves[this.moves.size - 1]
    }
}