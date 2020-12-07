class MyPrologInterface {
    constructor(orchestrator) {
        this.orchestrator = orchestrator
    }

    /**
     * Request prolog
     * Q: Can user pick a certain tile?
     * @param {MyTile} tile Tile to be picked
     */
    canPickTile(tile) {
        return this.getRequest(`spot(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer}',${tile.x}-${tile.y})`)
    }

    /**
     * Request prolog
     * Q: Can user move to a certain tile?
     * @param {MyTile} tile Tile to move piece to
     */
    canMoveToTile(tile) {
        return this.getRequest(`moveto(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer}',${this.orchestrator.currentMovement.origTile.x}-${this.orchestrator.currentMovement.origTile.y}-${tile.x}-${tile.y})`)
    }

    /**
     * Request prolog
     * Q: Do we have a winner?
     * @returns {int} 1 - player 1 wins | -1 - player 2 wins | 0 - no winner
     */
    checkWinner() {
        return this.getRequest(`check_winner(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer}')`)
    }

    /**
     * Request prolog
     * Q: To which tiles can the player move its piece?
     * @param {MyTile} tile origin position
     * @returns {Array<Array<int>>} [[x,y], [x,y]] possible target tiles
     */
    getPossibleTiles(tile) {
        return this.getRequest(`available_moves(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer}',${tile.x}-${tile.y})`)
    }

    getRequest(command) {
        /* sync call */
        return this.getPrologRequest(command)
    }

    /**
     * Verify Handshake -> check console
     */
    handshake() {
        const requestPort = 8081
        const request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/handshake', false);

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();  // bloqueia aqui até receber resposta
        if (JSON.parse(request.responseText) === "handshake")
            console.log("Handshake Successful")
        else
            console.log("Handshake Failed")
    }

    /**
     * Request quit server -> check console
     */
    quit() {
        const request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:8081/quit', false);

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();  // bloqueia aqui até receber resposta
        if (JSON.parse(request.responseText) === "goodbye")
            console.log("Quit Successful")
        else
            console.log("Quit Failed")
    }

    /* Synchronous call */
    getPrologRequest(requestString) {
        const requestPort = 8081
        const request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, false);

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        request.send();  // bloqueia aqui até receber resposta
        return JSON.parse(request.responseText)
    }
}

