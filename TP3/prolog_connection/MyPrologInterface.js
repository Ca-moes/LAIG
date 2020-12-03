class MyPrologInterface {
    constructor(){
        
    }

    getPrologRequest(requestString, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, false);
    
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.timeout = 5000  
        request.send();  // bloqueia aqui até receber resposta
    
        return request
    }
    
    
    /**
     * 
     * @param {String} request 
     */
    prologRequest(request) {
        let response = getPrologRequest(request, handleReply)
        console.log(response.responseText)
        return response.responseText
    }
    
}


