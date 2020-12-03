class MyPrologInterface {
    constructor(orchestrator) {
        this.orchestrator = orchestrator

        console.log(orchestrator)
    }

    getRequest(command) {
        getPrologRequest(command, this.orchestrator.notifyReplyReceived)
    }
}

function onSuccess(data) {
    this.callback(JSON.parse(data.target.response))
}

function onError() {
    console.log("error on request")
}

function  getPrologRequest(requestString, callback) {
    var requestPort = 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.callback = callback
    request.arguments = Array.prototype.slice.call(arguments, 2);

    request.onload = onSuccess
    request.onerror = onError

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.timeout = 5000
    request.send();  // bloqueia aqui até receber resposta
}


