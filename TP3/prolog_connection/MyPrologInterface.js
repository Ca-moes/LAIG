class MyPrologInterface {
    constructor(orchestrator) {
        this.orchestrator = orchestrator
    }

    /**
     * Request prolog
     * Q: Can user pick a certain tile?
     * @param {MyTile} tile Tile to be picked
     * @param {GameState} state current game state
     * @param {Function} callback callback to be called when a reply is available
     */
    canPickTile(tile, state, callback) {
        this.getPrologRequest(`spot(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer.code}',${tile.x}-${tile.y})`, state, callback)
    }

    /**
     * Request prolog
     * Q: Can user move to a certain tile?
     * @param {MyTile} tile Tile to move piece to
     * @param {GameState} state current game state
     * @param {Function} callback callback to be called when a reply is available
     */
    canMoveToTile(tile, state, callback) {
        this.getPrologRequest(`moveto(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer.code}',${this.orchestrator.currentMovement.origTile.x}-${this.orchestrator.currentMovement.origTile.y}-${tile.x}-${tile.y})`, state, callback)
    }

    /**
     * Request prolog
     * Q: Do we have a winner?
     * @param {GameState} state current game state
     * @param {Function} callback callback to be called when a reply is available
     * Answer {int} 1 - player 1 wins | -1 - player 2 wins | 0 - no winner
     */
    checkWinner(state, callback) {
        this.getPrologRequest(`check_winner(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer.code}')`, state, callback)
    }

    /**
     * Request prolog
     * Q: To which tiles can the player move its piece?
     * @param {MyTile} tile origin position
     * @param {GameState} state current game state
     * @param {Function} callback callback to be called when a reply is available
     */
    getPossibleTiles(tile, state, callback) {
        this.getPrologRequest(`available_moves(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer.code}',${tile.x}-${tile.y})`, state, callback)
    }

    /**
     * Request prolog
     * Q: Has Player X reached final game state?
     * @param {GameState} state current game state
     * @param {Function} callback callback to be called when a reply is available
     */
    checkFinalState(state, callback) {
        this.getPrologRequest(`check_final(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer.code}')`, state, callback)
    }

    /**
     * Request prolog
     * Q: Can Player X remove this piece?
     * @param {MyTile} tile containing piece to remove
     * @param {GameState} state current game state
     * @param {Function} callback callback to be called when a reply is available
     */
    canRemovePiece(tile, state, callback) {
        this.getPrologRequest(`spot_remove(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer.code}',${tile.x}-${tile.y})`, state, callback)
    }

    /**
     * Request Prolog
     * Q: Where to move?
     * @param {GameState} state current game state
     * @param {Function} callback callback to be called when a reply is available
     */
    getBotNextMove(state, callback) {
        const diff = (this.orchestrator.currentPlayer.type === Players.BOT_EASY) ? "'Easy'" : "'Normal'"
        const player = "'Player" + this.orchestrator.currentPlayer.code + "'"

        this.getPrologRequest(`make_move(${diff},${this.orchestrator.gameboard.toString()},${player})`, state, callback)
    }

    /**
     * Request Prolog
     * Q: Where to remove?
     * @param {GameState} state current game state
     * @param {Function} callback callback to be called when a reply is available
     */
    getBotRemoveMove(state, callback) {
        const diff = (this.orchestrator.currentPlayer.type === Players.BOT_EASY) ? "'Easy'" : "'Normal'"
        const player = "'Player" + this.orchestrator.currentPlayer.code + "'"

        this.getPrologRequest(`make_remove(${diff},${this.orchestrator.gameboard.toString()},${player})`, state, callback)
    }

    /**
     * Verify Handshake -> check console
     */
    handshake() {
        const request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:8081/handshake', true);

        request.onload = () => {
            if (JSON.parse(request.responseText) === "handshake")
                console.log("Handshake Successful")
            else
                console.log("Handshake Failed")
        }
        request.onerror = () => console.log("Failed to Contact Server")

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();  // bloqueia aqui até receber resposta
    }

    /**
     * Request quit server -> check console
     */
    quit() {
        const request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:8081/quit', true);

        request.onload = () => {
            if (JSON.parse(request.responseText) === "goodbye")
                console.log("Quit Successful")
            else
                console.log("Quit Failed")
        }
        request.onerror = () => console.log("Failed to Contact Server")

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();  // bloqueia aqui até receber resposta
    }

    /**
     * Async Call to request Prolog Server
     * @param {String} requestString Request String for the Server
     * @param {GameState} state current game state to apply on callback
     * @param callback
     */
    getPrologRequest(requestString, state, callback) {
        const request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:8081/' + requestString, false);

        // request.onload = () => { callback.apply(state, [JSON.parse(request.responseText)]) }
        // request.onerror = () => console.log("error getting request")

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        // request.timeout = 5000
        request.send();

        callback.apply(state, [JSON.parse(request.responseText)])
    }
}



