var wclient;
require(['esri/workers/WorkerClient', 'dojo/dom', 'esri/config'], function (WorkerClient, dom, esriConfig) {
    if (!Worker) {
        alert('error - Browser Not Supported');
        return;
    }
    //This sample may require a proxy page to get the initial mutableWorker script on IE 10+.
    //When running on other modern browsers, the proxy will not be used.
    esriConfig.defaults.io.proxyUrl = '/proxy';
    
    //start with 'mutableWorker' if you want `importScript` and `addWorkerCallback` to work
    //you may not need these functions if you are only working with a single worker script of your own.
    wclient = new WorkerClient(['esri/workers/mutableWorker','local/worker-eval']);

    var codeInput = dom.byId('code');
    var resultBox = dom.byId('results');
    var statusEl = dom.byId('status');

    //add button click handlers
    dom.byId('btn-eval').addEventListener('click', evalCode, false);
    dom.byId('btn-cb1').addEventListener('click', addCallback1, false);
    dom.byId('btn-cb2').addEventListener('click', addCallback2, false);
    
    //add 'enter/return' key handler for input box
    codeInput.addEventListener('keydown', function (evt) {
        if (evt.keyCode == 13) {
            evalCode(evt);
        }
    }, false);

    function evalCode(e) {
        statusEl.innerHTML = '  &mdash; CALCULATING...';
        var myCode = '' + codeInput.value;
        wclient.postMessage({
            code: myCode
        }).then(function (msg) {
            statusEl.innerHTML = '&nbsp;';
            var logline = '>> ' + msg.code + '<br>' + msg.result;
            showResult(logline);
        },function(err){
            statusEl.innerHTML = ' &mdash; ERROR';
            showResult('Error -- ' + err.message);
        });
    }
    
    function showResult(text){
            resultBox.innerHTML = text + '<hr>' + resultBox.innerHTML;
            codeInput.select();
            codeInput.focus();
    }
    

    function addCallback1() {
        wclient.addWorkerCallback('local/toggleCase.js');
        //adds the toggleCase script to the worker and calls the 
        //script's 'main' function before actually posting anything
        //back to the main thread.
    }

    function addCallback2() {
        wclient.addWorkerCallback('local/negate.js', 'negateIt');
        //like above it adds the script and runs a function in it
        //before posting back to the main thread. However, since we
        //specified a function name as the 2nd argument, it uses that
        //instead of 'main'
    }

});