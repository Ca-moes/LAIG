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
        this.getRequest(`spot(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer}',${tile.x}-${tile.y})`)
    }

    /**
     * Request prolog
     * Q: Can user move to a certain tile?
     * @param {MyTile} tile Tile to move piece to
     */
    canMoveToTile(tile) {
        this.getRequest(`moveto(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer}',${this.orchestrator.currentMovement.origTile.x}-${this.orchestrator.currentMovement.origTile.y}-${tile.x}-${tile.y})`)
    }

    checkWinner() {
        this.getRequest(`check_winner(${this.orchestrator.gameboard.toString()},'Player${this.orchestrator.currentPlayer}')`)
    }

    getRequest(command) {
        /* async call */
        getPrologRequest(command, this.orchestrator.notifyReplyReceived, this.orchestrator)
    }

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
        this.orchestrator.notifyReplyReceived(request.responseText)
    }

}

function onSuccess(data) {
    this.callback.apply(data.target.orchestrator, [data.target.response])
}

function onError() {
    console.log("error on request")
}

/* asynchronous call with a callback */
function  getPrologRequest(requestString, callback, orchestrator) {
    const requestPort = 8081
    const request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.callback = callback
    request.arguments = Array.prototype.slice.call(arguments, 2);

    request.orchestrator = orchestrator

    request.onload = onSuccess
    request.onerror = onError

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.timeout = 5000
    request.send();  // bloqueia aqui até receber resposta
}


